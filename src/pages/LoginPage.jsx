import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import axiosInstance from '../api/axios';
import { FullMoon } from '../components/MoonPhase';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password
      });

      const data = response.data;

      dispatch(setCredentials({
        token: data.token,
        user: {
          email: email,
          nickname: data.nickname || data.name
        }
      }));

      navigate('/todo');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-page">
      {/* Star field decoration */}
      <div className="stars-bg" />

      <div className="auth-container">
        {/* Logo Section */}
        <div className="auth-header">
          <div className="auth-logo">
            <FullMoon size={48} glow />
          </div>
          <h1 className="auth-title">
            <span>PHASE</span>
            <span className="title-icon">
              <FullMoon size={24} />
            </span>
            <span>THE DAY</span>
          </h1>
          <p className="auth-subtitle">
            Focus with the moon's rhythm, accomplish your goals
          </p>
        </div>

        {/* Login Card */}
        <div className="auth-card">
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue your journey</p>
          </div>

          <div className="card-body">
            {error && (
              <div className="auth-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="auth-input"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="auth-switch">
              <span>Don't have an account?</span>
              <button onClick={() => navigate('/signup')}>
                Create account
              </button>
            </div>
          </div>
        </div>

        <p className="auth-footer">
          Your productivity journey awaits under the moonlight
        </p>
      </div>
    </div>
  );
}
