import { Link } from 'react-router-dom'
import CampaignCard from './CampaignCard'

export default function CampaignFeed({ campaigns }) {
  if (!campaigns?.length) return null

  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 var(--space-6) var(--space-7)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
        <div>
          <p className="label" style={{ marginBottom: 'var(--space-2)' }}>Featured Drops</p>
          <h2 style={{ fontFamily: 'var(--font-editorial)', fontSize: 'var(--text-xl)', fontWeight: 400 }}>
            Campaigns
          </h2>
        </div>
        <Link
          to="/campaigns"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textDecoration: 'none', letterSpacing: '0.04em' }}
        >
          View all →
        </Link>
      </div>

      {/* Horizontal scroll row */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-5)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-3)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {campaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      <style>{`
        section > div:last-child::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
