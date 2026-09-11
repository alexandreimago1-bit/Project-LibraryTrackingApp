import { Link } from 'react-router-dom'

function BookCard({ book, onRemove, onStartReading, onFinishReading, onMoveLeft, onMoveRight }) {
  const statusLabel = { tbr: 'To read', reading: 'Reading', finished: 'Finished' }[book.status]
  const actionLabel = book.status === 'tbr' ? 'Start reading' : book.status === 'reading' ? 'Finish book' : 'Read again'
  const handleAction = () => book.status === 'reading' ? onFinishReading() : onStartReading()
  return <article className={`book-card book-${book.status}`}>
    <div className='book-cover'><div className='book-spine' /><div className='book-front'><span className='mini-tag'>{statusLabel}</span><h3>{book.title}</h3><p>{book.author}</p></div></div>
    <div className='book-meta'><span>{book.genre || 'General'}</span><span>{book.pages} pages</span></div>
    <div className='book-actions'><button className='mini-button' onClick={onRemove}>Remove</button><button className='action-button' onClick={handleAction}>{actionLabel}</button></div>
    <div className='book-footer'>{book.status === 'reading' && <Link to={`/reading/${book.id}`}>Open notes</Link>}{onMoveLeft && <div className='order-actions'><button onClick={onMoveLeft} aria-label={`Move ${book.title} left`}>←</button><button onClick={onMoveRight} aria-label={`Move ${book.title} right`}>→</button></div>}</div>
  </article>
}
export default BookCard
