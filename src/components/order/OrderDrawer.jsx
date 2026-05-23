import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrderDrawer({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.5)',
              zIndex: 2000
            }}
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '450px',
              height: '100%',
              background: 'white',
              zIndex: 2100,
              padding: '40px 24px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '24px' }}>Place Order</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'black', fontSize: '24px', padding: 0 }}>
                &times;
              </button>
            </div>
            
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
