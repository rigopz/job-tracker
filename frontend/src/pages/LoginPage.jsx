import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/auth/login', { email, password });
            login(res.data, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #0a0a0f;
        }

        /* LEFT PANEL */
        .auth-left {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          background: #0d0d14;
          overflow: hidden;
        }

        .auth-left::before {
          content: '';
          position: absolute;
          top: -120px;
          left: -120px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.85) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-left::after {
          content: '';
          position: absolute;
          bottom: -80px;
          right: -80px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(236,72,153,0.85) 10%, transparent 70%);
          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          z-index: 1;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .left-content {
          z-index: 1;
        }

        .left-tagline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin-bottom: 1.2rem;
          padding-bottom: 0.1em;
        }

        .left-tagline span {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          padding-bottom: 0.05em;
        }

        .left-desc {
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.7;
          max-width: 320px;
        }

        /* RIGHT PANEL */
        .auth-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          background: #0a0a0f;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.4rem;
          letter-spacing: -0.01em;
        }

        .auth-subtitle {
          color: #4b5563;
          font-size: 0.9rem;
          margin-bottom: 2rem;
        }

        .auth-subtitle a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-subtitle a:hover { text-decoration: underline; }

        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #f87171;
          font-size: 0.875rem;
          margin-bottom: 1.2rem;
        }

        .field {
          margin-bottom: 1.2rem;
        }

        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #9ca3af;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .field input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #111118;
          border: 1px solid #1f2937;
          border-radius: 10px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .field input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .field input::placeholder { color: #374151; }

        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          margin-top: 0.5rem;
          letter-spacing: 0.01em;
          line-height: 1.5;
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #1f2937;
        }

        .divider-text {
          color: #374151;
          font-size: 0.8rem;
        }

        .register-link {
          text-align: center;
          color: #4b5563;
          font-size: 0.875rem;
        }

        .register-link a {
          color: #6366f1;
          text-decoration: none;
          font-weight: 500;
        }

        .register-link a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-left { display: none; }
        }
      `}</style>

            <div className="auth-root">
                {/* Left Panel */}
                <div className="auth-left">
                    <div className="brand">
                        <div className="brand-icon">📋</div>
                        <span className="brand-name">JobTracker</span>
                    </div>

                    <div className="left-content">
                        <h1 className="left-tagline">
                            Track every
                            <br />
                            <span>opportunity.</span>
                            <br />
                            Miss nothing.
                        </h1>
                        <p className="left-desc">
                            Keep all your job applications organized in one
                            place. Monitor status, add notes, and land your next
                            role faster.
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="auth-right">
                    <div className="auth-card">
                        <h2 className="auth-title">Welcome back</h2>
                        <p className="auth-subtitle">
                            No account?{' '}
                            <Link to="/register">Create one free</Link>
                        </p>

                        {error && <div className="error-box">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <button
                                className="submit-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Sign in →'}
                            </button>
                        </form>

                        <div className="divider">
                            <div className="divider-line" />
                            <span className="divider-text">or</span>
                            <div className="divider-line" />
                        </div>

                        <p className="register-link">
                            New here?{' '}
                            <Link to="/register">Create your account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
