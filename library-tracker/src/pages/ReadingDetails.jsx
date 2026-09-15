import { useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import '../styles/ReadingDetails.css'
function ReadingDetails() {
  const { bookId } = useParams(); const navigate = useNavigate(); const { library, onUpdateBook, onAddNote, onDeleteNote } = useOutletContext(); const [note, setNote] = useState(''); const book = library.find((item) => item.id === bookId)
  if (!book) return <div className='missing-page'><h1>Book not found</h1><Link to='/library'>Back to library</Link></div>
  function saveNote(event) { event.preventDefault(); if (!note.trim()) return; onAddNote(book.id, note.trim()); setNote('') }
  function finishBook() { onUpdateBook(book.id, { status: 'finished' }); navigate('/shelves?status=finished') }
  return <main className='reading-page'><Link className='back-link' to='/'>← Home</Link><div className='reading-layout'><section className='reading-cover'><span>Being read</span><h1>{book.title}</h1><p>{book.author}</p><small>{book.genre || 'General'} · {book.pages} pages</small><button className='action-button' onClick={finishBook}>Mark as finished</button></section><section className='notes-panel'><div><p className='eyebrow'>Reading notebook</p><h2>My notes</h2></div><form onSubmit={saveNote}><label htmlFor='new-note'>A thought, quote, or reminder</label><textarea id='new-note' value={note} onChange={(event) => setNote(event.target.value)} placeholder='Write while the story is fresh…' /><button className='primary-button'>Save note</button></form><div className='notes-list'>{book.notes.length === 0 ? <p className='no-notes'>Your notes will live here.</p> : book.notes.map((item) => <article className='note' key={item.id}><p>{item.text}</p><footer><span>{item.createdAt}</span><button onClick={() => onDeleteNote(book.id, item.id)}>Delete</button></footer></article>)}</div></section></div></main>
}
export default ReadingDetails
