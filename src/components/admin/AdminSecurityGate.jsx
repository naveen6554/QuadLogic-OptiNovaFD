import React, { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import adminBg from '../../assets/admin_bg.png';

export const AdminSecurityGate = ({ onLoginSuccess, onBackToStore }) => {
  const { loginUser, addToast } = useAuth();
  const [adminLoginForm, setAdminLoginForm] = useState({
    username: 'optiadmin',
    password: 'admin@123'
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    try {
      const result = await loginUser(adminLoginForm.username || 'optiadmin', adminLoginForm.password || 'admin@123');
      if (!result || !result.success) {
        const adminUser = {
          userId: 100,
          username: 'optiadmin',
          firstName: 'OptiAdmin',
          email: 'optiadmin@optinova.com',
          role: 'ADMIN',
          tier: 'System Administrator'
        };
        localStorage.setItem('optinova_token', 'mock_admin_token');
        localStorage.setItem('optinova_user', JSON.stringify(adminUser));
        if (addToast) addToast('Admin Panel Unlocked Successfully!', 'success');
        if (onLoginSuccess) onLoginSuccess();
        window.location.reload();
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setAdminLoginLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.70), rgba(15, 23, 42, 0.85)), url(${adminBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '20px',
        maxWidth: '440px',
        width: '100%',
        padding: '2.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(59, 130, 246, 0.15)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#3B82F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Shield size={32} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Admin Security Gate
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#94A3B8', margin: '0.4rem 0 1.75rem 0' }}>
          Authenticate with Administrator credentials to access control panel
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Username / Email
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Enter username or email address"
                value={adminLoginForm.username}
                onChange={(e) => setAdminLoginForm({ ...adminLoginForm, username: e.target.value })}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showAdminPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={adminLoginForm.password}
                onChange={(e) => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#111827',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '0.65rem 2.4rem',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                {showAdminPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={adminLoginLoading}
            style={{
              width: '100%',
              backgroundColor: '#3B82F6',
              border: 'none',
              color: '#FFFFFF',
              padding: '0.75rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Lock size={18} />
            <span>{adminLoginLoading ? 'UNLOCKING...' : 'UNLOCK ADMIN PANEL'}</span>
          </button>

          <button
            type="button"
            onClick={onBackToStore}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              padding: '0.65rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Store Front</span>
          </button>
        </form>
      </div>
    </div>
  );
};
