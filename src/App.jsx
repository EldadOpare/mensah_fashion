import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

const GuestHome           = lazy(() => import('./pages/GuestHome'))
const GuestViewer         = lazy(() => import('./pages/GuestViewer'))
const CampaignDetail      = lazy(() => import('./pages/CampaignDetail'))
const CampaignsList       = lazy(() => import('./pages/CampaignsList'))
const BasketConfirmation  = lazy(() => import('./pages/BasketConfirmation'))
const TailorLogin         = lazy(() => import('./pages/TailorLogin'))
const TailorDashboard     = lazy(() => import('./pages/TailorDashboard'))
const TailorOrders        = lazy(() => import('./pages/TailorOrders'))
const TailorCampaignCreate = lazy(() => import('./pages/TailorCampaignCreate'))
const TailorInventory     = lazy(() => import('./pages/TailorInventory'))
const TailorAnalytics     = lazy(() => import('./pages/TailorAnalytics'))

export default function App() {
  const location = useLocation()

  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }} />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Guest */}
          <Route path="/"             element={<GuestHome />} />
          <Route path="/listing/:id"  element={<GuestViewer />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/campaigns"    element={<CampaignsList />} />
          <Route path="/basket/:id"   element={<BasketConfirmation />} />

          {/* Legacy redirects */}
          <Route path="/order/:ref"      element={<Navigate to="/" replace />} />
          <Route path="/tailor/create"   element={<Navigate to="/tailor/campaign/create" replace />} />

          {/* Tailor */}
          <Route path="/tailor/login"             element={<TailorLogin />} />
          <Route path="/tailor/dashboard"         element={<TailorDashboard />} />
          <Route path="/tailor/orders"            element={<TailorOrders />} />
          <Route path="/tailor/campaign/create"   element={<TailorCampaignCreate />} />
          <Route path="/tailor/inventory"         element={<TailorInventory />} />
          <Route path="/tailor/analytics"         element={<TailorAnalytics />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}
