import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import GuestLayout from '../components/layout/GuestLayout'
import ListingCard from '../components/listing/ListingCard'
import { getCampaign } from '../api/merchantApi'
import { toAbsoluteUrl, formatPrice } from '../config/apiConfig'
import { mapItemToGarment } from '../utils/garmentMap'
import { useCart } from '../context/CartContext'

function FeaturedItem({ item }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const enriched = { ...item, ...mapItemToGarment(item) }
  const imgUrl = item.image_url ? toAbsoluteUrl(item.image_url) : null

  const handleAdd = () => {
    if (!item.in_stock) return
    addItem({
      item_id: item.id,
      name: item.name,
      price_minor: item.price_minor,
      currency: item.currency,
      image_url: imgUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{
      border: '1.5px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Link to={`/listing/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: 220, background: 'var(--bg-surface)', overflow: 'hidden' }}>
          {imgUrl ? (
            <img src={imgUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%' }} />
          )}
        </div>
        <div style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{item.name}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{formatPrice(item.price_minor, item.currency)}</p>
        </div>
      </Link>
      <div style={{ padding: '0 var(--space-4) var(--space-4)' }}>
        <button
          onClick={handleAdd}
          disabled={!item.in_stock}
          className={item.in_stock ? '' : 'secondary'}
          style={{ width: '100%', padding: '10px', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}
        >
          {!item.in_stock ? 'Out of Stock' : added ? '✓ Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default function CampaignDetail() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    getCampaign(id)
      .then(data => { setCampaign(data); })
      .catch(err => setError(err.message || 'Campaign not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <GuestLayout>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-6)' }}>
          <div className="skeleton" style={{ height: '480px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-7)' }} />
          <div className="skeleton" style={{ height: '48px', width: '60%', marginBottom: 'var(--space-4)' }} />
          <div className="skeleton" style={{ height: '80px', marginBottom: 'var(--space-8)' }} />
        </div>
      </GuestLayout>
    )
  }

  if (error || !campaign) {
    return (
      <GuestLayout>
        <div style={{ textAlign: 'center', padding: 'var(--space-9)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{error || 'Campaign not found'}</p>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>← Back to Collection</Link>
        </div>
      </GuestLayout>
    )
  }

  const images = (campaign.image_urls || []).map(toAbsoluteUrl)

  return (
    <>
      <Helmet><title>{campaign.title} — Mensah</title></Helmet>
      <GuestLayout>
        {/* Hero image */}
        {images.length > 0 && (
          <div style={{ position: 'relative' }}>
            <div style={{
              height: 'clamp(300px, 50vw, 560px)',
              overflow: 'hidden',
              background: 'var(--bg-surface)',
            }}>
              <img
                src={images[activeImage]}
                alt={campaign.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {images.length > 1 && (
              <div style={{
                position: 'absolute', bottom: 'var(--space-5)', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 'var(--space-2)',
              }}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className="ghost"
                    style={{
                      width: i === activeImage ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      background: i === activeImage ? 'white' : 'rgba(255,255,255,0.5)',
                      padding: 0,
                      border: 'none',
                      transition: 'width 0.25s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-7) var(--space-6) var(--space-9)' }}>
          {/* Back link */}
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em', display: 'block', marginBottom: 'var(--space-5)' }}>
            ← Collection
          </Link>

          {/* Title + copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '680px', marginBottom: 'var(--space-8)' }}
          >
            <p className="label" style={{ marginBottom: 'var(--space-3)' }}>Campaign</p>
            <h1 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(var(--text-2xl), 4vw, var(--text-3xl))',
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 'var(--space-5)',
            }}>
              {campaign.title}
            </h1>
            {campaign.copy_text && (
              <p style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                {campaign.copy_text}
              </p>
            )}
          </motion.div>

          {/* Featured items */}
          {campaign.featured_items?.length > 0 && (
            <div>
              <p className="label" style={{ marginBottom: 'var(--space-5)' }}>Featured Pieces</p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 'var(--space-5)',
              }}>
                {campaign.featured_items.map(item => (
                  <FeaturedItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </GuestLayout>
    </>
  )
}
