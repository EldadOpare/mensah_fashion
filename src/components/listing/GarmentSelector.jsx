import { motion } from 'framer-motion'
import garmentConfig from '../../config/garmentConfig.json'

export default function GarmentSelector({ selectedId, onSelect }) {
  const garmentIds = Object.keys(garmentConfig)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
      {garmentIds.map(id => {
        const isSelected = selectedId === id
        const label = garmentConfig[id]?.label || id.replace(/_/g, ' ')
        return (
          <motion.div
            key={id}
            onClick={() => onSelect(id)}
            whileHover={{ y: -4 }}
            style={{
              padding: '16px',
              border: isSelected ? '2px solid black' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              background: 'white',
              cursor: 'pointer',
              position: 'relative',
              textAlign: 'center'
            }}
          >
            {isSelected && (
              <motion.span
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '14px' }}
              >
                ✂️
              </motion.span>
            )}
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👗</div>
            <div style={{ fontSize: '12px', fontWeight: 500 }}>{label}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
