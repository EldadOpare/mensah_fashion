import Sidebar from './Sidebar'

const CSS = `
.app-shell {
  display: flex;
  min-height: 100vh;
  background: #F8F8F8;
}

.app-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Top toolbar that appears inside the content area */
.app-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(248,248,248,0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid #EEEEEE;
  padding: 0 28px;
  height: 52px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-topbar-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  border-radius: 20px;
  padding: 5px 12px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  cursor: pointer;
  transition: border-color 0.12s;
  white-space: nowrap;
}
.app-topbar-pill:hover { border-color: #CCCCCC; }

.app-topbar-pill svg {
  width: 10px; height: 10px;
  opacity: 0.5;
}

.app-topbar-spacer { flex: 1; }

.app-topbar-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #3D3D3D;
  color: #FFFFFF;
  border: none;
  border-radius: 20px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
  white-space: nowrap;
}
.app-topbar-action:hover { background: #2A2A2A; }

.app-topbar-action-ghost {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #FFFFFF;
  color: #333333;
  border: 1px solid #EEEEEE;
  border-radius: 20px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.12s, background 0.12s;
  text-decoration: none;
  white-space: nowrap;
}
.app-topbar-action-ghost:hover { border-color: #CCCCCC; background: #F8F8F8; }

.app-content {
  flex: 1;
  padding: 28px 28px 60px;
}
`

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
)

export default function AppLayout({ children, userType = 'guest', onLogout, topbarLeft, topbarRight }) {
  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <Sidebar userType={userType} onLogout={onLogout} />
        <div className="app-main">
          {/* Top toolbar */}
          <div className="app-topbar">
            <div className="app-topbar-pill">
              Mensah Studio <ChevronIcon />
            </div>
            {topbarLeft}
            <div className="app-topbar-spacer" />
            {topbarRight}
          </div>

          {/* Page content */}
          <div className="app-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
