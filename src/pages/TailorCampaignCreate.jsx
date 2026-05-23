import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getItems, createCampaign, uploadImage } from '../api/merchantApi'
import { toAbsoluteUrl } from '../config/apiConfig'

const CSS = `
.cc-root {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .cc-root { grid-template-columns: 1fr; }
}

/* ── Panel cards ─────────────────────────────────────────── */
.cc-panel {
  background: #FFFFFF;
  border: 1px solid #F0F0F0;
  border-radius: 12px;
  padding: 24px 26px;
}

.cc-panel-title {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #BBBBBB;
  margin-bottom: 18px;
}

/* ── Form fields ─────────────────────────────────────────── */
.cc-field {
  margin-bottom: 20px;
}

.cc-label {
  display: block;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #999999;
  margin-bottom: 7px;
}

.cc-input {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  color: #111111;
  background: #FAFAFA;
  padding: 11px 14px;
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s, background 0.15s;
  appearance: none;
  -webkit-appearance: none;
  resize: vertical;
}
.cc-input:focus { border-color: #111111; background: #FFFFFF; }
.cc-input::placeholder { color: #CCCCCC; }

/* ── Upload zone ─────────────────────────────────────────── */
.cc-upload-zone {
  border: 1.5px dashed #E0E0E0;
  border-radius: 10px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: #FAFAFA;
}
.cc-upload-zone:hover { border-color: #AAAAAA; background: #F5F5F5; }

.cc-upload-icon {
  width: 36px; height: 36px;
  margin: 0 auto 10px;
  color: #CCCCCC;
}

.cc-upload-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #AAAAAA;
  line-height: 1.6;
}

.cc-upload-text strong {
  color: #111111;
  font-weight: 500;
}

/* ── Image preview strip ─────────────────────────────────── */
.cc-img-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.cc-img-thumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #EEEEEE;
}

.cc-img-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cc-img-remove {
  position: absolute;
  top: 3px; right: 3px;
  width: 18px; height: 18px;
  padding: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Item selector grid ──────────────────────────────────── */
.cc-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-top: 4px;
}

.cc-item-card {
  border: 1.5px solid #EEEEEE;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #FAFAFA;
  opacity: 1;
}
.cc-item-card.selected {
  border-color: #3D3D3D;
  box-shadow: 0 0 0 2px rgba(61,61,61,0.1);
}
.cc-item-card.out-of-stock { opacity: 0.45; }

.cc-item-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
  background: #F0F0F0;
}
.cc-item-img-blank {
  width: 100%;
  aspect-ratio: 1;
  background: #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.cc-item-label {
  padding: 5px 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}
.cc-item-name {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.cc-item-check {
  font-size: 11px;
  color: #3D3D3D;
  flex-shrink: 0;
}

/* ── Submit row ──────────────────────────────────────────── */
.cc-submit-row {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.cc-submit-btn {
  flex: 1;
  padding: 12px;
  background: #3D3D3D;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  letter-spacing: 0.02em;
}
.cc-submit-btn:hover:not(:disabled) { background: #2A2A2A; }
.cc-submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.cc-cancel-btn {
  padding: 12px 18px;
  background: transparent;
  color: #666666;
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}
.cc-cancel-btn:hover { background: #F8F8F8; border-color: #CCCCCC; }

/* ── Error ───────────────────────────────────────────────── */
.cc-error {
  background: #FFF5F5;
  border: 1px solid #FFDDDD;
  border-radius: 6px;
  padding: 10px 14px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 12px;
  color: #CC0000;
  margin-top: -10px;
  margin-bottom: 10px;
}
`

const UploadIcon = () => (
  <svg className="cc-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17,8 12,3 7,8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)

export default function TailorCampaignCreate() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ title: '', copy_text: '', featured_item_ids: [] })
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    fetch('/api/health', { credentials: 'include' })
      .then(r => { if (r.status === 401) navigate('/tailor/login') })
      .catch(() => {})
    getItems()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoadingItems(false))
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleItem = (id) =>
    setForm(f => ({
      ...f,
      featured_item_ids: f.featured_item_ids.includes(id)
        ? f.featured_item_ids.filter(x => x !== id)
        : [...f.featured_item_ids, id],
    }))

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const results = await Promise.all(files.map(uploadImage))
      setUploadedImages(prev => [...prev, ...results.map(r => r.url)])
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url) => setUploadedImages(prev => prev.filter(u => u !== url))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const result = await createCampaign({
        title: form.title.trim(),
        copy_text: form.copy_text.trim() || undefined,
        image_urls: uploadedImages.length ? uploadedImages : undefined,
        featured_item_ids: form.featured_item_ids.length ? form.featured_item_ids : undefined,
      })
      navigate(`/campaign/${result.id}`)
    } catch (err) {
      setError(err.message || 'Failed to create campaign')
    } finally {
      setSubmitting(false)
    }
  }

  const topbarLeft = (
    <div className="app-topbar-pill" style={{ background: 'transparent', border: '1px solid #EEEEEE' }}>
      New Campaign
    </div>
  )

  return (
    <>
      <style>{CSS}</style>
      <AppLayout userType="tailor" topbarLeft={topbarLeft} topbarRight={
        <button className="app-topbar-action-ghost" onClick={() => navigate('/tailor/dashboard')}>
          ← Back
        </button>
      }>
        <form onSubmit={handleSubmit}>
          <div className="cc-root">

            {/* Left column — main form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Campaign info */}
              <div className="cc-panel">
                <div className="cc-panel-title">Campaign Details</div>

                <div className="cc-field">
                  <label className="cc-label">Campaign Title *</label>
                  <input
                    className="cc-input"
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    placeholder="e.g. Eid Collection 2025"
                    required
                  />
                </div>

                <div className="cc-field" style={{ marginBottom: 0 }}>
                  <label className="cc-label">Marketing Copy</label>
                  <textarea
                    className="cc-input"
                    value={form.copy_text}
                    onChange={e => set('copy_text', e.target.value)}
                    placeholder="Tell your customers about this drop…"
                    rows="4"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="cc-panel">
                <div className="cc-panel-title">Campaign Images</div>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="campaign-images"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <label htmlFor="campaign-images">
                  <div className="cc-upload-zone">
                    <UploadIcon />
                    <p className="cc-upload-text">
                      {uploading
                        ? 'Uploading…'
                        : <><strong>Click to upload</strong> or drag &amp; drop<br/>JPG, PNG — max 10 MB each</>
                      }
                    </p>
                  </div>
                </label>

                {uploadedImages.length > 0 && (
                  <div className="cc-img-strip">
                    {uploadedImages.map(url => (
                      <div key={url} className="cc-img-thumb">
                        <img src={toAbsoluteUrl(url)} alt="" />
                        <button
                          type="button"
                          className="cc-img-remove"
                          onClick={() => removeImage(url)}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="cc-error">{error}</div>}

              <div className="cc-submit-row">
                <button
                  type="submit"
                  className="cc-submit-btn"
                  disabled={!form.title.trim() || submitting}
                >
                  {submitting ? 'Publishing…' : 'Publish Campaign'}
                </button>
                <button
                  type="button"
                  className="cc-cancel-btn"
                  onClick={() => navigate('/tailor/dashboard')}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right column — item selector */}
            <div className="cc-panel" style={{ position: 'sticky', top: 68 }}>
              <div className="cc-panel-title">
                Featured Items ({form.featured_item_ids.length} selected)
              </div>

              {loadingItems ? (
                <div className="cc-items-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 8 }} />
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, color: '#AAAAAA', lineHeight: 1.6 }}>
                  No items in the catalogue yet. Add some listings first.
                </p>
              ) : (
                <div className="cc-items-grid">
                  {items.map(item => {
                    const selected = form.featured_item_ids.includes(item.id)
                    const imgUrl = item.image_urls?.[0] ? toAbsoluteUrl(item.image_urls[0]) : null
                    return (
                      <motion.div
                        key={item.id}
                        className={`cc-item-card${selected ? ' selected' : ''}${!item.in_stock ? ' out-of-stock' : ''}`}
                        onClick={() => toggleItem(item.id)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.12 }}
                      >
                        {imgUrl
                          ? <img src={imgUrl} alt={item.name} className="cc-item-img" />
                          : <div className="cc-item-img-blank">👗</div>
                        }
                        <div className="cc-item-label">
                          <span className="cc-item-name">{item.name}</span>
                          {selected && <span className="cc-item-check">✓</span>}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        </form>
      </AppLayout>
    </>
  )
}
