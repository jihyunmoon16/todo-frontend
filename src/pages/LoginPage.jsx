import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Input validation
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      // Backend Login API call
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error('Login failed.');
      }

      const data = await response.json();

      // Store token and user info in Redux
      dispatch(setCredentials({
        token: data.token, // or data.accessToken
        user: {
          email: email,
          nickname: data.nickname || data.name
        }
      }));

      // Navigate to Todo page
      navigate('/todo');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-content">
        <div className="login-page-header">
          <div className="login-page-icon">
            <div className="icon-wrapper">
              <span className="icon-emoji">⏰</span>
            </div>
          </div>
          <h1 className="title">Productivity App</h1>
          <p className="subtitle">
            Focus with the Pomodoro technique and manage your tasks
          </p>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Login</h2>
            <p className="card-description">
              Log in to your account to boost your productivity
            </p>
          </div>

          <div className="card-content">
            {error && <div className="error-message">{error}</div>}

            <div className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                  />
                </div>
              </div>

              <button onClick={handleLogin} className="submit-button">
                Login
              </button>
            </div>

            <div className="switch-page">
              <p className="switch-text">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="switch-link"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="login-page-footer">
          Maintain security for a safe and productive work environment
        </p>
      </div>
    </div>
  );
}