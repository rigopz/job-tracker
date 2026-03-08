import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from '../api/axios'
import Navbar from '../components/Navbar'
import StatsRow from '../components/StatsRow'
import JobCard from '../components/JobCard'
import JobForm from '../components/JobForm'

const STATUSES = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Ghosted']

function Dashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchJobs()
  }, [token])

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/jobs', authHeaders)
      setJobs(res.data)
    } catch {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (form) => {
    try {
      const res = await axios.post('/jobs', form, authHeaders)
      setJobs([res.data, ...jobs])
      setShowForm(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = async (form) => {
    try {
      const res = await axios.put(`/jobs/${editingJob._id}`, form, authHeaders)
      setJobs(jobs.map((j) => (j._id === editingJob._id ? res.data : j)))
      setEditingJob(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return
    try {
      await axios.delete(`/jobs/${id}`, authHeaders)
      setJobs(jobs.filter((j) => j._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const openEdit = (job) => {
    setEditingJob(job)
    setShowForm(false)
  }

  const filtered = jobs
    .filter((j) => statusFilter === 'All' || j.status === statusFilter)
    .filter((j) =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #080810;
          color: #e5e7eb;
          min-height: 100vh;
        }

        /* NAVBAR */
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: #0d0d18;
          border-bottom: 1px solid #1a1a2e;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .navbar-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
        }

        .navbar-name {
          font-weight: 700;
          font-size: 1rem;
          color: #fff;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .navbar-user {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .logout-btn {
          padding: 0.4rem 1rem;
          background: transparent;
          border: 1px solid #1f2937;
          border-radius: 8px;
          color: #9ca3af;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          border-color: #f87171;
          color: #f87171;
        }

        /* MAIN LAYOUT */
        .dashboard-main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .dashboard-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
        }

        .dashboard-subtitle {
          font-size: 0.875rem;
          color: #4b5563;
          margin-top: 0.2rem;
        }

        .btn-add {
          padding: 0.65rem 1.4rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }

        .btn-add:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* STATS */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: #0d0d18;
          border: 1px solid #1a1a2e;
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          transition: border-color 0.2s;
        }

        .stat-card:hover { border-color: #2d2d4e; }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* CONTROLS */
        .controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 0.65rem 1rem;
          background: #0d0d18;
          border: 1px solid #1a1a2e;
          border-radius: 10px;
          color: #e5e7eb;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus { border-color: #6366f1; }
        .search-input::placeholder { color: #374151; }

        .filter-select {
          padding: 0.65rem 1rem;
          background: #0d0d18;
          border: 1px solid #1a1a2e;
          border-radius: 10px;
          color: #e5e7eb;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .filter-select:focus { border-color: #6366f1; }

        /* JOB GRID */
        .job-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }

        .job-card {
          background: #0d0d18;
          border: 1px solid #1a1a2e;
          border-radius: 14px;
          padding: 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          transition: border-color 0.2s, transform 0.15s;
          animation: fadeUp 0.3s ease forwards;
        }

        .job-card:hover {
          border-color: #2d2d4e;
          transform: translateY(-2px);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .job-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .job-company {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }

        .job-role {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.2rem;
        }

        .job-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.8rem;
          color: #4b5563;
        }

        .job-notes {
          font-size: 0.825rem;
          color: #6b7280;
          line-height: 1.6;
          background: #111120;
          padding: 0.6rem 0.8rem;
          border-radius: 8px;
          border-left: 2px solid #1f2937;
        }

        .job-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.5rem;
          border-top: 1px solid #111120;
        }

        .btn-link {
          font-size: 0.8rem;
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }

        .btn-link:hover { text-decoration: underline; }

        .job-btns {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-delete {
          padding: 0.3rem 0.8rem;
          border-radius: 7px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }

        .btn-edit {
          background: rgba(99,102,241,0.12);
          color: #818cf8;
        }

        .btn-delete {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }

        .btn-edit:hover, .btn-delete:hover { opacity: 0.75; }

        /* EMPTY STATE */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #374151;
        }

        .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
        .empty-title { font-size: 1.1rem; font-weight: 600; color: #4b5563; margin-bottom: 0.5rem; }
        .empty-desc { font-size: 0.875rem; }

        /* LOADING */
        .loading {
          text-align: center;
          padding: 4rem;
          color: #374151;
          font-size: 0.9rem;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: #0d0d18;
          border: 1px solid #1a1a2e;
          border-radius: 16px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 1.5rem;
          animation: fadeUp 0.2s ease forwards;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
        }

        .modal-close {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .modal-close:hover { color: #fff; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .job-form .field { display: flex; flex-direction: column; gap: 0.4rem; }

        .job-form label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .job-form input,
        .job-form select,
        .job-form textarea {
          padding: 0.65rem 0.9rem;
          background: #111120;
          border: 1px solid #1f2937;
          border-radius: 9px;
          color: #e5e7eb;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }

        .job-form input:focus,
        .job-form select:focus,
        .job-form textarea:focus { border-color: #6366f1; }

        .job-form textarea { resize: vertical; }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.2rem;
        }

        .btn-cancel {
          padding: 0.65rem 1.2rem;
          background: transparent;
          border: 1px solid #1f2937;
          border-radius: 9px;
          color: #9ca3af;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover { border-color: #374151; color: #e5e7eb; }

        .btn-submit {
          padding: 0.65rem 1.4rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 9px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-submit:hover { opacity: 0.9; }

        @media (max-width: 640px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .form-grid { grid-template-columns: 1fr; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>

      <Navbar />

      <main className='dashboard-main'>
        <div className='dashboard-header'>
          <div>
            <h1 className='dashboard-title'>My Applications</h1>
            <p className='dashboard-subtitle'>
              {jobs.length === 0 ? 'No applications yet' : `${jobs.length} application${jobs.length !== 1 ? 's' : ''} tracked`}
            </p>
          </div>
          <button className='btn-add' onClick={() => { setShowForm(true); setEditingJob(null) }}>
            + Add Job
          </button>
        </div>

        <StatsRow jobs={jobs} />

        <div className='controls'>
          <input
            className='search-input'
            placeholder='Search by company or role...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className='filter-select'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className='loading'>Loading your applications...</div>
        ) : filtered.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-icon'>📭</div>
            <p className='empty-title'>{jobs.length === 0 ? 'No applications yet' : 'No results found'}</p>
            <p className='empty-desc'>
              {jobs.length === 0 ? 'Click "+ Add Job" to track your first application' : 'Try a different search or filter'}
            </p>
          </div>
        ) : (
          <div className='job-grid'>
            {filtered.map((job) => (
              <JobCard key={job._id} job={job} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <JobForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingJob && (
        <JobForm
          initial={editingJob}
          onSubmit={handleEdit}
          onCancel={() => setEditingJob(null)}
        />
      )}
    </>
  )
}

export default Dashboard
