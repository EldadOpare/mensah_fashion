import { motion, AnimatePresence } from 'framer-motion'

const statusMap = {
  received:    { label: 'Received',    class: 'status-received' },
  cut:         { label: 'Cut',         class: 'status-cut' },
  in_progress: { label: 'In Progress', class: 'status-in-progress' },
  ready:       { label: 'Ready',       class: 'status-ready' },
  delivered:   { label: 'Delivered',   class: 'status-delivered' },
}

export default function StatusTag({ status }) {
  const current = statusMap[status] || statusMap.received

  return (
    <div style={{ perspective: '400px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`status-tag ${current.class}`}
        >
          {current.label}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
