import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import GuestLayout from '../components/layout/GuestLayout'
import PageTransition from '../components/ui/PageTransition'
import GarmentViewer from '../components/viewer/GarmentViewer'
import PhotoGallery from '../components/viewer/PhotoGallery'
import SwatchSwitcher from '../components/viewer/SwatchSwitcher'
import FabricTintPicker from '../components/viewer/FabricTintPicker'
import QRModal from '../components/share/QRModal'
import { useGarmentTexture } from '../hooks/useGarmentTexture'
import { useCart } from '../context/CartContext'
import { getItem } from '../api/merchantApi'
import { mapItemToGarment } from '../utils/garmentMap'
import { toAbsoluteUrl, formatPrice } from '../config/apiConfig'

export default function GuestViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, items: cartItems } = useCart()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showQR, setShowQR] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const { activeTexture, tintColor, switchTexture, updateTint } = useGarmentTexture()

  useEffect(() => {
    fetchItem()
  }, [id])

  const fetchItem = async () => {
    try {
      const data = await getItem(id)
      const garment = mapItemToGarment(data)
      const enriched = { ...data, ...garment }
      setItem(enriched)
      const urls = (data.image_urls || []).map(toAbsoluteUrl).filter(Boolean)
      if (urls.length > 0) switchTexture(urls[0])
    } catch (err) {
      console.warn('Item fetch failed', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!item || !item.in_stock) return
    addItem({
      item_id: item.id,
      name: item.name,
      price_minor: item.price_minor,
      currency: item.currency,
      image_url: item.image_urls?.[0] ? toAbsoluteUrl(item.image_urls[0]) : null,
    })
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  const alreadyInCart = cartItems.some(i => i.item_id === id)
  const imageUrls = (item?.image_urls || []).map(toAbsoluteUrl)

  if (loading) {
    return (
      <GuestLayout>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--space-8)' }}>
          <div className="skeleton" style={{ height: '620px', borderRadius: 'var(--radius-md)' }} />
          <div>
            <div className="skeleton" style={{ height: '14px', width: '100px', marginBottom: 'var(--space-3)' }} />
            <div className="skeleton" style={{ height: '48px', width: '80%', marginBottom: 'var(--space-4)' }} />
            <div className="skeleton" style={{ height: '28px', width: '120px', marginBottom: 'var(--space-5)' }} />
            <div className="skeleton" style={{ height: '80px', marginBottom: 'var(--space-6)' }} />
            <div className="skeleton" style={{ height: '52px' }} />
          </div>
        </div>
      </GuestLayout>
    )
  }

  if (!item) {
    return (
      <GuestLayout>
        <div style={{ textAlign: 'center', padding: 'var(--space-9)' }}>
          <h2 style={{ fontFamily: 'var(--font-editorial)', marginBottom: 'var(--space-4)' }}>Piece not found</h2>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 'var(--text-sm)' }}>← Return to collection</Link>
        </div>
      </GuestLayout>
    )
  }

  return (
    <PageTransition>
      <Helmet>
        <title>{item.name} — Mensah</title>
        <meta property="og:title" content={item.name} />
        <meta property="og:image" content={imageUrls[0]} />
        <meta property="og:description" content={item.description || `View ${item.name} and order your custom fit.`} />
      </Helmet>

      <GuestLayout>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ padding: 'var(--space-4) var(--space-6) 0' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', letterSpacing: '0.06em' }}>
              ← Collection
            </Link>
          </div>

          {/* Main grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) 400px',
            gap: 'var(--space-8)',
            padding: 'var(--space-5) var(--space-6) var(--space-9)',
            alignItems: 'start',
          }}>
            {/* Left — media */}
            <div>
              {item.displayMode === '3d' ? (
                <div style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  height: '620px',
                  background: 'var(--bg-surface)',
                }}>
                  <GarmentViewer
                    modelUrl={`/models/garments/${item.garmentId}.glb`}
                    textureUrl={activeTexture}
                    tintColor={tintColor}
                    garmentId={item.garmentId}
                  />
                </div>
              ) : (
                <PhotoGallery urls={imageUrls} />
              )}
            </div>

            {/* Right — product info */}
            <aside style={{ position: 'sticky', top: '80px' }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Title + price */}
                <div style={{ marginBottom: 'var(--space-5)' }}>
                  <p className="label" style={{ marginBottom: 'var(--space-2)' }}>
                    {item.in_stock ? 'Available' : 'Out of Stock'}
                  </p>
                  <h1 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-2xl)', fontWeight: 400, marginBottom: 'var(--space-3)', lineHeight: 1.2 }}>
                    {item.name}
                  </h1>
                  <p style={{ fontSize: 'var(--text-xl)', color: item.in_stock ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 400 }}>
                    {formatPrice(item.price_minor, item.currency)}
                  </p>
                </div>

                {item.description && (
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-6)', fontSize: 'var(--text-base)' }}>
                    {item.description}
                  </p>
                )}

                {/* 3D controls */}
                {item.displayMode === '3d' && imageUrls.length > 1 && (
                  <div style={{ background: 'var(--bg-surface)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)' }}>
                    <div style={{ marginBottom: 'var(--space-4)' }}>
                      <label style={{ marginBottom: 'var(--space-3)' }}>Select Fabric</label>
                      <SwatchSwitcher urls={imageUrls} activeUrl={activeTexture} onSelect={switchTexture} />
                    </div>
                    <div>
                      <label style={{ marginBottom: 'var(--space-3)' }}>Fabric Tint</label>
                      <FabricTintPicker activeTint={tintColor} onSelect={updateTint} />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={!item.in_stock}
                    style={{ width: '100%', padding: '15px', fontSize: 'var(--text-base)' }}
                  >
                    {!item.in_stock
                      ? 'Out of Stock'
                      : addedFeedback
                        ? '✓ Added to Cart'
                        : alreadyInCart
                          ? 'Add Again'
                          : 'Add to Cart'}
                  </button>
                  <button
                    className="ghost"
                    onClick={() => setShowQR(true)}
                    style={{ width: '100%' }}
                  >
                    Share this piece
                  </button>
                </div>

                {/* Commerce note */}
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-4)', textAlign: 'center', lineHeight: 1.6 }}>
                  Orders are placed via WhatsApp — add to cart, then checkout to message the studio directly.
                </p>
              </motion.div>
            </aside>
          </div>
        </div>

        <QRModal isOpen={showQR} onClose={() => setShowQR(false)} url={window.location.href} title={item.name} />

        <style>{`
          @media (max-width: 768px) {
            aside[style] { position: static !important; }
            div[style*="gridTemplateColumns: minmax"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </GuestLayout>
    </PageTransition>
  )
}
