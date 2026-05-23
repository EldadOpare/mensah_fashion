# Mensah — Project Requirements Document

**Version:** 4.0
**Build Tool:** Claude Code

---

## Stack

**Frontend:** React 18, Vite, React Three Fiber, Three.js, Framer Motion, Lottie
**API:** Vercel Serverless Functions (Node.js, Express adapter)
**Database:** Turso (serverless SQLite, libSQL)
**ORM:** Drizzle ORM
**Storage:** Cloudinary (direct browser upload)
**Payments:** Paystack (inline)
**Email:** Resend
**Hosting:** Vercel (frontend and API in one deployment, fully free)

---

## 1. What This Is

Mensah is a two-sided web app for tailors, seamstresses, and clothing sellers. Tailors publish listings with fabric photos or 3D garment previews. Guests browse, view garments in 3D or photo mode, switch between fabric swatches, tint colors, share, and place paid orders. The app installs as a PWA. The homepage opens with a sewing animation that leads into the listings experience.

---

## 2. Hosting on Vercel

Everything deploys to Vercel on the free Hobby plan. There is no separate backend server. The Express app runs as a Vercel Serverless Function inside the /api directory. Render, Railway, Fly, and any other separate server host are not used.

### 2.1 Project Structure for Vercel

```
mensah/
├── src/                      # React frontend
├── api/
│   └── index.js              # Express app exported as a serverless function
├── public/
│   └── models/garments/      # .glb files served by Vercel CDN
├── vercel.json               # Routing config
└── vite.config.js
```

### 2.2 vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index" }
  ],
  "functions": {
    "api/index.js": {
      "maxDuration": 15
    }
  }
}
```

### 2.3 Express as Serverless Function

```js
// api/index.js
const express = require('express')
const app = express()

// middleware and routes registered here

module.exports = app
```

Vercel wraps the export automatically. No app.listen() call is needed or used.

### 2.4 File Uploads on Vercel

Vercel serverless functions cannot handle multipart file uploads reliably because of the 4.5MB request body limit. Fabric images upload directly from the browser to Cloudinary using a server-generated signature. The flow is:

1. Client requests a signed upload signature from /api/upload/sign
2. Server generates a Cloudinary signature using cloudinary.utils.api_sign_request
3. Client POSTs the file directly to Cloudinary
4. Client receives the Cloudinary URL and sends it to /api/listings to save

This avoids routing files through the serverless function entirely.

### 2.5 Vercel Environment Variables

Set all environment variables in the Vercel dashboard under Project Settings. They apply to all deployments automatically. Do not use a .env file in production. Use .env.local for local development.

---

## 3. Display Modes — 3D and Photo

Tailors choose one display mode per listing when creating it.

**3D Mode:** Tailor selects a garment type from the library, uploads up to 4 fabric swatches, and guests see the fabric wrapped on a rotating 3D model with swatch switching and tint controls.

**Photo Mode:** Tailor uploads up to 6 photos of the actual finished garment. Guests see a clean photo gallery. No 3D model is involved. This is the right choice for custom one-of-a-kind pieces, unusual silhouettes, or tailors who want to show the real finished product.

Both modes coexist. The listing card on the browse grid shows a badge: a rotating cube icon for 3D listings, a camera icon for photo listings. The viewer page renders the correct experience based on listing.displayMode.

### 3.1 Why Both Modes

Not every garment fits a pre-built 3D model. A tailor with a completely custom cut, an asymmetric design, or a special occasion piece with structure and boning cannot fake that on a generic kaftan model. Photo mode gives them a clean professional way to present real work without compromise. 3D mode gives fabric sellers and tailors with standard garment types an impressive showcase that nobody else is offering.

---

## 4. Garment Model Library — 25 Types Minimum

All models must be in .glb format, UV-mapped, under 5MB each, with a neutral grey or white material as the default. Static pose only — no rigging or animation needed.

### 4.1 Required Garments

| ID | Garment | Notes |
|----|---------|-------|
| shirt_casual | Casual shirt | Short sleeve, crew neck |
| shirt_formal | Formal shirt | Long sleeve, collar, cuffs |
| shirt_dashiki | Dashiki shirt | Wide collar, embroidered neck detail |
| trousers_straight | Straight-leg trousers | Full length |
| trousers_wide | Wide-leg trousers | Palazzo style |
| trousers_chinos | Slim chinos | Tapered ankle |
| dress_mini | Mini dress | Above knee, fitted |
| dress_midi | Midi dress | Below knee, fitted |
| dress_maxi | Maxi dress | Floor length, flowing |
| dress_shift | Shift dress | Boxy, knee length |
| kaftan | Kaftan / Boubou | Wide, long, West African |
| kaftan_short | Short kaftan | Hip length, open sides |
| agbada | Agbada | 3-piece flowing robe |
| ankara_top | Ankara blouse | Short, puff or straight sleeve |
| ankara_crop | Ankara crop top | Cropped, structured |
| suit_jacket | Blazer / Suit jacket | Single breasted |
| suit_double | Double-breasted blazer | Formal |
| skirt_wrap | Wrap skirt | Knee length |
| skirt_pencil | Pencil skirt | Fitted, below knee |
| skirt_maxi | Maxi skirt | Floor length, full |
| jumpsuit | Jumpsuit | Full length, wide leg |
| senator_suit | Senator / Native suit | Matching top and trouser |
| buba_sokoto | Buba and Sokoto | Yoruba male native set |
| iro_buba | Iro and Buba | Yoruba women's wrapper set |
| two_piece | Co-ord two-piece set | Matching top and skirt or trouser |

### 4.2 Model Sources (in order of preference)

1. Sketchfab — filter Downloadable and Free, download .glb files, target clean UV maps
2. Quaternius (quaternius.com) — free low-poly clothing packs
3. Polyhaven — generic shapes and fabric references
4. ReadyPlayerMe avatar exports — for character-attached clothing if needed
5. Blender Python script — last resort: write a script to generate a parametric shape and export as .glb

Store all models in /public/models/garments/[id].glb.

### 4.3 garmentConfig.json

```json
{
  "kaftan":            { "repeatX": 2, "repeatY": 3, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "agbada":            { "repeatX": 3, "repeatY": 4, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "shirt_casual":      { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "shirt_formal":      { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "shirt_dashiki":     { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "trousers_straight": { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "trousers_wide":     { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "trousers_chinos":   { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "dress_mini":        { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "dress_midi":        { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "dress_maxi":        { "repeatX": 2, "repeatY": 3, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "dress_shift":       { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "kaftan_short":      { "repeatX": 2, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "ankara_top":        { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "ankara_crop":       { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "suit_jacket":       { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "suit_double":       { "repeatX": 1, "repeatY": 1, "wrapS": "ClampToEdgeWrapping", "wrapT": "ClampToEdgeWrapping" },
  "skirt_wrap":        { "repeatX": 2, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "skirt_pencil":      { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "skirt_maxi":        { "repeatX": 2, "repeatY": 3, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "jumpsuit":          { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "senator_suit":      { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "buba_sokoto":       { "repeatX": 2, "repeatY": 3, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "iro_buba":          { "repeatX": 2, "repeatY": 3, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" },
  "two_piece":         { "repeatX": 1, "repeatY": 2, "wrapS": "RepeatWrapping",      "wrapT": "RepeatWrapping" }
}
```

---

## 5. Homepage Hero Animation Sequence

The homepage opens with a full-screen cinematic sequence before the listings appear. This is the most important first impression moment and must be built with care.

### 5.1 The Four Acts

**Act 1 — The Sewing (0s to 3s)**
The screen is near-black (#0A0A0A). A Lottie animation plays centered: a needle and thread working across fabric, or a sewing machine foot running a seam. The animation is white or light gold on the dark background. Loop is off. The stitching travels left to right and completes.

Source a free Lottie JSON from lottiefiles.com — search "sewing", "needle thread", or "embroidery". Download the .json file and store it at /src/assets/lottie/sewing.json.

**Act 2 — The Cut (3s to 4.2s)**
A thin bright horizontal line appears across the exact center of the screen, like a thread pulled taut across fabric. Using Framer Motion, the screen splits: the top half slides upward and the bottom half slides downward, revealing white space between them.

**Act 3 — The Garment (4.2s to 5.5s)**
A 3D garment model (kaftan or agbada — whichever has the best visual presence) rises from the split center, scaling from 0 to full with a Framer Motion spring. It auto-rotates slowly. The background is now white. This uses a small isolated R3F Canvas mounted only during Act 3.

**Act 4 — The Reveal (5.5s to 7s)**
The two panels continue sliding until they exit the viewport completely. The full listings grid is revealed behind them. Listing cards stagger in with a 60ms delay between each using Framer Motion.

### 5.2 Implementation

```bash
npm install lottie-react framer-motion
```

HeroSequence.jsx manages the full animation using a state machine:

```
idle -> sewing -> splitting -> garment -> revealing -> done
```

Each state is triggered by timers in useEffect. The Lottie onComplete callback triggers the transition from sewing to splitting.

```jsx
import Lottie from 'lottie-react'
import sewingAnimation from '../assets/lottie/sewing.json'

<Lottie animationData={sewingAnimation} loop={false} onComplete={onSewingDone} />
```

Panel split using Framer Motion:

```jsx
// top panel slides up
<motion.div
  animate={{ y: state === 'splitting' || state === 'revealing' ? '-100%' : '0%' }}
  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
/>

// bottom panel slides down
<motion.div
  animate={{ y: state === 'splitting' || state === 'revealing' ? '100%' : '0%' }}
  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
/>
```

Listing stagger on reveal:

```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } }
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}
```

A Skip button in the corner lets users jump directly to the listings. After the sequence completes, a sessionStorage flag prevents it from replaying in the same browser session.

---

## 6. Framer Motion Animations — Site-wide

### 6.1 Where to Use

**Listing cards — browse grid:** Stagger in on initial load using the container/item pattern above. On hover: scale 1.015, duration 0.2s. No shadows added on hover — scale only.

**Order drawer:** Slides in from the right on mobile. Framer Motion spring with damping 28, stiffness 260.

**QR modal:** Scale and fade from center: initial scale 0.92 opacity 0, animate to scale 1 opacity 1.

**Page transitions:** Fade on route change using AnimatePresence wrapping the router outlet. opacity 0 to 1, duration 0.22s.

**Login page:** Wrong PIN triggers a horizontal shake on the input: animate x values [0, -8, 8, -4, 4, 0].

**Garment selector tiles:** On selection, the tile gets a thin black border and a scissors icon scales in at the top-right corner.

**Status tag on order dockets:** When the tailor changes an order status, the tag does a vertical flip (rotateX 90 to 0) to animate in the new status.

**Swatch switcher:** Texture crossfade — opacity 0 to 1 on the canvas material when switching swatches.

---

## 7. 3D Viewer

### 7.1 Controls

- Auto-rotate on Y axis at speed 0.3 on load
- Orbit on drag (mouse and touch)
- Zoom on scroll and pinch
- Tilt vertically to inspect hem or collar
- Auto-rotate pauses on any interaction, resumes after 3 seconds of inactivity

### 7.2 Swatch Switcher

Up to 4 fabric swatches per 3D listing. A thumbnail row sits below the canvas. Clicking switches the active texture on the model instantly. The switch fades with a Framer Motion opacity transition on the canvas material.

### 7.3 Fabric Tint Picker

A row of 6 preset color swatches sits next to the swatch switcher: white, black, burgundy, olive, navy, rust. An additional open picker uses react-colorful for any custom color. Selecting a tint applies material.color.set(hex) on traversed meshes. The fabric pattern stays — only the hue shifts. A Reset button restores white.

### 7.4 Canvas Setup

```jsx
<Canvas camera={{ position: [0, 0.5, 2.5], fov: 45 }}>
  <ambientLight intensity={0.8} />
  <directionalLight position={[2, 4, 2]} intensity={1.2} />
  <directionalLight position={[-2, 2, -2]} intensity={0.4} />
  <Suspense fallback={<GarmentLoader />}>
    <GarmentModel url={modelUrl} texture={activeTexture} tint={tintColor} />
  </Suspense>
  <OrbitControls
    autoRotate
    autoRotateSpeed={0.5}
    enableZoom
    enablePan={false}
    minDistance={1}
    maxDistance={5}
    minPolarAngle={Math.PI / 6}
    maxPolarAngle={Math.PI / 1.5}
  />
</Canvas>
```

---

## 8. Photo Mode Viewer

When listing.displayMode === 'photo', the viewer page renders a photo gallery instead of the 3D canvas.

A full-width primary image takes the top portion of the page. A horizontal scroll row of thumbnails sits below. Clicking a thumbnail replaces the primary image with a Framer Motion crossfade (opacity 0 to 1). Clicking the primary image opens a fullscreen lightbox. Up to 6 photos are supported.

No swatch switcher or tint picker in photo mode. Share, QR code, and order flow are identical to 3D mode.

---

## 9. Application File Structure

```
mensah/
├── src/
│   ├── pages/
│   │   ├── GuestHome.jsx             # Browse grid with hero sequence
│   │   ├── GuestViewer.jsx           # 3D or photo viewer based on displayMode
│   │   ├── OrderTracking.jsx         # /order/:ref public status page
│   │   ├── TailorLogin.jsx
│   │   ├── TailorDashboard.jsx       # Listings and order inbox
│   │   └── TailorCreateListing.jsx   # Multi-step listing creation
│   ├── components/
│   │   ├── hero/
│   │   │   └── HeroSequence.jsx
│   │   ├── viewer/
│   │   │   ├── GarmentViewer.jsx     # R3F canvas
│   │   │   ├── SwatchSwitcher.jsx    # Fabric thumbnail row
│   │   │   ├── FabricTintPicker.jsx  # Preset swatches and react-colorful
│   │   │   ├── PhotoGallery.jsx      # Photo mode gallery and lightbox
│   │   │   └── ViewerControls.jsx    # Orbit hint overlay
│   │   ├── listing/
│   │   │   ├── ListingCard.jsx
│   │   │   ├── GarmentSelector.jsx   # Pattern-piece style tiles
│   │   │   └── FabricUploader.jsx    # Signed Cloudinary multi-file upload
│   │   ├── order/
│   │   │   ├── OrderDrawer.jsx       # Slide-in order form and Paystack
│   │   │   ├── OrderDocket.jsx       # Tailor-side order card
│   │   │   └── StatusTag.jsx         # Fabric-label status badge
│   │   ├── share/
│   │   │   ├── ShareButton.jsx
│   │   │   └── QRModal.jsx
│   │   └── ui/
│   │       ├── PageTransition.jsx    # Framer Motion route wrapper
│   │       └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── useGarmentTexture.js
│   │   ├── usePaystack.js
│   │   └── useCloudinaryUpload.js
│   ├── assets/
│   │   └── lottie/
│   │       └── sewing.json
│   └── config/
│       └── garmentConfig.json
├── api/
│   └── index.js                      # Full Express app exported for Vercel
├── public/
│   ├── models/garments/              # All 25 .glb files
│   └── icons/                        # PWA icons
├── vercel.json
└── vite.config.js
```

---

## 10. Database — Turso

Turso is a serverless SQLite platform with a web dashboard at turso.tech. Free tier includes 9GB storage and 1 billion row reads per month. Never pauses. Never expires.

### 10.1 Setup

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
turso db create mensah
turso db show mensah --url
turso db tokens create mensah
```

Add the URL and token to .env.local for development and to the Vercel dashboard for production.

### 10.2 Schema

```ts
import { sql } from 'drizzle-orm'
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'

export const listings = sqliteTable('listings', {
  id:                   integer('id').primaryKey({ autoIncrement: true }),
  title:                text('title').notNull(),
  garmentId:            text('garment_id'),
  displayMode:          text('display_mode').notNull().default('3d'),
  fabricUrls:           text('fabric_urls').notNull(),
  price:                text('price'),
  currency:             text('currency').default('GHS'),
  contact:              text('contact'),
  tailorName:           text('tailor_name'),
  description:          text('description'),
  whatsappMeasurements: integer('whatsapp_measurements').default(0),
  published:            integer('published').default(1),
  createdAt:            text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const orders = sqliteTable('orders', {
  id:              integer('id').primaryKey({ autoIncrement: true }),
  listingId:       integer('listing_id').notNull(),
  customerName:    text('customer_name').notNull(),
  customerPhone:   text('customer_phone').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  measurements:    text('measurements'),
  notes:           text('notes'),
  paystackRef:     text('paystack_ref').unique(),
  paymentStatus:   text('payment_status').default('pending'),
  orderStatus:     text('order_status').default('received'),
  createdAt:       text('created_at').default(sql`CURRENT_TIMESTAMP`),
})
```

---

## 11. Cloudinary — Direct Browser Upload

### 11.1 Why Direct Upload

Vercel serverless functions have a 4.5MB body size limit. File uploads cannot go through the function body. The client uploads directly to Cloudinary using a server-generated signature.

### 11.2 Server Signature Endpoint

```js
// GET /api/upload/sign — generates a Cloudinary upload signature for the client
app.get('/api/upload/sign', authMiddleware, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000)
  const params = { folder: 'mensah/fabrics', timestamp }
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)
  res.json({ signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY })
})
```

### 11.3 Client Upload Hook

```js
// src/hooks/useCloudinaryUpload.js
// Built this so components didn't have to manage the two-step sign-then-upload flow

export async function uploadToCloudinary(file) {
  const signRes = await fetch('/api/upload/sign', { credentials: 'include' })
  const { signature, timestamp, apiKey } = await signRes.json()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature)
  formData.append('timestamp', timestamp)
  formData.append('api_key', apiKey)
  formData.append('folder', 'mensah/fabrics')

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  const data = await uploadRes.json()
  return data.secure_url
}
```

fabricUrls in Turso stores a JSON array of Cloudinary HTTPS URLs. Always JSON.parse on read and JSON.stringify on write. Index 0 is always the thumbnail and the OG image.

---

## 12. Payments — Paystack

Load Paystack inline script in index.html:

```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

Do not install Paystack via npm on the client.

### 12.1 Guest Order Flow

1. Guest fills the order form and clicks Pay Now
2. Paystack popup opens
3. On success the callback receives a payment reference
4. Client POSTs the reference and order data to /api/orders
5. Server verifies the reference with Paystack independently
6. If verified, order is saved and Resend email fires
7. Guest sees a success screen with tracking link

### 12.2 Server Verification

```js
// Verified with Paystack before saving anything because the client-side
// success callback can be faked or replayed by a malicious request

const verify = await fetch(
  `https://api.paystack.co/transaction/verify/${paystackRef}`,
  { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
)
const { data } = await verify.json()

if (data.status !== 'success') {
  return res.status(400).json({ error: 'Payment not confirmed' })
}
```

---

## 13. Email — Resend

Resend free tier: 3,000 emails per month, no credit card required to start.

```bash
npm install resend
```

Send the tailor a full order email on every confirmed payment:

```js
// Used HTML body here because the tailor should not need to log in
// just to see basic order details

await resend.emails.send({
  from:    'Mensah <orders@yourdomain.com>',
  to:      process.env.TAILOR_EMAIL,
  subject: `New Order: ${listing.title} ref #${order.id}`,
  html:    buildOrderEmailHtml(order, listing)
})
```

---

## 14. Sharing — QR Codes and OG Tags

### 14.1 QR Code

```bash
npm install qrcode.react
```

A QR modal shows the listing URL as a QR code. A Download button reads the canvas with canvas.toDataURL() and triggers a browser file download as PNG. Tailors use this in WhatsApp messages and print flyers.

### 14.2 OG Meta Tags

```bash
npm install react-helmet-async
```

Every listing page sets its own OG tags using the first Cloudinary URL as the image. This makes WhatsApp link previews show the actual fabric photo with the garment name and price.

---

## 15. PWA

```bash
npm install -D vite-plugin-pwa
```

Service worker uses CacheFirst for .glb model files with a 30-day expiry. App shell and static assets are precached. Once installed on a phone, Mensah runs as a home-screen app without a browser address bar.

---

## 16. Design System

### 16.1 Tailor Dashboard — Studio Aesthetic

**Background:** Dot-grid pattern on #FAFAFA using CSS: radial-gradient(circle, #E0E0E0 1px, transparent 1px) positioned at 20px 20px

**Dividers:** border-top: 1px dashed #CCCCCC — evoking a fabric cutting guide line

**Garment selector tiles:** Rectangular cards with a small scissors SVG in the top-right corner. On selection, a thin black border appears and the scissors icon rotates 15 degrees via Framer Motion.

**Order dockets:** Left-border 3px solid #111111. Monospace font for the order reference number. Playfair Display for the garment name. Small Inter text for the date.

**Status tags:** Uppercase, outlined pill with no background fill, 1px border, wide letter-spacing. RECEIVED is black, CUT is dark grey, IN PROGRESS is olive, READY is forest green, DELIVERED is muted navy. On change, the tag flips on the X axis.

**Typography:** Playfair Display (Google Fonts) for all headings. Inter for all body text, data, and inputs. Two fonts only.

**Header rule:** 1px solid #111111 under the page header. No shadow. No gradient.

### 16.2 Guest View

```
Background:     #FFFFFF
Surface/Cards:  #FAFAFA
Border:         1px solid #E8E8E8
Text Primary:   #111111
Text Secondary: #888888
Accent:         #111111
Error:          #CC0000
Font:           Inter, weights 400 and 500
Border Radius:  4px inputs, 6px cards
```

### 16.3 Absolute Rules

- No box-shadow anywhere in the codebase — not on cards, modals, inputs, or the canvas wrapper
- No CSS gradients outside the dot-grid background pattern
- No decorative icons unless they are functional
- 8px base spacing grid
- The 3D canvas or the photo gallery is always the visual hero — all other elements reduce their visual weight around it

---

## 17. Security

Security is built from Phase 1. No feature is complete until its security requirements are met.

### 17.1 HTTP Headers — Helmet

Helmet is the first middleware registered, before CORS and before any routes:

```bash
npm install helmet
```

```js
// Registered Helmet first because it needs to set headers before
// any route or middleware has a chance to send a response

app.use(helmet())
```

### 17.2 Rate Limiting

Per-route limits, not a single global one:

```bash
npm install express-rate-limit
```

```js
// Kept the login limit strict to stop PIN brute-force attempts
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Try again in 15 minutes.'
}))

app.use('/api/orders',  rateLimit({ windowMs: 60 * 60 * 1000, max: 20 }))
app.use('/api/upload',  rateLimit({ windowMs: 60 * 60 * 1000, max: 30 }))
app.use('/api',         rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))
```

### 17.3 Authentication

PIN comparison uses constant-time comparison to prevent timing attacks:

```bash
npm install jsonwebtoken cookie-parser
```

```js
// Used timingSafeEqual because regular string comparison leaks timing
// information that could help someone guess the PIN length or value

const isValid = crypto.timingSafeEqual(
  Buffer.from(submitted.padEnd(64)),
  Buffer.from(process.env.TAILOR_PIN.padEnd(64))
)
```

JWT stored in an HttpOnly cookie — not accessible from JavaScript:

```js
// Stored in HttpOnly cookie so that even if XSS runs on the page,
// the token cannot be read or stolen by JavaScript

res.cookie('fv_token', token, {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge:   8 * 60 * 60 * 1000,
})
```

Auth middleware checks the cookie on every protected route:

```js
module.exports = function authMiddleware(req, res, next) {
  const token = req.cookies?.fv_token
  if (!token) return res.status(401).json({ error: 'Unauthorised' })
  try {
    req.tailor = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
}
```

### 17.4 Input Validation — Zod

Every POST and PUT handler validates its body before touching the database:

```bash
npm install zod
```

```js
const listingSchema = z.object({
  title:       z.string().min(2).max(100),
  displayMode: z.enum(['3d', 'photo']),
  garmentId:   z.enum([
    'shirt_casual','shirt_formal','shirt_dashiki','trousers_straight','trousers_wide',
    'trousers_chinos','dress_mini','dress_midi','dress_maxi','dress_shift','kaftan',
    'kaftan_short','agbada','ankara_top','ankara_crop','suit_jacket','suit_double',
    'skirt_wrap','skirt_pencil','skirt_maxi','jumpsuit','senator_suit',
    'buba_sokoto','iro_buba','two_piece'
  ]).optional(),
  fabricUrls:  z.string().min(2),
  price:       z.string().max(50).optional(),
  currency:    z.enum(['GHS','NGN','USD']).default('GHS'),
  contact:     z.string().max(100).optional(),
  tailorName:  z.string().max(80).optional(),
  description: z.string().max(500).optional(),
  whatsappMeasurements: z.number().int().min(0).max(1).default(0),
})

const orderSchema = z.object({
  listingId:       z.number().int().positive(),
  customerName:    z.string().min(2).max(100),
  customerPhone:   z.string().min(7).max(20),
  deliveryAddress: z.string().min(5).max(300),
  measurements:    z.object({
    bust: z.string().optional(), waist: z.string().optional(),
    hip:  z.string().optional(), height: z.string().optional(),
    sleeve: z.string().optional(),
  }).optional(),
  notes:       z.string().max(500).optional(),
  paystackRef: z.string().min(5).max(100),
})
```

### 17.5 CORS

```js
const allowed = [
  'http://localhost:5173',
  'https://your-vercel-domain.vercel.app',
]

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) cb(null, true)
    else cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
```

### 17.6 Environment Variables

.gitignore is created as the very first file. It includes .env.local, node_modules/, dist/, and *.db.

A .env.example with all keys and placeholder values is committed. Real values go into .env.local locally and the Vercel dashboard for production.

VITE_ prefixed variables are exposed to the browser. Only truly public values use this prefix (Paystack public key, Cloudinary cloud name). Secret keys never use the VITE_ prefix.

Generate JWT_SECRET with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 17.7 SQL Safety

Drizzle ORM uses parameterised queries everywhere. No raw SQL string concatenation is used. If a raw query is ever needed, the Drizzle sql template tag is used.

### 17.8 Error Handling

The global error handler is the last middleware registered. In production it returns a generic message. Stack traces are logged server-side only and never sent to the client.

```js
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  })
})
```

---

## 18. API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/login | | PIN login, sets HttpOnly JWT cookie |
| POST | /api/auth/logout | | Clears the cookie |
| GET | /api/listings | | All published listings |
| GET | /api/listings/:id | | Single listing |
| POST | /api/listings | YES | Create listing |
| PUT | /api/listings/:id | YES | Update listing |
| DELETE | /api/listings/:id | YES | Delete listing |
| GET | /api/upload/sign | YES | Get Cloudinary signed upload credentials |
| GET | /api/orders | YES | All orders for tailor |
| GET | /api/orders/:ref | | Single order by Paystack ref (tracking page) |
| POST | /api/orders | | Create order — Paystack verification required first |
| PUT | /api/orders/:id/status | YES | Update order status |

---

## 19. Build Phases

### Phase 1 — Foundation and Security

- Create .gitignore as the very first file before anything else
- Scaffold React and Vite project
- Install and configure Framer Motion, Lottie, R3F, Drei, vite-plugin-pwa
- Source all 25 garment .glb models
- Build GarmentViewer.jsx with orbit controls, auto-rotate, swatch switching, and tint
- Write garmentConfig.json for all 25 garments
- Set up Express in api/index.js with Helmet, CORS, rate limiters, cookie-parser, and error handler
- Write authMiddleware.js
- Write .env.example with all variable names and placeholder values

### Phase 2 — Hero Animation

- Source Lottie sewing animation from Lottiefiles
- Build HeroSequence.jsx with the full 4-act state machine
- Test the full sequence on desktop and mobile
- Add Skip button and sessionStorage flag

### Phase 3 — Framer Motion Site-wide

- PageTransition.jsx route wrapper
- Listing card hover and stagger
- Order drawer slide
- QR modal scale and fade
- Login shake on wrong PIN
- Garment tile selection animation
- Status tag flip on change
- Swatch switcher texture crossfade

### Phase 4 — Database and Upload

- Set up Turso and run drizzle-kit push to create tables
- Set up Cloudinary signed upload endpoint
- Build useCloudinaryUpload.js hook
- Build FabricUploader.jsx with multi-file support, progress indicator, and preview

### Phase 5 — Tailor Side

- Tailor login with constant-time PIN and JWT cookie
- Multi-step listing creation: mode select, garment select for 3D mode, upload, details, publish
- Tailor dashboard with dot-grid background, docket cards, and status tags
- Order status update with tag flip animation

### Phase 6 — Guest Side and Orders

- Listing browse grid with hero sequence leading in
- GuestViewer.jsx rendering 3D or photo mode based on displayMode
- Order drawer with Paystack inline checkout
- Server-side Paystack verification, order save, and Resend email
- Order tracking page at /order/:ref

### Phase 7 — Sharing and Polish

- QR code modal and PNG download
- OG meta tags with react-helmet-async
- PWA icons and service worker validation
- Mobile responsiveness and touch testing
- Loading and error states throughout
- All secrets confirmed out of git

---

## 20. Dependencies

### Frontend

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "three": "^0.165",
  "@react-three/fiber": "^8",
  "@react-three/drei": "^9",
  "framer-motion": "^11",
  "lottie-react": "^2",
  "react-colorful": "^5",
  "qrcode.react": "^3",
  "react-helmet-async": "^2",
  "vite": "^5",
  "vite-plugin-pwa": "latest"
}
```

### API

```json
{
  "express": "^4",
  "helmet": "^7",
  "express-rate-limit": "^7",
  "cors": "^2",
  "cookie-parser": "^1",
  "jsonwebtoken": "^9",
  "zod": "^3",
  "drizzle-orm": "latest",
  "@libsql/client": "latest",
  "cloudinary": "^2",
  "resend": "^3",
  "dotenv": "^16"
}
```

### Dev

```json
{
  "drizzle-kit": "latest"
}
```

---

## 21. Environment Variables

```env
# Auth
TAILOR_PIN=change-this-before-deploy
JWT_SECRET=generate-with-crypto-randomBytes-64

# Turso
TURSO_DATABASE_URL=libsql://mensah-[user].turso.io
TURSO_AUTH_TOKEN=

# Cloudinary — cloud name is public and used in the client upload URL
VITE_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Paystack — public key goes to browser, secret stays server only
VITE_PAYSTACK_PUBLIC_KEY=pk_test_
PAYSTACK_SECRET_KEY=sk_test_

# Resend
RESEND_API_KEY=re_
TAILOR_EMAIL=

# App
NODE_ENV=development
```

---

## 22. Code Style and Comment Rules

These rules apply to every file in the codebase.

### 22.1 When to Comment

Comments explain the reason behind a decision, not what the code is doing. They are not used for section headers or descriptions of obvious logic.

Wrong:
```js
// Get all published listings
const result = await db.select().from(listings).where(eq(listings.published, 1))
```

Right:
```js
// Filtered to published only here because the guest endpoint should never
// expose drafts even if someone hits the URL directly
const result = await db.select().from(listings).where(eq(listings.published, 1))
```

### 22.2 Comment Voice

K-11 English. No em dashes. Conversational. Past tense where explaining a decision.

```js
// Used timingSafeEqual because regular string comparison leaks timing
// information that could help someone guess the PIN

// Stored fabricUrls as a JSON string in Turso because libSQL does not
// support native array column types

// Loaded Paystack from CDN instead of npm because the inline popup
// requires their proprietary script to be in the global scope
```

### 22.3 Spacing

Logical blocks of code are separated by a blank line. Related lines stay together. Long chains break onto separate lines. Code is readable without needing comments to navigate it.

---

## 23. README Requirements

A README.md must be created in the project root. Voice is K-11 English, no em dashes, no emojis, conversational, and clear. Instructions use the imperative. Explanations use past tense where appropriate.

### 23.1 Sections Required

**Project overview** — what Mensah is and who it is for, in 3 to 4 sentences.

**Tech stack** — a list of each tool with one sentence on what it does and why it was chosen.

**Prerequisites** — Node.js version, Turso CLI, Cloudinary account, Paystack account, Resend account, Vercel CLI. Each with a link to sign up or install.

**Local setup** — numbered steps:
1. Clone the repo
2. Install dependencies with npm install
3. Copy .env.example to .env.local and fill in all values
4. Set up Turso: turso auth login, turso db create mensah, get the URL and token
5. Run drizzle-kit push to create the database tables
6. Run npm run dev for the frontend (port 5173)
7. Run vercel dev to run the API serverless functions locally

**Environment variables guide** — each variable, what it is, where to get it, whether it is sent to the browser.

**Codebase structure** — the folder tree with one line per folder explaining what it contains.

**How to add a new garment type** — numbered steps: add the .glb file, add the entry to garmentConfig.json, add the ID to the Zod enum in api/index.js, add the label to GarmentSelector.jsx.

**Deploying to Vercel** — numbered steps: push to GitHub, import repo in the Vercel dashboard, add all environment variables in Project Settings, deploy.

**Updating the database schema** — run drizzle-kit push with the production Turso URL.

**Known limitations** — Vercel hobby function timeout of 10 to 15 seconds, Cloudinary free tier at 25GB, Turso free tier at 9GB, Resend free tier at 3,000 emails per month.

---

## 24. Out of Scope for MVP

- Multi-tailor accounts
- AI virtual try-on
- Parametric 3D model resizing based on entered measurements
- Real-time WebSocket notifications
- Native mobile app
- Garment cloth physics or movement animation
- Customer account creation

---

## 25. Deliverable Checklist

- [ ] .gitignore is the first file created — .env.local is not in git
- [ ] .env.example committed with all variable names and no real values
- [ ] vercel.json routes /api/* correctly to api/index.js
- [ ] All 25 garment types have working .glb models loaded
- [ ] Fabric texture applies and swaps correctly on all 25 models
- [ ] Fabric tint picker works — hue shifts on the mesh, reset restores original
- [ ] Photo mode gallery works — crossfade on thumbnail click, lightbox on primary click
- [ ] Listing card shows 3D or photo badge correctly
- [ ] Hero sequence plays in full: sewing, screen split, garment rise, listings reveal
- [ ] Skip button works and sessionStorage prevents replay in same session
- [ ] Framer Motion: page transitions, card stagger, order drawer slide, QR modal, login shake, tile select, status tag flip, swatch crossfade
- [ ] QR code generates and downloads as PNG
- [ ] OG meta tags set dynamically per listing page
- [ ] PWA manifest is valid and app is installable from mobile browser
- [ ] Cloudinary signed upload works — files go from browser direct to Cloudinary
- [ ] Helmet registered as first middleware
- [ ] Rate limiting applied per route group
- [ ] PIN comparison uses timingSafeEqual
- [ ] JWT stored in HttpOnly cookie
- [ ] Zod validation on all POST and PUT routes
- [ ] CORS locked to known origins with credentials enabled
- [ ] Turso connected — both tables exist and all queries work
- [ ] Tailor can log in, create a 3D listing, create a photo listing, and see both in guest view
- [ ] Guest can browse, view in 3D with swatch switching and tint, and view in photo mode
- [ ] Guest can share a listing and it unfurls on WhatsApp with the fabric image
- [ ] Guest can place a paid order through Paystack
- [ ] Paystack reference verified server-side before order is saved
- [ ] Resend email fires to tailor on confirmed order
- [ ] Guest can track their order at /order/:ref
- [ ] Tailor can update order status from dashboard, status tag animates on change
- [ ] No box-shadow anywhere in CSS
- [ ] Production error handler returns generic messages only — no stack traces to client
- [ ] Comments follow K-11 English, past tense, conversational, no em dashes, no unnecessary ones
- [ ] README covers all sections in Section 23
- [ ] App deploys to Vercel with zero build errors
