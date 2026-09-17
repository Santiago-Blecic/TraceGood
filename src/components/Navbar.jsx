import { useEffect, useState } from 'react'
import { Close, Logo, Menu } from './icons.jsx'
import './Navbar.css'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For brands', href: '#for-brands' },
  { label: 'Proof', href: '#proof' },
  { label: 'Our mission', href: '#mission' },
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
        <Logo className="nav__logo" />
        <span>TraceGood</span>
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
        <a className="btn btn--light nav__cta" href="#how-it-works">See your impact</a>
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
          <a className="btn btn--flame nav__sheet-cta" href="#how-it-works" onClick={() => setOpen(false)}>
            See your impact
          </a>
        </div>
      )}
    </header>
  )
}
