import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import { toAbsoluteUrl, formatPrice, openWhatsApp } from '../config/apiConfig'

export default function GuestViewer() {
  const { id } = useParams()
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

  const handleWhatsAppEnquiry = () => {
    const price = formatPrice(item.price_minor, item.currency)
    const msg = `Hi, I'm interested in the *${item.name}* (${price}) from Mensah. Could you let me know about availability and how to place an order?`
    openWhatsApp(msg)
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
                  {item.in_stock ? (
                    <button
                      onClick={handleAddToCart}
                      style={{ width: '100%', padding: '15px', fontSize: 'var(--text-base)' }}
                    >
                      {addedFeedback ? '✓ Added to Cart' : alreadyInCart ? 'Add Again' : 'Add to Cart'}
                    </button>
                  ) : (
                    <button
                      className="whatsapp"
                      onClick={handleWhatsAppEnquiry}
                      style={{ width: '100%', padding: '15px', fontSize: 'var(--text-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Enquire on WhatsApp
                    </button>
                  )}
                  <button
                    className="ghost"
                    onClick={() => setShowQR(true)}
                    style={{ width: '100%' }}
                  >
                    Share this piece
                  </button>
                </div>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-4)', textAlign: 'center', lineHeight: 1.6 }}>
                  {item.in_stock
                    ? 'Add to cart, then checkout to place your order via WhatsApp.'
                    : 'Message the studio directly to enquire about this piece.'}
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
