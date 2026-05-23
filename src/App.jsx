import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TailorLogin from './pages/TailorLogin'
import TailorDashboard from './pages/TailorDashboard'
import TailorCampaignCreate from './pages/TailorCampaignCreate'
import GuestHome from './pages/GuestHome'
import GuestViewer from './pages/GuestViewer'
import CampaignDetail from './pages/CampaignDetail'
import CampaignsList from './pages/CampaignsList'
import BasketConfirmation from './pages/BasketConfirmation'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Guest */}
        <Route path="/" element={<GuestHome />} />
        <Route path="/listing/:id" element={<GuestViewer />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/campaigns" element={<CampaignsList />} />
        <Route path="/basket/:id" element={<BasketConfirmation />} />

        {/* Legacy redirects */}
        <Route path="/order/:ref" element={<Navigate to="/" replace />} />
        <Route path="/tailor/create" element={<Navigate to="/tailor/campaign/create" replace />} />

        {/* Tailor */}
        <Route path="/tailor/login" element={<TailorLogin />} />
        <Route path="/tailor/dashboard" element={<TailorDashboard />} />
        <Route path="/tailor/campaign/create" element={<TailorCampaignCreate />} />
      </Routes>
    </AnimatePresence>
  )
}
