function StatsRow({ jobs }) {
  const total = jobs.length
  const active = jobs.filter(
    (j) => !['Rejected', 'Ghosted', 'Accepted'].includes(j.status)
  ).length
  const interviews = jobs.filter((j) => j.status === 'Interview').length
  const offers = jobs.filter((j) => j.status === 'Offer' || j.status === 'Accepted').length

  const stats = [
    { label: 'Total Applied', value: total, color: '#6366f1' },
    { label: 'Active', value: active, color: '#3b82f6' },
    { label: 'Interviews', value: interviews, color: '#f59e0b' },
    { label: 'Offers', value: offers, color: '#10b981' },
  ]

  return (
    <div className='stats-row'>
      {stats.map((stat) => (
        <div className='stat-card' key={stat.label}>
          <span className='stat-value' style={{ color: stat.color }}>
            {stat.value}
          </span>
          <span className='stat-label'>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}

export default StatsRow
