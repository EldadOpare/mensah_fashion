import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AppLayout from '../components/layout/AppLayout'
import { getItems, createCampaign, uploadImage } from '../api/merchantApi'
import { toAbsoluteUrl } from '../config/apiConfig'

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

  const toggleItem = (itemId) => {
    setForm(f => ({
      ...f,
      featured_item_ids: f.featured_item_ids.includes(itemId)
        ? f.featured_item_ids.filter(id => id !== itemId)
        : [...f.featured_item_ids, itemId],
    }))
  }

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

  return (
    <AppLayout userType="tailor">
      <div style={{ padding: 'var(--space-6) var(--space-7)', maxWidth: '720px' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <p className="label" style={{ marginBottom: 'var(--space-2)' }}>Studio</p>
          <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-2xl)', fontWeight: 400 }}>
            Create Campaign
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Title */}
          <div>
            <label>Campaign Title *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Eid Collection 2025"
              required
            />
          </div>

          {/* Copy */}
          <div>
            <label>Marketing Copy</label>
            <textarea
              value={form.copy_text}
              onChange={e => set('copy_text', e.target.value)}
              placeholder="Tell your customers about this drop…"
              rows="4"
            />
          </div>

          {/* Images */}
          <div>
            <label>Campaign Images</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-5)',
              textAlign: 'center',
              marginBottom: uploadedImages.length ? 'var(--space-4)' : 0,
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                id="campaign-images"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <label
                htmlFor="campaign-images"
                style={{
                  cursor: 'pointer',
                  display: 'block',
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {uploading ? 'Uploading…' : 'Click to upload images (JPG, PNG, max 10MB each)'}
              </label>
            </div>
            {uploadedImages.length > 0 && (
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                {uploadedImages.map(url => (
                  <div key={url} style={{ position: 'relative' }}>
                    <img
                      src={toAbsoluteUrl(url)}
                      alt=""
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border-color)' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      style={{
                        position: 'absolute', top: -8, right: -8,
                        width: 22, height: 22,
                        padding: 0,
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        lineHeight: 1,
                        background: 'var(--text-primary)',
                        color: 'white',
                        border: 'none',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured items */}
          <div>
            <label>Featured Items ({form.featured_item_ids.length} selected)</label>
            {loadingItems ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-sm)' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                {items.map(item => {
                  const selected = form.featured_item_ids.includes(item.id)
                  const imgUrl = item.image_urls?.[0] ? toAbsoluteUrl(item.image_urls[0]) : null
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      style={{
                        cursor: 'pointer',
                        border: `2px solid ${selected ? 'var(--text-primary)' : 'var(--border-color)'}`,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        transition: 'border-color 0.15s',
                        opacity: item.in_stock ? 1 : 0.5,
                      }}
                    >
                      <div style={{ height: 80, background: 'var(--bg-surface)' }}>
                        {imgUrl && <img src={imgUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 500, lineHeight: 1.3, flex: 1, marginRight: 4 }}>{item.name}</p>
                        {selected && (
                          <span style={{ flexShrink: 0, color: 'var(--text-primary)', fontSize: '14px' }}>✓</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {error && (
            <p style={{ color: 'var(--error)', fontSize: 'var(--text-sm)', background: '#fff5f5', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button type="submit" disabled={!form.title.trim() || submitting} style={{ flex: 1, padding: '13px' }}>
              {submitting ? 'Publishing…' : 'Publish Campaign'}
            </button>
            <button type="button" className="secondary" onClick={() => navigate('/tailor/dashboard')} style={{ padding: '13px 20px' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
