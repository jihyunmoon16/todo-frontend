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
    // 입력 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 로그인 API 호출
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
        throw new Error('로그인에 실패했습니다.');
      }

      const data = await response.json();
      
      // Redux에 토큰과 사용자 정보 저장
      dispatch(setCredentials({
        token: data.token, // 또는 data.accessToken
        user: {
          email: email,
          nickname: data.nickname || data.name
        }
      }));

      // Todo 페이지로 이동
      navigate('/todo');
    } catch (error) {
      console.error('Login error:', error);
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
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
          <h1 className="title">생산성 앱</h1>
          <p className="subtitle">
            뽀모도로 기법으로 집중하고, 할 일을 관리하세요
          </p>
        </div>

        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">로그인</h2>
            <p className="card-description">
              계정에 로그인하여 생산성을 높여보세요
            </p>
          </div>

          <div className="card-content">
            {error && <div className="error-message">{error}</div>}

            <div className="login-form">
              <div className="form-group">
                <label htmlFor="email">이메일</label>
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
                <label htmlFor="password">비밀번호</label>
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
                로그인
              </button>
            </div>

            <div className="switch-page">
              <p className="switch-text">
                계정이 없으신가요?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="switch-link"
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="login-page-footer">
          안전하고 생산적인 작업 환경을 위해 보안을 유지하세요
        </p>
      </div>
    </div>
  );
}