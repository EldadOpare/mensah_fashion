const DEFAULT_TEXT = 'MENSAH  ·  BESPOKE WEST AFRICAN FASHION  ·  CRAFTED FOR YOU  ·  ANKARA & KENTE COLLECTIONS  ·  ORDER VIA WHATSAPP  ·  '
const CRAFT_TEXT   = 'CRAFTED STORIES  ·  ANKARA PRINTS  ·  PREMIUM FABRICS  ·  TIMELESS CUTS  ·  BESPOKE TAILORING  ·  KENTE WEAVES  ·  WEST AFRICAN CRAFT  ·  '

export default function MarqueeBand({ variant = 'default', speed = 28 }) {
  const text = variant === 'craft' ? CRAFT_TEXT : DEFAULT_TEXT

  return (
    <div style={{
      background: '#111111',
      height: '44px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: `marquee ${speed}s linear infinite`,
      }}>
        {[0, 1].map(n => (
          <span key={n} style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#666',
            fontFamily: 'var(--font-sans)',
            paddingRight: '2rem',
          }}>
            {text}{text}
          </span>
        ))}
      </div>
    </div>
  )
}
