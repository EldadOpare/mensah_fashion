import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/ui/PageTransition'

export default function TailorLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(null)
  const [isShaking, setIsShaking] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
        throw new Error(data.error || 'Login failed')
      }
      
      navigate('/tailor/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-surface)'
      }}>
        <motion.div
          animate={isShaking ? { x: [0, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '40px',
            background: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}
        >
          <h1 style={{ marginBottom: '32px' }}>Tailor Studio</h1>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', textAlign: 'left' }}>
                Enter Studio PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: '24px' }}
                autoFocus
              />
            </div>
            
            {error && <p style={{ color: 'var(--error)', fontSize: '14px', marginBottom: '24px' }}>{error}</p>}
            
            <button type="submit" style={{ width: '100%' }}>Login to Studio</button>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  )
}
