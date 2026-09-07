import { useState } from 'react'
import { createBook, addBook } from '../storage.js'
import BookCard from '../components/BookCard.jsx'

function Library({ library, onRemove, onStartReading, onFinishReading, setLibrary }) {
  const [formData, setFormData] = useState({ title: "", author: "", pages: "", genre: "" })
  const [showForm, setShowForm] = useState(false)

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!formData.title.trim() || !formData.author.trim() || Number(formData.pages) <= 0) {
      return
    }
    const newBook = createBook(formData.title, formData.author, Number(formData.pages), formData.genre)
    setLibrary(addBook(library, newBook))
    setFormData({ title: "", author: "", pages: "", genre: "" })
    setShowForm(false)
  }

  return (
    <div>
      <h1>Library</h1>
      {showForm ? (
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder='Name' />
          <input type="text" name="author" value={formData.author} onChange={handleChange} placeholder='Author' />
          <input type="number" name="pages" value={formData.pages} onChange={handleChange} placeholder='Page Number' />
          <input type="text" name="genre" value={formData.genre} onChange={handleChange} placeholder='Genre' />
          <button type="submit">Submit</button>
        </form>
      ) : null}
      <button onClick={() => setShowForm(true)}>Add Book</button>
      <div id="library">
        {library.map(book => (
          <div key={book.id}>
            <BookCard
              book={book}
              onRemove={() => onRemove(book.id)}
              onStartReading={() => onStartReading(book.id)}
              onFinishReading={() => onFinishReading(book.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Library