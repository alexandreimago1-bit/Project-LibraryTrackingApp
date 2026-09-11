import { Link, useOutletContext } from 'react-router-dom'
import '../styles/LibraryOverview.css'

const shelves = [
  { key: 'tbr', title: 'To Be Read', description: 'Already yours, waiting for their turn.', link: '/shelves?status=tbr', linkLabel: 'Open TBR shelf' },
  { key: 'finished', title: 'Finished Books', description: 'Every story you have completed.', link: '/shelves?status=finished', linkLabel: 'Open finished shelf' },
  { key: 'wishlist', title: 'Shopping List', description: 'Books you would love to bring home.', link: '/cart', linkLabel: 'Open shopping list' },
]

function LibraryOverview() {
  const { library } = useOutletContext()
  return <main className='overview-page'><header className='overview-header'><p className='eyebrow'>All your stories</p><h1>Library</h1><p>Three shelves for the books you own, have finished, and hope to buy.</p></header>
    <div className='overview-shelves'>{shelves.map((shelf) => { const books = library.filter((book) => book.status === shelf.key).sort((a, b) => a.shelfOrder - b.shelfOrder); return <section className='overview-shelf' key={shelf.key}><div className='shelf-header'><div><h2>{shelf.title}</h2><p>{shelf.description}</p></div><span>{books.length} books</span></div><div className='overview-books'>{books.length === 0 ? <p className='overview-empty'>Nothing here yet.</p> : books.map((book) => <div className={`shelf-book shelf-book-${shelf.key}`} key={book.id}><strong>{book.title}</strong><span>{book.author}</span></div>)}</div><Link className='overview-link' to={shelf.link}>{shelf.linkLabel} →</Link></section> })}</div>
  </main>
}
export default LibraryOverview
