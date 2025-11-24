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
    // 입력 검증
    if (!email || !nickname || !password) {
        setError('모든 필드를 입력해주세요.');
        return;
    }

    if (!email.includes('@')) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return;
    }

    try {
        // 백엔드로 회원가입 API 요청
        await axios.post('http://localhost:8080/api/v1/auth/signup', {
            email,
            nickname,
            password
        });

        alert('회원가입이 완료되었습니다! 로그인해주세요.');
        navigate('/');
    } catch (err) {
        // 백엔드에서 오류 메시지가 있을 때 표시
        if (err.response && err.response.data) {
        setError(err.response.data.message || '회원가입 중 오류가 발생했습니다.');
        } else {
        setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
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
          <h1 className="title">생산성 앱</h1>
          <p className="subtitle">
            지금 바로 시작하세요
          </p>
        </div>

        <div className="signup-card">
          <div className="card-header">
            <h2 className="card-title">회원가입</h2>
            <p className="card-description">
              새 계정을 만들어 생산성을 높여보세요
            </p>
          </div>

          <div className="card-content">
            {error && <div className="error-message">{error}</div>}

            <div className="signup-form">
              <div className="form-group">
                <label htmlFor="email">이메일</label>
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
                <label htmlFor="nickname">닉네임</label>
                <div className="input-wrapper">
                  <User className="input-icon" />
                  <input
                    id="nickname"
                    type="text"
                    placeholder="홍길동"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">비밀번호</label>
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
                회원가입
              </button>
            </div>

            <div className="switch-page">
              <p className="switch-text">
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={() => navigate('/')}
                  className="switch-link"
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>

        <p className="signup-page-footer">
          안전하고 생산적인 작업 환경을 위해 보안을 유지하세요
        </p>
      </div>
    </div>
  );
}