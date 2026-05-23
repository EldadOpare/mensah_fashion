import { useCart } from '../../context/CartContext'

export default function CartButton({ onClick }) {
  const { totalItems } = useCart()

  return (
    <button
      onClick={onClick}
      className="ghost"
      style={{ position: 'relative', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
      aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
    >
      {/* Bag icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {totalItems > 0 && (
        <span style={{
          background: 'var(--text-primary)',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: 600,
          fontFamily: 'var(--font-sans)',
          minWidth: '18px',
          height: '18px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
        }}>
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
