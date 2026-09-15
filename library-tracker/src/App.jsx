import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { loadLibrary, loadProfile, moveBook as reorderBooks, removeBook } from './storage.js'
import { supabase } from './lib/supabase.js'
import { addNote, createBook, deleteBook, deleteNote, fetchLibrary, fetchProfile, saveProfile as saveRemoteProfile, updateBook, updateBookOrder } from './lib/libraryApi.js'
import RootLayout from './layouts/RootLayout.jsx'
import Auth from './pages/Auth.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'
import Cart from './pages/Cart.jsx'
import ReadingDetails from './pages/ReadingDetails.jsx'
import Profile from './pages/Profile.jsx'
import LibraryOverview from './pages/LibraryOverview.jsx'

function App() {
  const [library, setLibrary] = useState(loadLibrary)
  const [profile, setProfile] = useState(loadProfile)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(() => Boolean(supabase))
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return undefined
    Promise.all([fetchLibrary(), fetchProfile(session.user.id)])
      .then(([nextLibrary, nextProfile]) => {
        setLibrary(nextLibrary)
        setProfile(nextProfile)
      })
      .catch((error) => setDataError(error.message))
      .finally(() => setDataLoading(false))
    return undefined
  }, [session])

  async function addBookToLibrary(book) {
    try {
      const savedBook = await createBook({ ...book, shelfOrder: library.filter((item) => item.status === book.status).length }, session.user.id)
      setLibrary((current) => [...current, savedBook])
    } catch (error) { setDataError(error.message) }
  }

  async function updateBookInLibrary(id, changes) {
    try {
      const savedBook = await updateBook(id, changes)
      setLibrary((current) => current.map((book) => book.id === id ? savedBook : book))
    } catch (error) { setDataError(error.message) }
  }

  async function removeBookFromLibrary(id) {
    try {
      await deleteBook(id)
      setLibrary((current) => removeBook(current, id))
    } catch (error) { setDataError(error.message) }
  }

  async function moveBookInLibrary(id, direction) {
    const nextLibrary = reorderBooks(library, id, direction)
    setLibrary(nextLibrary)
    try { await updateBookOrder(nextLibrary) } catch (error) { setDataError(error.message) }
  }

  async function addNoteToBook(bookId, text) {
    try {
      const savedNote = await addNote(bookId, session.user.id, text)
      setLibrary((current) => current.map((book) => book.id === bookId ? { ...book, notes: [...book.notes, { id: savedNote.id, text: savedNote.text, createdAt: new Date(savedNote.created_at).toLocaleDateString() }] } : book))
    } catch (error) { setDataError(error.message) }
  }

  async function removeNoteFromBook(bookId, noteId) {
    try {
      await deleteNote(noteId)
      setLibrary((current) => current.map((book) => book.id === bookId ? { ...book, notes: book.notes.filter((note) => note.id !== noteId) } : book))
    } catch (error) { setDataError(error.message) }
  }

  async function updateProfile(nextProfile) {
    try {
      const savedProfile = await saveRemoteProfile(nextProfile, session.user.id)
      setProfile({ name: savedProfile.name, age: savedProfile.age || '', favoriteGenre: savedProfile.favorite_genre, favoriteBook: savedProfile.favorite_book, quote: savedProfile.quote, photo: savedProfile.photo_url })
    } catch (error) { setDataError(error.message) }
  }

  if (authLoading) return <main>Loading your library...</main>
  if (!session) return <Auth />
  if (dataLoading) return <main>Loading your library...</main>
  if (dataError) return <main><h1>Could not load your library</h1><p>{dataError}</p></main>

  return <BrowserRouter basename="/Project-LibraryTrackingApp"><Routes>
    <Route path='/' element={<RootLayout library={library} setLibrary={setLibrary} profile={profile} setProfile={setProfile} onSignOut={() => supabase.auth.signOut()} onAddBook={addBookToLibrary} onUpdateBook={updateBookInLibrary} onRemoveBook={removeBookFromLibrary} onMoveBook={moveBookInLibrary} onAddNote={addNoteToBook} onDeleteNote={removeNoteFromBook} onSaveProfile={updateProfile} />}>
      <Route index element={<Home />} />
      <Route path='library' element={<LibraryOverview />} />
      <Route path='shelves' element={<Library library={library} setLibrary={setLibrary} onAddBook={addBookToLibrary} onRemove={removeBookFromLibrary} onStartReading={(id) => updateBookInLibrary(id, { status: 'reading' })} onFinishReading={(id) => updateBookInLibrary(id, { status: 'finished' })} onMoveBook={moveBookInLibrary} />} />
      <Route path='cart' element={<Cart library={library} onAddBook={addBookToLibrary} onUpdateBook={updateBookInLibrary} onRemoveBook={removeBookFromLibrary} />} />
      <Route path='reading/:bookId' element={<ReadingDetails />} />
      <Route path='profile' element={<Profile />} />
    </Route>
  </Routes></BrowserRouter>
}
export default App
