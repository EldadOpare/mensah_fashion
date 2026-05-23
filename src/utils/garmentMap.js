const KEYWORD_MAP = [
  { keywords: ['kaftan', 'agbada', 'boubou', 'dashiki', 'dress', 'gown', 'midi'], garmentId: 'kaftan' },
  { keywords: ['wrap skirt', 'skirt', 'kente skirt'],           garmentId: 'skirt_medieval' },
  { keywords: ['shirt & skirt', 'outfit', 'set', 'coord'],      garmentId: 'shirt_skirt_outfit' },
  { keywords: ['vintage shirt', 'vintage'],                     garmentId: 'shirt_vintage' },
  { keywords: ['blouse', 'shirt', 'top', 'tunic'],              garmentId: 'shirt_long' },
  { keywords: ['waistcoat', 'vest'],                            garmentId: 'waistcoat' },
  { keywords: ['jeans', 'trousers', 'pants', 'jogger'],         garmentId: 'jeans_baggy' },
  { keywords: ['suit', 'jacket', 'blazer'],                     garmentId: 'business_suit' },
]

export function mapItemToGarment(item) {
  if (!item) return { garmentId: null, displayMode: 'photo' }
  
  // If the item already has an explicit displayMode and garmentId set, respect it!
  // This prevents custom tailor-configured 3D garments from being forcefully overwritten to photo mode
  if (item.displayMode === '3d' && item.garmentId) {
    return { garmentId: item.garmentId, displayMode: '3d' }
  }
  
  // If the item explicitly has displayMode set as photo, respect it!
  if (item.displayMode === 'photo') {
    return { garmentId: null, displayMode: 'photo' }
  }

  const name = (item.name || '').toLowerCase()
  const description = (item.description || '').toLowerCase()
  const text = `${name} ${description}`

  for (const { keywords, garmentId } of KEYWORD_MAP) {
    if (keywords.some(kw => text.includes(kw))) {
      return { garmentId, displayMode: '3d' }
    }
  }
  return { garmentId: null, displayMode: 'photo' }
}
