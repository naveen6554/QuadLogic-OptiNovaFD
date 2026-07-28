import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordScreen = () => {
  const { navigateTo, initiateForgotPassword } = useAuth();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUser.trim()) {
      setError('Please enter your email or username');
      return;
    }
    initiateForgotPassword(emailOrUser.trim());
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button onClick={() => navigateTo('login')} className="close-btn" title="Back to Login">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="form-header">
        <h2 className="form-title">Forgot Password</h2>
        <p className="form-subtitle">Enter your registered email address or username to recover your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">
              Registered Email or Username
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="forgot-email"
                type="text"
                className={`form-input ${error ? 'has-error' : ''}`}
                placeholder="name@example.com or username"
                value={emailOrUser}
                onChange={(e) => {
                  setEmailOrUser(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
            {error && (
              <div className="error-text">
                <AlertCircle size={13} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <Send size={18} />
            SEND OTP
          </button>
        </div>
      </form>

      <div className="form-bottom-prompt">
        Remembered your password?{' '}
        <span className="text-link" style={{ fontWeight: 600 }} onClick={() => navigateTo('login')}>
          Back to Login
        </span>
      </div>
    </div>
  );
};
