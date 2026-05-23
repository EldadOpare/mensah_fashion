import React from 'react'
import { HexColorPicker } from 'react-colorful'
import { motion, AnimatePresence } from 'framer-motion'

const presets = ['#ffffff', '#000000', '#800000', '#556b2f', '#000080', '#8b4513']

export default function FabricTintPicker({ activeTint, onSelect }) {
  const [showPicker, setShowPicker] = React.useState(false)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {presets.map(color => (
        <motion.div
          key={color}
          onClick={() => onSelect(color === '#ffffff' ? null : color)}
          whileHover={{ scale: 1.1 }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            background: color,
            border: (activeTint === color || (!activeTint && color === '#ffffff')) ? '2px solid black' : '1px solid #eee',
            cursor: 'pointer'
          }}
        />
      ))}
      
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setShowPicker(!showPicker)}
          style={{ 
            padding: '4px 8px', 
            fontSize: '10px', 
            background: 'white', 
            color: 'black',
            border: '1px solid #ccc'
          }}
        >
          Custom
        </button>
        
        <AnimatePresence>
          {showPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: '12px', zIndex: 100 }}
            >
              <HexColorPicker color={activeTint || '#ffffff'} onChange={onSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
