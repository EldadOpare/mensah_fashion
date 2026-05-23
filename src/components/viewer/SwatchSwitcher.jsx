import React from 'react'
import { motion } from 'framer-motion'

export default function SwatchSwitcher({ urls, activeUrl, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 0' }}>
      {urls.map((url, i) => {
        const isActive = activeUrl === url
        return (
          <motion.div
            key={i}
            onClick={() => onSelect(url)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: isActive ? '2px solid black' : '1px solid var(--border-color)',
              padding: '2px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundImage: `url(${url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </motion.div>
        )
      })}
    </div>
  )
}
