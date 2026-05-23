import { useState, useCallback } from 'react'

export function useGarmentTexture(initialTextures = []) {
  const [activeTexture, setActiveTexture] = useState(initialTextures[0] || null)
  const [tintColor, setTintColor] = useState(null)

  const switchTexture = useCallback((url) => {
    setActiveTexture(url)
  }, [])

  const updateTint = useCallback((color) => {
    setTintColor(color)
  }, [])

  const resetTint = useCallback(() => {
    setTintColor(null)
  }, [])

  return {
    activeTexture,
    tintColor,
    switchTexture,
    updateTint,
    resetTint
  }
}
