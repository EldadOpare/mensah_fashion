import { NavLink, Link } from 'react-router-dom'
const mensahLogo = '/icons/Mensah_Logo.png'

/* ─── Icon components ─────────────────────────────────────────── */
const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const IconCampaign = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/>
    <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/>
    <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/>
    <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/>
    <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
    <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/>
    <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>
  </svg>
)
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconInventory = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
)
const IconAnalytics = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const IconBox = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
)
const IconSettings = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
)
const IconShop = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

/* ─── Styles ──────────────────────────────────────────────────── */
const CSS = `
.sb-root {
  width: 220px;
  flex-shrink: 0;
  background: #FFFFFF;
  border-right: 1px solid #F0F0F0;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  align-self: flex-start;
}

.sb-logo-area {
  padding: 24px 20px 18px;
  border-bottom: 1px solid #F5F5F5;
}

.sb-logo { height: 28px; width: auto; display: block; }

.sb-logo-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #3D3D3D;
  margin-top: 4px;
  font-weight: 600;
}

.sb-nav {
  flex: 1;
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.sb-section-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #CCCCCC;
  padding: 14px 8px 5px;
  margin-top: 2px;
}

/* ── Active link uses teal accent ── */
.sb-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 7px;
  text-decoration: none;
  color: #999999;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  transition: background 0.12s, color 0.12s;
  border: 1px solid transparent;
  margin-bottom: 1px;
  cursor: pointer;
}

.sb-link:hover {
  background: rgba(61, 61, 61, 0.05);
  color: #3D3D3D;
}

.sb-link.active {
  background: rgba(61, 61, 61, 0.08);
  color: #3D3D3D;
  border-color: rgba(61, 61, 61, 0.16);
  font-weight: 500;
}

.sb-link svg {
  flex-shrink: 0;
  opacity: 0.45;
  transition: opacity 0.12s, color 0.12s;
}
.sb-link:hover svg,
.sb-link.active svg { opacity: 1; }

/* Disabled/coming-soon nav items */
.sb-link-disabled {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 7px;
  color: #CCCCCC;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  cursor: default;
  margin-bottom: 1px;
  user-select: none;
}
.sb-link-disabled svg { opacity: 0.3; flex-shrink: 0; }

.sb-soon-tag {
  margin-left: auto;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #CCCCCC;
  background: #F5F5F5;
  border-radius: 4px;
  padding: 2px 5px;
}

/* ── Bottom user area ── */
.sb-bottom {
  padding: 14px 10px;
  border-top: 1px solid #F5F5F5;
}

.sb-user-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sb-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(61, 61, 61, 0.08);
  color: #3D3D3D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.sb-user-info { flex: 1; min-width: 0; }

.sb-user-name {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sb-user-role {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  color: #AAAAAA;
  margin-top: 1px;
}

/* Gold badge — matches brand accent */
.sb-role-badge {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(201, 168, 76, 0.12);
  color: #C9A84C;
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}

.sb-logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  padding: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #AAAAAA;
  background: transparent;
  border: 1px solid #EEEEEE;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
}
.sb-logout-btn:hover {
  background: rgba(61,61,61,0.05);
  color: #3D3D3D;
  border-color: rgba(61,61,61,0.2);
}
`

export default function Sidebar({ userType = 'guest', onLogout }) {
  return (
    <>
      <style>{CSS}</style>
      <aside className="sb-root">

        {/* Logo */}
        <div className="sb-logo-area">
          <img src={mensahLogo} alt="Mensah" className="sb-logo" />
          {userType === 'tailor' && (
            <div className="sb-logo-sub">Studio</div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          {userType === 'tailor' ? (
            <>
              {/* ── Overview ─────────────────────── */}
              <div className="sb-section-label">Overview</div>
              <NavLink to="/tailor/dashboard" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconGrid />
                Dashboard
              </NavLink>

              {/* ── Studio ───────────────────────── */}
              <div className="sb-section-label">Studio</div>
              {/* Campaigns = same page as Dashboard (the campaigns listing IS the dashboard) */}
              <NavLink to="/tailor/dashboard" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconCampaign />
                Campaigns
              </NavLink>
              <NavLink to="/tailor/campaign/create" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconPlus />
                New Campaign
              </NavLink>
              <NavLink to="/tailor/inventory" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconInventory />
                Inventory
              </NavLink>

              {/* ── Market Insights ───────────────── */}
              <div className="sb-section-label">Market Insights</div>
              <NavLink to="/tailor/orders" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconBox />
                Orders
              </NavLink>
              <NavLink to="/tailor/analytics" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconAnalytics />
                Analytics
              </NavLink>

              {/* ── System ───────────────────────── */}
              <div className="sb-section-label">System</div>
              <div className="sb-link-disabled">
                <IconSettings />
                Settings
                <span className="sb-soon-tag">Soon</span>
              </div>
            </>
          ) : (
            <>
              <div className="sb-section-label">Shop</div>
              <NavLink to="/" end className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}>
                <IconShop />
                Collection
              </NavLink>
              <div className="sb-section-label">Account</div>
              <Link to="/tailor/login" className="sb-link">
                <IconGrid />
                Tailor Login
              </Link>
            </>
          )}
        </nav>

        {/* Bottom user info (tailor only) */}
        {userType === 'tailor' && (
          <div className="sb-bottom">
            <div className="sb-user-row">
              <div className="sb-avatar">T</div>
              <div className="sb-user-info">
                <div className="sb-user-name">Tailor</div>
                <div className="sb-user-role">Studio Account</div>
              </div>
              <div className="sb-role-badge">Pro</div>
            </div>
            <button className="sb-logout-btn" onClick={onLogout}>
              Sign out
            </button>
          </div>
        )}

      </aside>
    </>
  )
}
