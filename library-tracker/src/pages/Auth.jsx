import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import '../styles/Auth.css'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password, options: { data: { privacy_consent_at: new Date().toISOString(), privacy_policy_version: '2026-09-16' } } })
      : await supabase.auth.signInWithPassword({ email, password })

    setIsSubmitting(false)

    if (result.error) {
      setMessage(result.error.message)
      return
    }

    if (isSignUp && !result.data.session) {
      setMessage('Check your email to confirm your account, then log in.')
    }
  }

  if (!supabase) {
    return <main className='auth-page'><section className='auth-panel'><p className='eyebrow'>Library Tracker</p><h1>Connect your database</h1><p>Add your Supabase values to <code>.env.local</code>, then restart the development server.</p></section></main>
  }

  return <main className='auth-page'><section className='auth-panel'><p className='eyebrow'>Library Tracker</p><h1>{isSignUp ? 'Create your account' : 'Welcome back'}</h1><p>{isSignUp ? 'Save your shelves and notes to your own account.' : 'Log in to open your personal library.'}</p><form className='auth-form' onSubmit={submit}><label>Email<input type='email' value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete='email' /></label><label>Password<input type='password' value={password} onChange={(event) => setPassword(event.target.value)} required minLength='6' autoComplete={isSignUp ? 'new-password' : 'current-password'} /></label>{isSignUp && <div className='privacy-consent'><details><summary>Privacy notice</summary><p>Library Tracker stores your email for authentication and may store your profile, optional photo, books, shopping details, and reading notes so the app can provide its features. Your data is protected by Supabase Row Level Security and is not intended to be public. You can request access or deletion from the project owner.</p></details><label className='consent-label'><input type='checkbox' checked={privacyConsent} onChange={(event) => setPrivacyConsent(event.target.checked)} required /> <span>I have read and accept this privacy notice.</span></label></div>}<button className='primary-button' disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : isSignUp ? 'Create account' : 'Log in'}</button></form>{message && <p className='auth-message' role='status'>{message}</p>}<button className='auth-toggle' onClick={() => { setIsSignUp((value) => !value); setPrivacyConsent(false); setMessage('') }}>{isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}</button></section></main>
}

export default Auth
