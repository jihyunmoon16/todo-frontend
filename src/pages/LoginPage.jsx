import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return;
    }

    try {
        const response = await axios.post(
        'http://localhost:8080/api/v1/auth/login',
        { email, password }
        );

        // 백엔드에서 JWT 토큰이 온다고 가정
        const { token } = response.data;

        // 토큰 저장 (전역 상태는 나중에 필요하면 리덕스/리코일 등 사용)
        localStorage.setItem('token', token);

        // 로그인 성공 후 이동
        navigate('/todo');
    } catch (err) {
        if (err.response && err.response.data) {
        setError(err.response.data.message || '로그인에 실패했습니다.');
        } else {
        setError('서버와 통신할 수 없습니다.');
        }
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