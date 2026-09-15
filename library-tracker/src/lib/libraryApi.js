import { supabase } from './supabase.js'

function toBook(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    pages: row.pages,
    genre: row.genre || '',
    status: row.status,
    notes: (row.notes || []).map((note) => ({ id: note.id, text: note.text, createdAt: new Date(note.created_at).toLocaleDateString() })),
    purchaseStatus: row.purchase_status || 'planned',
    plannedPurchaseDate: row.planned_purchase_date || '',
    arrivalDate: row.arrival_date || '',
    shelfOrder: row.shelf_order ?? 0,
  }
}

function toBookRow(book, userId) {
  return {
    id: book.id,
    user_id: userId,
    title: book.title,
    author: book.author,
    pages: book.pages,
    genre: book.genre || '',
    status: book.status,
    purchase_status: book.purchaseStatus || 'planned',
    planned_purchase_date: book.plannedPurchaseDate || null,
    arrival_date: book.arrivalDate || null,
    shelf_order: book.shelfOrder ?? 0,
  }
}

function throwIfError(result) {
  if (result.error) throw result.error
  return result.data
}

export async function fetchLibrary() {
  const result = await supabase.from('books').select('*, notes(id, text, created_at)').order('shelf_order', { ascending: true })
  return throwIfError(result).map(toBook)
}

export async function createBook(book, userId) {
  const result = await supabase.from('books').insert(toBookRow(book, userId)).select('*, notes(id, text, created_at)').single()
  return toBook(throwIfError(result))
}

export async function updateBook(id, changes) {
  const columnNames = { purchaseStatus: 'purchase_status', plannedPurchaseDate: 'planned_purchase_date', arrivalDate: 'arrival_date', shelfOrder: 'shelf_order' }
  const row = Object.fromEntries(Object.entries(changes).map(([key, value]) => [columnNames[key] || key, value === '' && ['plannedPurchaseDate', 'arrivalDate'].includes(key) ? null : value]))
  const result = await supabase.from('books').update(row).eq('id', id).select('*, notes(id, text, created_at)').single()
  return toBook(throwIfError(result))
}

export async function deleteBook(id) {
  const result = await supabase.from('books').delete().eq('id', id)
  throwIfError(result)
}

export async function updateBookOrder(books) {
  await Promise.all(books.map((book) => updateBook(book.id, { shelfOrder: book.shelfOrder })))
}

export async function addNote(bookId, userId, text) {
  const result = await supabase.from('notes').insert({ book_id: bookId, user_id: userId, text }).select().single()
  return throwIfError(result)
}

export async function deleteNote(noteId) {
  const result = await supabase.from('notes').delete().eq('id', noteId)
  throwIfError(result)
}

export async function fetchProfile(userId) {
  const result = await supabase.from('profiles').select('*').eq('id', userId).single()
  const profile = throwIfError(result)
  return { name: profile.name, age: profile.age || '', favoriteGenre: profile.favorite_genre, favoriteBook: profile.favorite_book, quote: profile.quote, photo: profile.photo_url }
}

export async function saveProfile(profile, userId) {
  const result = await supabase.from('profiles').upsert({ id: userId, name: profile.name, age: profile.age ? Number(profile.age) : null, favorite_genre: profile.favoriteGenre, favorite_book: profile.favoriteBook, quote: profile.quote, photo_url: profile.photo }).select().single()
  return throwIfError(result)
}
