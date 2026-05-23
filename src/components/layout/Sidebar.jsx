import { NavLink, Link } from 'react-router-dom'
import mensahLogo from '../../assets/Mensah_Logo.png'

const GUEST_LINKS = [
  { to: '/', label: 'Shop', dot: '#4DA8DA' },
]

const TAILOR_LINKS = [
  { to: '/tailor/dashboard', label: 'Dashboard', dot: '#4DA8DA' },
  { to: '/tailor/create', label: '+ New Listing', dot: '#80D8C3' },
]

export default function Sidebar({ userType = 'guest', onLogout }) {
  const links = userType === 'tailor' ? TAILOR_LINKS : GUEST_LINKS

  return (
    <aside style={{
      width: '220px',
      flexShrink: 0,
      background: '#F5F5F5',
      borderRight: '1px solid #E8E8E8',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 16px',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      alignSelf: 'flex-start'
    }}>
      {/* Logo */}
      <div style={{ padding: '0 8px', marginBottom: '40px' }}>
        <img
          src={mensahLogo}
          alt="Mensah"
          style={{ height: '32px', width: 'auto', display: 'block' }}
        />
        {userType === 'tailor' && (
          <div style={{
            fontSize: '10px',
            color: '#4DA8DA',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '3px'
          }}>
            Studio
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: link.dot,
              flexShrink: 0,
              display: 'inline-block'
            }} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #E8E8E8', paddingTop: '16px' }}>
        {userType === 'guest' ? (
          <Link
            to="/tailor/login"
            style={{
              fontSize: '12px',
              color: '#888',
              textDecoration: 'none',
              padding: '8px 12px',
              display: 'block'
            }}
          >
            Tailor Login →
          </Link>
        ) : (
          <button
            onClick={onLogout}
            className="secondary"
            style={{ width: '100%', fontSize: '12px', padding: '8px' }}
          >
            Logout
          </button>
        )}
      </div>
    </aside>
  )
}
