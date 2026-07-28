import React, { useState } from 'react';
import { Glasses, LogOut, User, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { OTPVerificationScreen } from './components/OTPVerificationScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './components/ResetPasswordScreen';
import { RegSuccessScreen } from './components/RegSuccessScreen';
import { StoreDashboard } from './components/StoreDashboard';
import { TermsModal } from './components/TermsModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';

const AppContent = () => {
  const { currentScreen, navigateTo, currentUser, logoutUser, toasts } = useAuth();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Background Animated Ambient Lights */}
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>

      {/* Top Header (Shown on screens other than Splash) */}
      {currentScreen !== 'splash' && (
        <header className="brand-header">
          <div className="header-logo-container" onClick={() => navigateTo('welcome')}>
            <div className="brand-icon-box">
              <Glasses size={24} />
            </div>
            <div>
              <div className="brand-title">OPTINOVA</div>
              <div className="brand-subtitle">Premium Eyewear Store</div>
            </div>
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--border-accent)', padding: '0.4rem 0.85rem', borderRadius: 9999 }}>
                <User size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>{currentUser.firstName}</span>
                <span style={{ fontSize: '0.7rem', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.2)', padding: '1px 6px', borderRadius: 4 }}>{currentUser.tier}</span>
              </div>
              <button 
                onClick={logoutUser} 
                className="close-btn"
                title="Logout"
                style={{ color: 'var(--accent-rose)' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {currentScreen !== 'login' && (
                <button 
                  className="splash-skip-btn" 
                  style={{ marginTop: 0 }}
                  onClick={() => navigateTo('login')}
                >
                  Login
                </button>
              )}
              {currentScreen !== 'register' && (
                <button 
                  className="splash-skip-btn" 
                  style={{ marginTop: 0, borderColor: 'var(--primary-gold)', color: 'var(--primary-gold)' }}
                  onClick={() => navigateTo('register')}
                >
                  Register
                </button>
              )}
            </div>
          )}
        </header>
      )}

      {/* Screen Content Wrapper */}
      <main className="screen-wrapper">
        {currentScreen === 'splash' && <SplashScreen />}
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'login' && <LoginScreen />}
        {currentScreen === 'register' && <RegistrationScreen onOpenTerms={() => setIsTermsOpen(true)} />}
        {currentScreen === 'otp' && <OTPVerificationScreen />}
        {currentScreen === 'forgot_password' && <ForgotPasswordScreen />}
        {currentScreen === 'reset_password' && <ResetPasswordScreen />}
        {currentScreen === 'reg_success' && <RegSuccessScreen />}
        {currentScreen === 'dashboard' && <StoreDashboard onOpenVirtualTryOn={() => setIsTryOnOpen(true)} />}
      </main>

      {/* Global Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <VirtualTryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} />

      {/* Floating Toast Notification Stack */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={18} color="#34D399" />}
            {toast.type === 'info' && <Info size={18} color="#38BDF8" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#FB7185" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
