import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft, Zap, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginScreen = () => {
  const { navigateTo, loginUser, initiateForgotPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) {
      errs.username = 'Username or Email is required';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      loginUser(formData.username, formData.password);
    }
  };

  const handleQuickFillDemo = () => {
    setFormData({
      username: 'alex@optinova.com',
      password: 'OptiPassword123'
    });
    setErrors({});
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button 
          onClick={() => navigateTo('welcome')} 
          className="close-btn"
          title="Back to Welcome"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="form-header">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Please enter your credentials to login</p>
      </div>

      {/* Demo Credentials Quick Fill Bar */}
      <div className="demo-bar">
        <span>Try Demo Account:</span>
        <button className="demo-fill-btn" type="button" onClick={handleQuickFillDemo}>
          <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
          Auto Fill
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Username / Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              Username / Email
            </label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="login-username"
                type="text"
                className={`form-input ${errors.username ? 'has-error' : ''}`}
                placeholder="Enter username or email address"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
              />
            </div>
            {errors.username && (
              <div className="error-text">
                <AlertCircle size={13} />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="error-text">
                <AlertCircle size={13} />
                <span>{errors.password}</span>
              </div>
            )}

            <div className="form-footer-link">
              <span 
                className="text-link"
                onClick={() => {
                  const target = formData.username || 'user@optinova.com';
                  initiateForgotPassword(target);
                }}
              >
                Forgot Password?
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <LogIn size={18} />
            LOGIN
          </button>
        </div>
      </form>

      <div className="form-bottom-prompt">
        Don't have an account?{' '}
        <span className="text-link" style={{ fontWeight: 600 }} onClick={() => navigateTo('register')}>
          Register Here
        </span>
      </div>

      <div className="form-bottom-prompt" style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
        <Shield size={14} color="#D4AF37" style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
        <span>System Administrator? </span>
        <span className="text-link" style={{ color: '#D4AF37', fontWeight: 700 }} onClick={() => navigateTo('admin_login')}>
          Admin Security Portal →
        </span>
      </div>
    </div>
  );
};
