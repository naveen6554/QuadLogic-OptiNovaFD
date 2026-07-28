import React from 'react';
import { Glasses, LogIn, UserPlus, Eye, ShieldCheck, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WelcomeScreen = () => {
  const { navigateTo } = useAuth();

  return (
    <div className="glass-card welcome-container">
      <div className="welcome-badge">
        <Award size={14} />
        <span>Luxury Collection 2026</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div className="brand-icon-box" style={{ width: '60px', height: '60px', borderRadius: '16px' }}>
          <Glasses size={32} />
        </div>
      </div>

      <h1 className="welcome-title">OPTINOVA</h1>
      <p className="welcome-subtitle">See Better. Look Better.
      </p>

      <div className="action-stack">
        <button
          className="btn-primary"
          onClick={() => navigateTo('login')}
          id="welcome-login-btn"
        >
          <LogIn size={18} />
          Login
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigateTo('register')}
          id="welcome-register-btn"
        >
          <UserPlus size={18} />
          Register
        </button>
      </div>

      <div className="welcome-highlights">
        <div className="highlight-box">
          <Eye size={18} />
          <div>Virtual Try-On</div>
        </div>
        <div className="highlight-box">
          <ShieldCheck size={18} />
          <div>Anti-Blue Light</div>
        </div>
        <div className="highlight-box">
          <Award size={18} />
          <div>German Optics</div>
        </div>
      </div>
    </div>
  );
};
