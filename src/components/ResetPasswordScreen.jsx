import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordScreen = () => {
  const { completePasswordReset } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});

  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'weak' };
    if (score === 2 || score === 3) return { score: 2, label: 'medium' };
    return { score: 3, label: 'strong' };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!newPassword) {
      errs.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    completePasswordReset();
  };

  return (
    <div className="glass-card">
      <div className="form-header">
        <h2 className="form-title">Reset Password</h2>
        <p className="form-subtitle">Create a new secure password for your account</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* New Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reset-new-password">New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="reset-new-password"
                type={showPass ? 'text' : 'password'}
                className={`form-input ${errors.newPassword ? 'has-error' : ''}`}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors({ ...errors, newPassword: null });
                }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newPassword && (
              <>
                <div className="strength-bar-container">
                  <div className={`strength-step ${strength.score >= 1 ? `active-${strength.label}` : ''}`}></div>
                  <div className={`strength-step ${strength.score >= 2 ? `active-${strength.label}` : ''}`}></div>
                  <div className={`strength-step ${strength.score >= 3 ? `active-${strength.label}` : ''}`}></div>
                </div>
                <div className={`strength-label ${strength.label}`}>
                  Strength: {strength.label}
                </div>
              </>
            )}

            {errors.newPassword && (
              <div className="error-text">
                <AlertCircle size={13} />
                <span>{errors.newPassword}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="reset-confirm-password"
                type={showConfirmPass ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-text">
                <AlertCircle size={13} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <ShieldCheck size={18} />
            RESET PASSWORD
          </button>
        </div>
      </form>
    </div>
  );
};
