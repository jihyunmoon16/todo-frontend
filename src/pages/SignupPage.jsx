import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useToast } from '../components/Toast';
import { FullMoon } from '../components/MoonPhase';
import './SignupPage.css';

export function SignupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !nickname || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axiosInstance.post('/auth/signup', {
        email,
        nickname,
        password
      });

      showToast('Account created successfully! Please sign in.', 'success');
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred during sign up.');
      } else {
        setError('Cannot connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
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
            Begin your journey to better productivity
          </p>
        </div>

        {/* Signup Card */}
        <div className="auth-card">
          <div className="card-header">
            <h2>Create Account</h2>
            <p>Join us and start organizing your tasks</p>
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
                <label htmlFor="nickname">Nickname</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="nickname"
                    type="text"
                    placeholder="Your display name"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="auth-input"
                  />
                </div>
              </div>

              <button
                onClick={handleSignup}
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner" />
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="auth-switch">
              <span>Already have an account?</span>
              <button onClick={() => navigate('/')}>
                Sign in
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
