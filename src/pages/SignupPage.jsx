import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Timer } from 'lucide-react';
import './SignupPage.css';

export function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSignup = async () => {
    // Input validation
    if (!email || !nickname || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      // Backend Signup API request
      await axios.post('http://localhost:8080/api/v1/auth/signup', {
        email,
        nickname,
        password
      });

      alert('Sign up successful! Please log in.');
      navigate('/');
    } catch (err) {
      // Display error message from backend if available
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred during sign up.');
      } else {
        setError('Cannot connect to the server. Please try again later.');
      }
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-page-content">
        <div className="signup-page-header">
          <div className="signup-page-icon">
            <div className="icon-wrapper">
              <Timer className="icon" />
            </div>
          </div>
          <h1 className="title">Productivity App</h1>
          <p className="subtitle">
            Get started right now
          </p>
        </div>

        <div className="signup-card">
          <div className="card-header">
            <h2 className="card-title">Sign Up</h2>
            <p className="card-description">
              Create a new account to boost your productivity
            </p>
          </div>

          <div className="card-content">
            {error && <div className="error-message">{error}</div>}

            <div className="signup-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
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
                <label htmlFor="nickname">Nickname</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    id="nickname"
                    type="text"
                    placeholder="John Doe"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
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

              <button onClick={handleSignup} className="submit-button">
                Sign Up
              </button>
            </div>

            <div className="switch-page">
              <p className="switch-text">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/')}
                  className="switch-link"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="signup-page-footer">
          Maintain security for a safe and productive work environment
        </p>
      </div>
    </div>
  );
}