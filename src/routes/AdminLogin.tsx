import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/useEventStore';
import styles from './AdminLogin.module.css';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const login = useEventStore((state) => state.login);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // 페이지 로드 시 자동 로그인 확인
  React.useEffect(() => {
    const savedCredentials = localStorage.getItem('admin-credentials');
    if (savedCredentials) {
      const { username: savedUser, password: savedPass } = JSON.parse(savedCredentials);
      const success = login(savedUser, savedPass);
      if (success) {
        navigate('/admin/dashboard');
      }
    }
  }, [login, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      // 자동 로그인 체크 시 localStorage에 저장
      if (rememberMe) {
        localStorage.setItem('admin-credentials', JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem('admin-credentials');
      }
      navigate('/admin/dashboard');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>관리자 로그인</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>비밀번호</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              <span>자동 로그인</span>
            </label>
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className={styles.submitButton}>
            로그인
          </button>
          
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate('/')}
          >
            돌아가기
          </button>
        </form>
      </div>
    </div>
  );
};
