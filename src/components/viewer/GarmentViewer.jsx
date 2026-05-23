import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import GarmentModel from './GarmentModel'

const GarmentLoader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#eeeeee" wireframe />
  </mesh>
)

export default function GarmentViewer({ modelUrl, textureUrl, tintColor, garmentId }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px', background: '#ffffff' }}>
      <Canvas shadows camera={{ position: [0, 0.3, 4], fov: 38 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 2]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.4} />

        <Suspense fallback={<GarmentLoader />}>
          <GarmentModel
            url={modelUrl}
            textureUrl={textureUrl}
            tint={tintColor}
            garmentId={garmentId}
          />
        </Suspense>

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom
          enablePan={false}
          target={[0, -0.05, 0]}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
