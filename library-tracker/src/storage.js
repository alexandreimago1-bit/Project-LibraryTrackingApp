const BOOK_STATUSES = ['wishlist', 'tbr', 'reading', 'finished']

function normaliseBook(book, index) {
  const status = BOOK_STATUSES.includes(book.status) ? book.status : 'tbr'
  return {
    id: typeof book.id === 'string' ? book.id : crypto.randomUUID(),
    title: typeof book.title === 'string' ? book.title : 'Untitled book',
    author: typeof book.author === 'string' ? book.author : 'Unknown author',
    pages: Number.isFinite(book.pages) ? book.pages : 0,
    genre: typeof book.genre === 'string' ? book.genre : '',
    status,
    notes: Array.isArray(book.notes) ? book.notes : [],
    purchaseStatus: ['planned', 'ordered', 'arrived'].includes(book.purchaseStatus) ? book.purchaseStatus : 'planned',
    plannedPurchaseDate: typeof book.plannedPurchaseDate === 'string' ? book.plannedPurchaseDate : '',
    arrivalDate: typeof book.arrivalDate === 'string' ? book.arrivalDate : '',
    shelfOrder: Number.isFinite(book.shelfOrder) ? book.shelfOrder : index,
  }
}

export function createBook(title, author, pages, genre = '', status = 'tbr', details = {}) {
  return normaliseBook({ id: crypto.randomUUID(), title, author, pages, genre, status, ...details }, Date.now())
}

export function addBook(library, book) {
  return [...library, { ...book, shelfOrder: library.filter((item) => item.status === book.status).length }]
}

export function updateBook(library, id, changes) {
  return library.map((book) => book.id === id ? { ...book, ...changes } : book)
}

export function startReading(library, id) {
  return library.map((book) => book.id === id ? { ...book, status: 'reading' } : book)
}
export function finishedReading(library, id) { return updateBook(library, id, { status: 'finished' }) }
export function moveToTbr(library, id) { return updateBook(library, id, { status: 'tbr', boughtAt: new Date().toISOString() }) }
export function removeBook(library, id) { return library.filter((book) => book.id !== id) }

export function moveBook(library, id, direction) {
  const selected = library.find((book) => book.id === id)
  if (!selected) return library
  const shelf = library.filter((book) => book.status === selected.status).sort((a, b) => a.shelfOrder - b.shelfOrder)
  const currentIndex = shelf.findIndex((book) => book.id === id)
  const nextIndex = currentIndex + direction
  if (nextIndex < 0 || nextIndex >= shelf.length) return library
  const reordered = [...shelf]
  ;[reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]]
  const orderById = new Map(reordered.map((book, index) => [book.id, index]))
  return library.map((book) => orderById.has(book.id) ? { ...book, shelfOrder: orderById.get(book.id) } : book)
}

export function saveLibrary(library) { localStorage.setItem('library', JSON.stringify(library)) }

export function loadLibrary() {
  try {
    const savedLibrary = JSON.parse(localStorage.getItem('library'))
    return Array.isArray(savedLibrary) ? savedLibrary.map(normaliseBook) : []
  } catch { return [] }
}

const DEFAULT_PROFILE = { name: 'Your name', age: '', favoriteGenre: '', favoriteBook: '', quote: 'A reader lives a thousand lives before they die.' }
export function loadProfile() {
  try {
    const savedProfile = JSON.parse(localStorage.getItem('library-profile'))
    return savedProfile && typeof savedProfile === 'object' ? { ...DEFAULT_PROFILE, ...savedProfile } : DEFAULT_PROFILE
  } catch { return DEFAULT_PROFILE }
}
export function saveProfile(profile) { localStorage.setItem('library-profile', JSON.stringify(profile)) }
