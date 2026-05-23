import { motion } from 'framer-motion'

export default function MensahLoader() {
  const letters = 'MENSAH'.split('')
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  }
  
  const letterVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#FAF9F6', // Luxury off-white ivory background
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}
      >
        {letters.map((l, i) => (
          <motion.span
            key={i}
            variants={letterVariants}
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '38px',
              fontWeight: 400,
              letterSpacing: '0.12em',
              color: '#111111',
              display: 'inline-block',
            }}
          >
            {l}
          </motion.span>
        ))}
      </motion.div>
      
      {/* Minimalist horizontal breathing line loader */}
      <motion.div
        initial={{ width: 0, opacity: 0.2 }}
        animate={{ width: 140, opacity: 0.8 }}
        transition={{
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 1.2,
          ease: 'easeInOut'
        }}
        style={{
          height: '1px',
          background: '#3D3D3D',
        }}
      />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '9px',
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop: '14px',
          color: '#888888',
        }}
      >
        Bespoke West African Craft
      </motion.p>
    </div>
  )
}
