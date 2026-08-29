import { useState } from 'react'
import { loadLibrary, startReading, finishedReading, removeBook, createBook, addBook } from './storage.js'
import './App.css'

function App(){
  const [library, setLibrary] = useState(loadLibrary)
  const [formData, setFormData] = useState({title:"", author: "", pages: ""})
const [showForm, setShowForm] = useState(false);
  function handleChange(event){
    setFormData({...formData,[event.target.name]: event.target.value})
  }

  function handleSubmit(event){
  event.preventDefault();
  if (!formData.title.trim() || !formData.author.trim() || Number(formData.pages) <= 0){
    return;
  }
  const newBook = createBook(formData.title, formData.author, Number(formData.pages))
  setLibrary(addBook(library,newBook))
  setFormData({ title: "", author: "", pages: ""})
  setShowForm(false)
}
console.log(library)
return(
  <div>
    {showForm ? ( <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} />
      <input type="text" name="author" value={formData.author} onChange={handleChange} />
      <input type="number" name="pages" value={formData.pages} onChange={handleChange} />
      <button type = "submit">Submit</button>
    </form>) : null }
    <button onClick={() => setShowForm(true)}>Add Book</button>
    <div id="library">
      {library.map(book => (
        <div key={book.id}>
          {book.title} - {book.author} - {book.pages} - {book.status}
          <button onClick={() => {
            if (book.status == 'tbr'){
              setLibrary(startReading(library, book.id));
            } else if (book.status == 'reading'){
              setLibrary(finishedReading(library, book.id));
            } else if (book.status == 'finished'){
              setLibrary(startReading(library, book.id));
            }
          }}> {book.status == 'tbr' ? 'Start Reading': book.status == 'reading'? 'Finish':'Read Again' } </button>
          <button onClick={() => { setLibrary(removeBook(library, book.id)) }}>Remove</button>
        </div>
      ))}
    </div>
  </div>
)

}
export default App