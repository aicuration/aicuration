import React, { useState, useEffect, useRef } from 'react';

const AuthPage = ({ onLogin, onRegister, onGoogleLogin, onBack }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState('');
  const googleButtonRef = useRef(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (authMode === 'register' && !authUsername.trim()) {
      setAuthError('사용자명을 입력해주세요.');
      return;
    }

    const success = authMode === 'login' 
      ? await onLogin(authEmail, authPassword, setAuthError)
      : await onRegister(authEmail, authPassword, authUsername, setAuthError);

    if (success) {
      if (authMode === 'register') {
        // 회원가입 성공 시 로그인 탭으로 전환
        setAuthMode('login');
        setAuthUsername('');
      } else {
        // 로그인 성공 시 폼 초기화
        setAuthEmail('');
        setAuthPassword('');
        setAuthUsername('');
      }
    }
  };

  // Google 로그인 처리
  const handleGoogleLogin = (response) => {
    console.log('🔵 Google 로그인 응답 받음:', response);
    if (response.credential && onGoogleLogin) {
      console.log('✅ ID 토큰 전송 시작...');
      onGoogleLogin(response.credential, setAuthError);
    } else {
      console.error('❌ Google 로그인 응답에 credential이 없습니다:', response);
    }
  };

  // Google Identity Services 초기화
  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
    
    // 디버깅: 클라이언트 ID 확인
    if (!clientId) {
      console.error('⚠️ REACT_APP_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
      console.error('frontend/.env 파일에 REACT_APP_GOOGLE_CLIENT_ID를 추가하고 빌드를 다시 실행하세요.');
      return;
    }
    
    console.log('✅ Google Client ID 로드됨:', clientId.substring(0, 30) + '...');
    
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin',
          width: 280,
        }
      );
    } else {
      // Google 스크립트가 아직 로드되지 않은 경우
      const checkGoogle = setInterval(() => {
        if (window.google && googleButtonRef.current) {
          clearInterval(checkGoogle);
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLogin,
          });
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'signin',
              width: 280,
            }
          );
        }
      }, 100);
      
      // 10초 후 타임아웃
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, []);

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* 탭 전환 */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('login');
              setAuthError('');
              setAuthUsername('');
            }}
          >
            로그인
          </button>
          <button 
            className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setAuthMode('register');
              setAuthError('');
            }}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleAuth} className="auth-form">
          {authMode === 'register' && (
            <input
              type="text"
              placeholder="사용자명"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              className="auth-input"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="이메일"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            className="auth-input"
            required
          />
          
          <input
            type="password"
            placeholder="비밀번호"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            className="auth-input"
            required
          />

          {/* 에러 메시지 */}
          {authError && (
            <div className="error-message">
              {authError}
            </div>
          )}

          {/* 제출 버튼 */}
          <button type="submit" className="submit-button">
            {authMode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="auth-divider">
          <div className="divider-line"></div>
          <span className="divider-text">또는</span>
          <div className="divider-line"></div>
        </div>

        {/* Google 로그인 버튼 */}
        <div className="google-login-container">
          <div ref={googleButtonRef} className="google-button-wrapper"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
