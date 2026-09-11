import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import '../styles/Profile.css'
function Profile() {
  const { profile, setProfile } = useOutletContext(); const [draft, setDraft] = useState(profile); const [saved, setSaved] = useState(false)
  function submit(event) { event.preventDefault(); setProfile(draft); setSaved(true) }
  function removePhoto() { setDraft({ ...draft, photo: '' }) }
  function choosePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setDraft({ ...draft, photo: reader.result })
    reader.readAsDataURL(file)
  }
  return <main className='profile-page'><Link className='back-link' to='/'>← Home</Link><p className='eyebrow'>Your library card</p><h1>Make it yours</h1><form className='profile-form' onSubmit={submit}><label>Name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label><label>Age<input type='number' min='0' value={draft.age} onChange={(e) => setDraft({ ...draft, age: e.target.value })} /></label><label>Favourite genre<input value={draft.favoriteGenre} onChange={(e) => setDraft({ ...draft, favoriteGenre: e.target.value })} /></label><label>Favourite book<input value={draft.favoriteBook} onChange={(e) => setDraft({ ...draft, favoriteBook: e.target.value })} /></label><label className='quote-field'>Profile photo<input type='file' accept='image/*' onChange={choosePhoto} />{draft.photo && <><img className='photo-preview' src={draft.photo} alt='Profile preview' /><button className='remove-photo-button' type='button' onClick={removePhoto}>Remove photo</button></>}</label><label className='quote-field'>A favourite quote<textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} /></label><button className='primary-button'>Save library card</button>{saved && <span className='saved-message'>Saved to this browser.</span>}</form></main>
}
export default Profile
