import { useState, useEffect, useRef, Suspense, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import mensahLogo from '../../assets/Mensah_Logo.png'

function HeroGarment() {
  const { scene } = useGLTF('/models/garments/kaftan.glb')

  useLayoutEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    scene.position.set(-center.x, -center.y, -center.z)
    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) scene.scale.setScalar(1.1 / maxDim)
  }, [scene])

  return <primitive object={scene} />
}

function BrandAct({ onDone }) {
  return (
    <div style={{ textAlign: 'center', userSelect: 'none', padding: '0 24px' }}>
      <motion.img
        src={mensahLogo}
        alt="Mensah"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '64px', width: 'auto', display: 'block', margin: '0 auto 28px' }}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{
            transformOrigin: 'left center',
            width: '160px', height: '2px',
            background: '#4DA8DA', borderRadius: '1px'
          }}
          transition={{ delay: 0.9, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={onDone}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        style={{
          fontSize: '11px',
          color: '#888',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}
      >
        Crafted for you. Visualised before it&apos;s cut.
      </motion.p>
    </div>
  )
}

export default function HeroSequence({ onComplete }) {
  const [state, setState] = useState('sewing')
  const firedRef = useRef(false)

  const onSewingDone = () => {
    if (firedRef.current) return
    firedRef.current = true
    setState('splitting')
    setTimeout(() => setState('garment'), 2000)
    setTimeout(() => setState('revealing'), 3500)
    // Outer container fades for 0.9s before onComplete — no blank flash
    setTimeout(() => onComplete(), 5000)
  }

  useEffect(() => {
    // No sessionStorage — GuestHome module-level flag controls replay behaviour
    const fallbackTimer = setTimeout(onSewingDone, 4500)
    return () => clearTimeout(fallbackTimer)
  }, [])

  const handleSkip = () => {
    if (firedRef.current) return
    firedRef.current = true
    onComplete()
  }

  return (
    // Outer container fades to 0 during 'revealing' — entire hero dissolves into the page behind it
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: state === 'revealing' ? 0 : 1 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 1000,
        overflow: 'hidden',
        background: '#F5F5F5'
      }}
    >
      {/* Skip */}
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '20px', right: '20px',
          zIndex: 1100,
          background: 'transparent',
          border: '1px solid rgba(0,0,0,0.15)',
          color: 'rgba(0,0,0,0.4)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '6px 14px'
        }}
      >
        Skip
      </button>

      {/* Act 1: Brand reveal — zIndex 1060 sits above the panels (1050) */}
      <AnimatePresence>
        {state === 'sewing' && (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1060
            }}
          >
            <BrandAct onDone={onSewingDone} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Splitting panels */}
      <motion.div
        animate={{ y: state !== 'sewing' ? '-100%' : '0%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '50%',
          background: '#F5F5F5',
          zIndex: 1050
        }}
      />
      <motion.div
        animate={{ y: state !== 'sewing' ? '100%' : '0%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: '50%',
          background: '#F5F5F5',
          zIndex: 1050
        }}
      />

      {/* White bg + garment */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          background: '#FFFFFF',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <AnimatePresence>
          {(state === 'splitting' || state === 'garment' || state === 'revealing') && (
            <motion.div
              initial={{ scale: 0, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              style={{ width: '280px', height: '420px' }}
            >
              <Canvas camera={{ position: [0, 0.5, 2.5], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[2, 4, 2]} intensity={1.2} />
                <directionalLight position={[-2, 2, -2]} intensity={0.4} />
                <Suspense fallback={null}>
                  <HeroGarment />
                </Suspense>
                <OrbitControls
                  autoRotate
                  autoRotateSpeed={1}
                  enableZoom={false}
                  enablePan={false}
                />
              </Canvas>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
