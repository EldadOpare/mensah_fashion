import { useLayoutEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import garmentConfig from '../../config/garmentConfig.json'

// 1x1 white pixel — used as a placeholder so useTexture is always called unconditionally
const WHITE_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=='

export default function GarmentModel({ url, textureUrl, tint, garmentId }) {
  const { scene } = useGLTF(url)

  // useTexture must be called unconditionally — rules of hooks
  const texture = useTexture(textureUrl || WHITE_PIXEL)

  useLayoutEffect(() => {
    if (!scene) return

    // Center and normalize scale so every model sits in the middle of the canvas
    // regardless of where the original artist placed the mesh origin
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())

    scene.position.set(-center.x, -center.y, -center.z)

    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim > 0) {
      // Scale so the tallest/widest dimension fits comfortably in the camera frustum
      scene.scale.setScalar(1.1 / maxDim)
    }

    const config = garmentConfig[garmentId] || { repeatX: 1, repeatY: 1, wrapS: 'RepeatWrapping', wrapT: 'RepeatWrapping' }

    if (textureUrl && texture) {
      // Map colors to vibrant sRGB space for accurate display
      texture.colorSpace = THREE.SRGBColorSpace || 'srgb'
      texture.wrapS = THREE[config.wrapS] || THREE.RepeatWrapping
      texture.wrapT = THREE[config.wrapT] || THREE.RepeatWrapping
      texture.repeat.set(config.repeatX, config.repeatY)
      texture.needsUpdate = true
    }

    scene.traverse((child) => {
      if (!child.isMesh) return

      child.material = child.material.clone()
      
      // Configure realistic matte fabric material properties (soft finish, no metallic shine)
      child.material.roughness = 0.85
      child.material.metalness = 0.05

      if (textureUrl && texture) {
        child.material.map = texture
        child.material.color.set(tint || '#ffffff')
      } else {
        child.material.map = null
        child.material.color.set(tint || '#eeeeee')
      }

      child.material.needsUpdate = true
    })
  }, [scene, texture, textureUrl, tint, garmentId])

  return <primitive object={scene} />
}
