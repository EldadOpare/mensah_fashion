import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeCanvas } from 'qrcode.react'

export default function QRModal({ isOpen, onClose, url, title }) {
  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas')
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `${title}-qr.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
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
              background: 'rgba(0,0,0,0.8)',
              zIndex: 3000
            }}
          />
          
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              width: '90%',
              maxWidth: '400px',
              background: 'white',
              zIndex: 3100,
              padding: '32px',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}
          >
            <h2 style={{ marginBottom: '24px' }}>Share Listing</h2>
            
            <div style={{ background: '#f5f5f5', padding: '24px', borderRadius: '8px', marginBottom: '24px', display: 'inline-block' }}>
              <QRCodeCanvas 
                id="qr-code-canvas"
                value={url} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Scan to view this listing on your mobile device
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={downloadQR} style={{ flex: 1 }}>Download PNG</button>
              <button onClick={onClose} className="secondary" style={{ flex: 1 }}>Close</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
