import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <div className='navbar-icon'>📋</div>
        <span className='navbar-name'>JobTracker</span>
      </div>
      <div className='navbar-right'>
        <span className='navbar-user'>👤 {user?.name || 'User'}</span>
        <button className='logout-btn' onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
