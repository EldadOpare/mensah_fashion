import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PhotoGallery({ urls }) {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className="photo-gallery">
      {/* Primary Image */}
      <div style={{ 
        width: '100%', 
        paddingBottom: '125%', 
        position: 'relative', 
        background: '#f9f9f9',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '16px'
      }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={urls[activeIdx]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {urls.map((url, i) => (
          <motion.div
            key={i}
            onClick={() => setActiveIdx(i)}
            whileHover={{ scale: 1.05 }}
            style={{
              width: '80px',
              height: '80px',
              flexShrink: 0,
              borderRadius: '4px',
              overflow: 'hidden',
              border: activeIdx === i ? '2px solid black' : '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            <img src={url} alt={`View ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
