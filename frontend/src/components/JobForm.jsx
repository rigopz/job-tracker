import { useState, useEffect } from 'react'

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Ghosted']

const empty = {
  company: '',
  role: '',
  status: 'Applied',
  location: '',
  jobUrl: '',
  salary: '',
  notes: '',
  appliedDate: new Date().toISOString().split('T')[0],
}

function JobForm({ onSubmit, onCancel, initial }) {
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        appliedDate: initial.appliedDate
          ? new Date(initial.appliedDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      })
    } else {
      setForm(empty)
    }
  }, [initial])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-header'>
          <h2 className='modal-title'>{initial ? 'Edit Job' : 'Add Job'}</h2>
          <button className='modal-close' onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className='job-form'>
          <div className='form-grid'>
            <div className='field'>
              <label>Company *</label>
              <input name='company' value={form.company} onChange={handleChange} required placeholder='e.g. Google' />
            </div>
            <div className='field'>
              <label>Role *</label>
              <input name='role' value={form.role} onChange={handleChange} required placeholder='e.g. Software Engineer' />
            </div>
            <div className='field'>
              <label>Status</label>
              <select name='status' value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className='field'>
              <label>Location</label>
              <input name='location' value={form.location} onChange={handleChange} placeholder='e.g. Remote' />
            </div>
            <div className='field'>
              <label>Job URL</label>
              <input name='jobUrl' value={form.jobUrl} onChange={handleChange} placeholder='https://...' />
            </div>
            <div className='field'>
              <label>Salary</label>
              <input name='salary' value={form.salary} onChange={handleChange} placeholder='e.g. $80,000' />
            </div>
            <div className='field'>
              <label>Date Applied</label>
              <input type='date' name='appliedDate' value={form.appliedDate} onChange={handleChange} />
            </div>
          </div>
          <div className='field'>
            <label>Notes</label>
            <textarea name='notes' value={form.notes} onChange={handleChange} placeholder='Recruiter name, interview notes...' rows={3} />
          </div>

          <div className='form-actions'>
            <button type='button' className='btn-cancel' onClick={onCancel}>Cancel</button>
            <button type='submit' className='btn-submit'>{initial ? 'Save Changes' : 'Add Job'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobForm
