import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getItems, createItem, toggleItemStock, toggleItemVisibility, uploadImage } from '../api/merchantApi'
import { formatPrice, toAbsoluteUrl } from '../config/apiConfig'

/* ─── Standard Garment Library (25 minimum) ──────────────────────── */
const GARMENT_TYPES = [
  { id: 'shirt_casual',      label: 'Casual Shirt' },
  { id: 'shirt_formal',      label: 'Formal Shirt' },
  { id: 'shirt_dashiki',     label: 'Dashiki Shirt' },
  { id: 'trousers_straight', label: 'Straight-leg Trousers' },
  { id: 'trousers_wide',     label: 'Wide-leg Trousers' },
  { id: 'trousers_chinos',   label: 'Slim Chinos' },
  { id: 'dress_mini',        label: 'Mini Dress' },
  { id: 'dress_midi',        label: 'Midi Dress' },
  { id: 'dress_maxi',        label: 'Maxi Dress' },
  { id: 'dress_shift',       label: 'Shift Dress' },
  { id: 'kaftan',            label: 'Kaftan / Boubou' },
  { id: 'kaftan_short',      label: 'Short Kaftan' },
  { id: 'agbada',            label: 'Agbada' },
  { id: 'ankara_top',        label: 'Ankara Blouse' },
  { id: 'ankara_crop',       label: 'Ankara Crop Top' },
  { id: 'suit_jacket',       label: 'Blazer / Suit Jacket' },
  { id: 'suit_double',       label: 'Double-breasted Blazer' },
  { id: 'skirt_wrap',        label: 'Wrap Skirt' },
  { id: 'skirt_pencil',      label: 'Pencil Skirt' },
  { id: 'skirt_maxi',        label: 'Maxi Skirt' },
  { id: 'jumpsuit',          label: 'Jumpsuit' },
  { id: 'senator_suit',      label: 'Senator / Native Suit' },
  { id: 'buba_sokoto',       label: 'Buba and Sokoto' },
  { id: 'iro_buba',          label: 'Iro and Buba' },
  { id: 'two_piece',         label: 'Co-ord Two-piece Set' },
]

/* ─── Styles ──────────────────────────────────────────────────── */
const ACCENT = '#3D3D3D'
const ACCENT_LIGHT = 'rgba(61,61,61,0.07)'
const ACCENT_BORDER = 'rgba(61,61,61,0.18)'

const CSS = `
.ti-root { max-width: 1100px; width: 100%; margin: 0 auto; }

.ti-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.ti-stat {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  padding: 20px 24px;
}
.ti-stat-val {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 32px;
  font-weight: 400;
  color: #111111;
  line-height: 1;
}
.ti-stat-lbl {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #888888;
  margin-top: 5px;
}

/* ── List Layout ─────────────────────────────────────────── */
.ti-list-header {
  display: grid;
  grid-template-columns: 80px 2.5fr 1.5fr 1.2fr 1.2fr 1.2fr;
  gap: 16px;
  padding: 10px 24px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #AAAAAA;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 10px;
  align-items: center;
}

.ti-card {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.ti-card:hover {
  border-color: ${ACCENT};
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.ti-card-row {
  display: grid;
  grid-template-columns: 80px 2.5fr 1.5fr 1.2fr 1.2fr 1.2fr;
  align-items: center;
  gap: 16px;
  padding: 14px 24px;
  user-select: none;
}

.ti-card-img {
  width: 48px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  background: #FAFAFA;
  border: 1px solid #EEEEEE;
}
.ti-card-img-placeholder {
  width: 48px;
  height: 60px;
  background: #F5F5F5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.ti-card-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 16px;
  font-weight: 400;
  color: #111111;
}

.ti-card-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${ACCENT};
  background: ${ACCENT_LIGHT};
  border: 1px solid ${ACCENT_BORDER};
  border-radius: 4px;
  padding: 3px 8px;
  width: fit-content;
}

.ti-card-price {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #111111;
}

/* ── Toggle Switches ─────────────────────────────────────── */
.ti-switch-lbl {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #555555;
}

.ti-toggle {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
  flex-shrink: 0;
}
.ti-toggle input { opacity: 0; width: 0; height: 0; }
.ti-toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #E2E2E0;
  transition: .3s;
  border-radius: 20px;
}
.ti-toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
input:checked + .ti-toggle-slider {
  background-color: #3D3D3D;
}
input:checked + .ti-toggle-slider:before {
  transform: translateX(18px);
}

.ti-visibility-select {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #DDDDDD;
  background: #FAFAFA;
  cursor: pointer;
  outline: none;
  width: fit-content;
}
.ti-visibility-select.public {
  color: #1A7A40;
  border-color: rgba(26,122,64,0.25);
  background: #F0FDF4;
}
.ti-visibility-select.private {
  color: #888888;
  border-color: #E5E5E5;
  background: #FAFAFA;
}

/* ── Drawer Form ────────────────────────────────────────── */
.ti-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 100;
  backdrop-filter: blur(4px);
}

.ti-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  background: #FFFFFF;
  box-shadow: -4px 0 30px rgba(0,0,0,0.15);
  z-index: 101;
  padding: 32px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 480px) {
  .ti-drawer { width: 100%; }
}

.ti-drawer-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  color: #111111;
  margin-bottom: 4px;
}

.ti-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ti-label {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #BBBBBB;
}

.ti-input {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  color: #111111;
  background: #FAFAFA;
  padding: 10px 12px;
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.15s;
}
.ti-input:focus { border-color: #111111; background: #FFFFFF; }

.ti-radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.ti-radio-card {
  border: 1.5px solid #EEEEEE;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  background: #FAFAFA;
  transition: all 0.15s;
}
.ti-radio-card.active {
  border-color: #3D3D3D;
  background: rgba(61,61,61,0.04);
}
.ti-radio-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #333333;
}
.ti-radio-sub {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  color: #AAAAAA;
  margin-top: 2px;
}

.ti-upload-zone {
  border: 1.5px dashed #E0E0E0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background: #FAFAFA;
  transition: all 0.15s;
}
.ti-upload-zone:hover { border-color: #AAAAAA; background: #F5F5F5; }

.ti-preview-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.ti-preview-thumb {
  position: relative;
  width: 56px; height: 56px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #EEEEEE;
}
.ti-preview-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ti-preview-remove {
  position: absolute;
  top: 2px; right: 2px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .ti-list-header {
    grid-template-columns: 80px 2fr 1.2fr 1fr 1fr;
  }
  .ti-card-row {
    grid-template-columns: 80px 2fr 1.2fr 1fr 1fr;
    padding: 14px 18px;
  }
}

@media (max-width: 768px) {
  .ti-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .ti-list-header {
    display: none;
  }
  .ti-card-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px 16px;
  }
  .ti-card-badge {
    margin-right: auto;
  }
}
`

export default function TailorInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const navigate = useNavigate()

  /* Form states */
  const [form, setForm] = useState({ name: '', price: '', garmentId: 'kaftan', displayMode: 'photo' })
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/auth/verify', { credentials: 'include' })
      .then(r => { if (r.status === 401) navigate('/tailor/login') })
      .catch(() => {})
    load()
  }, [])

  const load = () => {
    setLoading(true)
    getItems({ tailor: true })
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  const handleStock = async (itemId, currentStock) => {
    try {
      const updated = await toggleItemStock(itemId, !currentStock)
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, in_stock: updated.in_stock } : i))
    } catch (err) {
      console.error('Failed to toggle stock status:', err)
    }
  }

  const handleVisibility = async (itemId, currentPublished) => {
    try {
      const updated = await toggleItemVisibility(itemId, !currentPublished)
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, published: updated.published } : i))
    } catch (err) {
      console.error('Failed to toggle visibility:', err)
    }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const results = await Promise.all(files.map(uploadImage))
      setImages(prev => [...prev, ...results.map(r => r.url)])
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url) => setImages(prev => prev.filter(u => u !== url))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const price_minor = Math.round(Number(form.price) * 100)
      await createItem({
        name: form.name.trim(),
        price_minor,
        currency: 'GHS',
        displayMode: form.displayMode,
        garmentId: form.displayMode === '3d' ? form.garmentId : undefined,
        image_urls: images,
      })
      
      /* Reset and close */
      setForm({ name: '', price: '', garmentId: 'kaftan', displayMode: 'photo' })
      setImages([])
      setPanelOpen(false)
      load()
    } catch (err) {
      setError(err.message || 'Failed to list garment')
    } finally {
      setSubmitting(false)
    }
  }

  /* Compute Metrics */
  const stats = {
    total:     items.length,
    inStock:   items.filter(i => i.in_stock).length,
    mode3D:    items.filter(i => i.displayMode === '3d').length,
    modePhoto: items.filter(i => i.displayMode === 'photo').length,
  }

  const topbarLeft = (
    <div className="app-topbar-pill" style={{ background: 'transparent', border: '1px solid #EEEEEE' }}>
      Inventory
    </div>
  )

  const topbarRight = (
    <button className="app-topbar-action" onClick={() => setPanelOpen(true)}>
      + Add Garment
    </button>
  )

  return (
    <>
      <style>{CSS}</style>
      <AppLayout userType="tailor" topbarLeft={topbarLeft} topbarRight={topbarRight}
        onLogout={async () => {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
          navigate('/tailor/login')
        }}
      >
        <div className="ti-root">

          {/* Stats Bar */}
          <div className="ti-stats">
            <div className="ti-stat">
              <div className="ti-stat-val">{stats.total}</div>
              <div className="ti-stat-lbl">Total Catalog</div>
            </div>
            <div className="ti-stat">
              <div className="ti-stat-val">{stats.inStock}</div>
              <div className="ti-stat-lbl">In Stock</div>
            </div>
            <div className="ti-stat">
              <div className="ti-stat-val">{stats.mode3D}</div>
              <div className="ti-stat-lbl">3D Models</div>
            </div>
            <div className="ti-stat">
              <div className="ti-stat-val">{stats.modePhoto}</div>
              <div className="ti-stat-lbl">Photosheets</div>
            </div>
          </div>

          {/* Table Headers */}
          {items.length > 0 && (
            <div className="ti-list-header">
              <span>Preview</span>
              <span>Garment</span>
              <span>Display Mode</span>
              <span>Price</span>
              <span>Stock Status</span>
              <span>Visibility</span>
            </div>
          )}

          {/* Items List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="ti-empty" style={{ background: '#FFFFFF', padding: '80px 40px', borderRadius: 12, border: '1px dashed #E0E0E0', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, color: '#111111', marginBottom: 6 }}>Your catalogue is empty</h2>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, color: '#AAAAAA', marginBottom: 20 }}>List your custom garments to feature them in campaign drops.</p>
              <button className="ti-stat-lbl" onClick={() => setPanelOpen(true)} style={{ background: '#3D3D3D', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                + Add First Garment
              </button>
            </div>
          ) : (
            <motion.div layout>
              {items.map(item => {
                const cover = item.image_urls?.[0] ? toAbsoluteUrl(item.image_urls[0]) : null
                return (
                  <motion.div key={item.id} className="ti-card" layout>
                    <div className="ti-card-row">
                      {/* Image */}
                      {cover ? (
                        <img src={cover} alt="" className="ti-card-img" />
                      ) : (
                        <div className="ti-card-img-placeholder">👗</div>
                      )}

                      {/* Name */}
                      <span className="ti-card-name">{item.name}</span>

                      {/* Display Mode */}
                      <div className="ti-card-badge">
                        {item.displayMode === '3d' ? (
                          <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                            </svg>
                            3D Model
                          </>
                        ) : (
                          <>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                              <circle cx="12" cy="13" r="4"/>
                            </svg>
                            Photosheet
                          </>
                        )}
                      </div>

                      {/* Price */}
                      <span className="ti-card-price">
                        {formatPrice(item.price_minor, item.currency)}
                      </span>

                      {/* Stock Toggle */}
                      <div className="ti-switch-lbl">
                        <label className="ti-toggle">
                          <input
                            type="checkbox"
                            checked={item.in_stock}
                            onChange={() => handleStock(item.id, item.in_stock)}
                          />
                          <span className="ti-toggle-slider" />
                        </label>
                        <span style={{ fontWeight: 500, color: item.in_stock ? '#111111' : '#AAAAAA' }}>
                          {item.in_stock ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>

                      {/* Visibility Toggle */}
                      <button
                        className={`ti-visibility-select ${item.published !== false ? 'public' : 'private'}`}
                        onClick={() => handleVisibility(item.id, item.published !== false)}
                      >
                        {item.published !== false ? 'Public' : 'Private'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Drawer Form Overlay */}
          <AnimatePresence>
            {panelOpen && (
              <>
                <motion.div
                  className="ti-drawer-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setPanelOpen(false)}
                />
                <motion.div
                  className="ti-drawer"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                >
                  <div>
                    <h2 className="ti-drawer-title">List New Garment</h2>
                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#AAAAAA' }}>Add a new piece to your Studio catalogue</p>
                  </div>

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    {/* Name */}
                    <div className="ti-field">
                      <label className="ti-label">Garment Name *</label>
                      <input
                        className="ti-input"
                        value={form.name}
                        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Silk Senator Suit"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div className="ti-field">
                      <label className="ti-label">Price (GHS) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="ti-input"
                        value={form.price}
                        onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Mode select */}
                    <div className="ti-field">
                      <label className="ti-label">Display Mode</label>
                      <div className="ti-radio-group">
                        <div
                          className={`ti-radio-card${form.displayMode === 'photo' ? ' active' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, displayMode: 'photo' }))}
                        >
                          <div className="ti-radio-title">Photosheet</div>
                          <div className="ti-radio-sub">Real lookbook photos</div>
                        </div>
                        <div
                          className={`ti-radio-card${form.displayMode === '3d' ? ' active' : ''}`}
                          onClick={() => setForm(prev => ({ ...prev, displayMode: '3d' }))}
                        >
                          <div className="ti-radio-title">3D Interactive</div>
                          <div className="ti-radio-sub">Fabric wrapping model</div>
                        </div>
                      </div>
                    </div>

                    {/* Silhouette select (if 3D) */}
                    {form.displayMode === '3d' && (
                      <div className="ti-field">
                        <label className="ti-label">3D Garment Silhouette *</label>
                        <select
                          className="ti-input"
                          value={form.garmentId}
                          onChange={e => setForm(prev => ({ ...prev, garmentId: e.target.value }))}
                          style={{ appearance: 'auto', WebkitAppearance: 'auto' }}
                        >
                          {GARMENT_TYPES.map(g => (
                            <option key={g.id} value={g.id}>{g.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Image uploads */}
                    <div className="ti-field">
                      <label className="ti-label">
                        {form.displayMode === '3d' ? 'Fabric Swatches *' : 'Lookbook Photos *'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="inventory-images"
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                      />
                      <label htmlFor="inventory-images">
                        <div className="ti-upload-zone">
                          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#AAAAAA' }}>
                            {uploading ? 'Uploading fabric…' : 'Click to select image file'}
                          </p>
                        </div>
                      </label>

                      {images.length > 0 && (
                        <div className="ti-preview-strip">
                          {images.map(url => (
                            <div key={url} className="ti-preview-thumb">
                              <img src={toAbsoluteUrl(url)} alt="" />
                              <button
                                type="button"
                                className="ti-preview-remove"
                                onClick={() => removeImage(url)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {error && (
                      <p style={{ color: '#CC0000', fontSize: 12, background: '#FFF5F5', padding: '8px 12px', borderRadius: 6, border: '1px solid #FFDDDD', textAlign: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {error}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                      <button
                        type="submit"
                        disabled={submitting || uploading}
                        style={{ flex: 1, padding: 12, background: '#3D3D3D', color: '#FFFFFF', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
                      >
                        {submitting ? 'Listing garment…' : 'Add to Catalogue'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPanelOpen(false)}
                        style={{ padding: 12, background: 'transparent', color: '#666666', border: '1px solid #EEEEEE', borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: 500 }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </AppLayout>
    </>
  )
}
