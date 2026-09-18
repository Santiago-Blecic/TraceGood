import { useEffect, useState } from 'react'
import { Close, Menu } from './icons.jsx'
import './Navbar.css'

const links = [
  { label: 'Your impact', href: '#proof' },
  { label: 'Project location', href: '#project-location' },
  { label: 'Transaction', href: '#proof' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className="nav">
      <a className="nav__brand" href="#main" aria-label="TraceGood home">
        <img className="nav__logo" src="/tracegood-logo.png" alt="TraceGood" />
      </a>

      <nav className="nav__pill" aria-label="Primary">
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav__actions">
        <a className="btn btn--light nav__cta" href="#proof">Verify transfer</a>
        <button
          className="nav__burger"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn btn--flame nav__sheet-cta" href="#proof" onClick={() => setOpen(false)}>
            Verify transfer
          </a>
        </div>
      )}
    </header>
  )
}
