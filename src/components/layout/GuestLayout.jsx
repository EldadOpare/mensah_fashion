import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
const mensahLogo = '/icons/Mensah_Logo.png'
import CartButton from '../cart/CartButton'
import CartDrawer from '../cart/CartDrawer'

export default function GuestLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 var(--space-6)',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-5)',
        }}>
          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <img src={mensahLogo} alt="Mensah" style={{ height: '28px', width: 'auto' }} />
          </Link>

          {/* Nav links — desktop */}
          <nav style={{
            display: 'flex',
            gap: 'var(--space-6)',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
            className="desktop-nav"
          >
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.15s',
              })}
            >
              Collection
            </NavLink>
            <NavLink
              to="/campaigns"
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '1.5px solid var(--text-primary)' : '1.5px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.15s',
              })}
            >
              Campaigns
            </NavLink>
          </nav>

          {/* Right — cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginLeft: 'auto' }}>
            <CartButton onClick={() => setCartOpen(true)} />
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid var(--border-color)',
            padding: 'var(--space-4) var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-base)', fontWeight: 500 }}>
              Collection
            </Link>
            <Link to="/campaigns" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-base)', fontWeight: 500 }}>
              Campaigns
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--space-6) var(--space-6)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
      }}>
        <img src={mensahLogo} alt="Mensah" style={{ height: '22px', width: 'auto', opacity: 0.6 }} />
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
          Bespoke West African fashion · Order via WhatsApp
        </p>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </div>
  )
}
