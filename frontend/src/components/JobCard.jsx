const STATUS_COLORS = {
  Applied: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8' },
  Screening: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
  Interview: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
  Offer: { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
  Accepted: { bg: 'rgba(16,185,129,0.2)', color: '#10b981' },
  Rejected: { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
  Ghosted: { bg: 'rgba(107,114,128,0.12)', color: '#9ca3af' },
}

function JobCard({ job, onEdit, onDelete }) {
  const statusStyle = STATUS_COLORS[job.status] || STATUS_COLORS['Applied']
  const date = job.appliedDate
    ? new Date(job.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—'

  return (
    <div className='job-card'>
      <div className='job-card-top'>
        <div>
          <h3 className='job-company'>{job.company}</h3>
          <p className='job-role'>{job.role}</p>
        </div>
        <span
          className='job-status'
          style={{ background: statusStyle.bg, color: statusStyle.color }}
        >
          {job.status}
        </span>
      </div>

      <div className='job-meta'>
        {job.location && <span>📍 {job.location}</span>}
        {job.salary && <span>💰 {job.salary}</span>}
        <span>📅 {date}</span>
      </div>

      {job.notes && <p className='job-notes'>{job.notes}</p>}

      <div className='job-actions'>
        {job.jobUrl && (
          <a href={job.jobUrl} target='_blank' rel='noreferrer' className='btn-link'>
            View Job ↗
          </a>
        )}
        <div className='job-btns'>
          <button className='btn-edit' onClick={() => onEdit(job)}>Edit</button>
          <button className='btn-delete' onClick={() => onDelete(job._id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default JobCard
