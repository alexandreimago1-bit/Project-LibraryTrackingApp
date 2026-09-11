import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../styles/rootlayout.css'

function RootLayout({ library, setLibrary, profile, setProfile }) {
  const [libraryMenuOpen, setLibraryMenuOpen] = useState(false)

  return <div className='root-layout'>
    <aside className='nav-shell'>
      <nav className='nav-pill' aria-label='Main navigation'>
        <NavLink end className='nav-button' to='/'>Home</NavLink>
        <div className='library-nav-group'>
          <div className='library-nav-heading'>
            <NavLink className='nav-button' to='/library'>Library</NavLink>
            <button
            className='nav-button library-nav-toggle'
            onClick={() => setLibraryMenuOpen((isOpen) => !isOpen)}
            aria-expanded={libraryMenuOpen}
            aria-controls='library-shelves'
          >
            <span className='sr-only'>Toggle Library shelves</span><span aria-hidden='true'>{libraryMenuOpen ? '⌃' : '⌄'}</span>
          </button>
          </div>

          {libraryMenuOpen && (
            <div className='library-shelves' id='library-shelves'>
              <NavLink className='shelf-nav-link' to='/shelves?status=tbr'>TBR</NavLink>
              <NavLink className='shelf-nav-link' to='/shelves?status=finished'>Finished</NavLink>
              <NavLink className='shelf-nav-link' to='/cart'>Shopping List</NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
    <div className='page-content'><Outlet context={{ library, setLibrary, profile, setProfile }} /></div>
  </div>
}
export default RootLayout
