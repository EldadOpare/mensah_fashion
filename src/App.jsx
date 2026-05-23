import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MensahLoader from './components/ui/MensahLoader'

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
  const [routeLoading, setRouteLoading] = useState(true)

  useEffect(() => {
    setRouteLoading(true)
    const t = setTimeout(() => {
      setRouteLoading(false)
    }, 1500) // Premium brand transition timing
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <Suspense fallback={<MensahLoader />}>
      <AnimatePresence mode="wait">
        {routeLoading && <MensahLoader key="route-loader" />}
      </AnimatePresence>
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
