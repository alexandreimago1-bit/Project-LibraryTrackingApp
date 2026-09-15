import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { createBook } from '../storage.js'
import BookCard from '../components/BookCard.jsx'
import '../styles/Library.css'

const STATUSES = [{ key: 'tbr', label: 'To Be Read' }, { key: 'reading', label: 'Currently Reading' }, { key: 'finished', label: 'Finished Books' }]
const blankForm = { title: '', author: '', pages: '', genre: '', status: 'tbr' }

function Library({ library, onAddBook, onRemove, onStartReading, onFinishReading, onMoveBook }) {
  const [formData, setFormData] = useState(blankForm); const [showForm, setShowForm] = useState(false); const [sortBy, setSortBy] = useState('custom'); const [searchParams] = useSearchParams()
  const selectedStatus = searchParams.get('status') || 'all'; const visibleStatuses = selectedStatus === 'all' ? STATUSES : STATUSES.filter((status) => status.key === selectedStatus)
  const groupedBooks = useMemo(() => STATUSES.reduce((groups, status) => { const books = library.filter((book) => book.status === status.key); groups[status.key] = [...books].sort((a, b) => sortBy === 'title' ? a.title.localeCompare(b.title) : sortBy === 'author' ? a.author.localeCompare(b.author) : sortBy === 'genre' ? (a.genre || '').localeCompare(b.genre || '') : a.shelfOrder - b.shelfOrder); return groups }, {}), [library, sortBy])
  function handleSubmit(event) { event.preventDefault(); if (!formData.title.trim() || !formData.author.trim() || Number(formData.pages) <= 0) return; onAddBook(createBook(formData.title, formData.author, Number(formData.pages), formData.genre, formData.status)); setFormData(blankForm); setShowForm(false) }
  return <div className='library-page'><header className='library-header'><div><p className='eyebrow'>Your shelves</p><h1>{selectedStatus === 'all' ? 'Library' : visibleStatuses[0].label}</h1></div><div className='library-tools'><label className='select-wrap'>Sort <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value='custom'>My shelf order</option><option value='title'>Title</option><option value='author'>Author</option><option value='genre'>Genre</option></select></label><button className='primary-button' onClick={() => setShowForm((shown) => !shown)}>{showForm ? 'Close' : '+ Add book'}</button></div></header>
    {showForm && <form className='book-form' onSubmit={handleSubmit}><input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder='Book title' /><input required value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder='Author' /><input required min='1' type='number' value={formData.pages} onChange={(e) => setFormData({ ...formData, pages: e.target.value })} placeholder='Pages' /><input value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} placeholder='Genre' /><label className='form-select'>Shelf <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>{STATUSES.map((status) => <option key={status.key} value={status.key}>{status.label}</option>)}</select></label><button className='submit-button'>Save book</button></form>}
    {visibleStatuses.map((status) => <section className='shelf-section' key={status.key}><div className='shelf-header'><h2>{status.label}</h2><span>{groupedBooks[status.key].length} books</span></div><div className='shelf'>{groupedBooks[status.key].length === 0 ? <div className='empty-shelf'>No books on this shelf yet.</div> : groupedBooks[status.key].map((book) => <BookCard key={book.id} book={book} onRemove={() => onRemove(book.id)} onStartReading={() => onStartReading(book.id)} onFinishReading={() => onFinishReading(book.id)} onMoveLeft={sortBy === 'custom' ? () => onMoveBook(book.id, -1) : undefined} onMoveRight={sortBy === 'custom' ? () => onMoveBook(book.id, 1) : undefined} />)}</div></section>)}
  </div>
}
export default Library
