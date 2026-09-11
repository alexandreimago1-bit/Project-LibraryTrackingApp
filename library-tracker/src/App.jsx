import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { finishedReading, loadLibrary, loadProfile, removeBook, saveLibrary, saveProfile, startReading } from './storage.js'
import RootLayout from './layouts/RootLayout.jsx'
import Home from './pages/Home.jsx'
import Library from './pages/Library.jsx'
import Cart from './pages/Cart.jsx'
import ReadingDetails from './pages/ReadingDetails.jsx'
import Profile from './pages/Profile.jsx'
import LibraryOverview from './pages/LibraryOverview.jsx'

function App() {
  const [library, setLibrary] = useState(loadLibrary)
  const [profile, setProfile] = useState(loadProfile)
  useEffect(() => saveLibrary(library), [library])
  useEffect(() => saveProfile(profile), [profile])

  return <BrowserRouter basename="/Project-LibraryTrackingApp"><Routes>
    <Route path='/' element={<RootLayout library={library} setLibrary={setLibrary} profile={profile} setProfile={setProfile} />}>
      <Route index element={<Home />} />
      <Route path='library' element={<LibraryOverview />} />
      <Route path='shelves' element={<Library library={library} setLibrary={setLibrary} onRemove={(id) => setLibrary(removeBook(library, id))} onStartReading={(id) => setLibrary(startReading(library, id))} onFinishReading={(id) => setLibrary(finishedReading(library, id))} />} />
      <Route path='cart' element={<Cart library={library} setLibrary={setLibrary} />} />
      <Route path='reading/:bookId' element={<ReadingDetails />} />
      <Route path='profile' element={<Profile />} />
    </Route>
  </Routes></BrowserRouter>
}
export default App
