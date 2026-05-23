import Sidebar from './Sidebar'

export default function AppLayout({ children, userType = 'guest', onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar userType={userType} onLogout={onLogout} />
      {/* No overflowY here — body scrolls naturally, avoids flex height circular dependency */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
