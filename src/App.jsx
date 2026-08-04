import React, { useState } from 'react';
import { Glasses, LogOut, User, Sparkles, AlertCircle, CheckCircle, Info, ShoppingBag, Package, Shield } from 'lucide-react';
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
import { AdminDashboard } from './components/AdminDashboard';
import { TermsModal } from './components/TermsModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { CartModal } from './components/CartModal';
import { OrdersModal } from './components/OrdersModal';

const AppContent = () => {
  const { currentScreen, navigateTo, currentUser, logoutUser, toasts, cartCount } = useAuth();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'ADMINISTRATOR');

  return (
    <div className="app-container">
      {/* Background Animated Ambient Lights */}
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>

      {/* Top Header (Shown on store screens, hidden on Splash & Admin Panel) */}
      {currentScreen !== 'splash' && currentScreen !== 'admin' && (
        <header className="brand-header">
          <div className="header-logo-container" onClick={() => navigateTo(currentUser ? 'dashboard' : 'login')}>
            <div className="brand-icon-box">
              <Glasses size={24} />
            </div>
            <div>
              <div className="brand-title">OPTINOVA</div>
              <div className="brand-subtitle">Premium Eyewear Store</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Navigation links for Dashboard or Admin Panel */}
            {(currentScreen === 'dashboard' || currentScreen === 'admin') && (
              <>
                {/* Admin Panel Dedicated Link */}
                {isAdmin && (
                  <button 
                    className="header-cart-btn" 
                    onClick={() => navigateTo(currentScreen === 'admin' ? 'dashboard' : 'admin')}
                    title="Admin Control Panel"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.45rem', 
                      padding: '0.4rem 0.85rem',
                      background: currentScreen === 'admin' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid var(--border-accent)',
                      color: 'var(--primary-gold)'
                    }}
                  >
                    <Shield size={18} color="#D4AF37" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                      {currentScreen === 'admin' ? 'Store Front' : 'Admin Panel'}
                    </span>
                  </button>
                )}

                {/* My Orders Button */}
                {currentUser && currentScreen === 'dashboard' && (
                  <button 
                    className="header-cart-btn" 
                    onClick={() => setIsOrdersOpen(true)}
                    title="My Orders"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}
                  >
                    <Package size={18} color="#34D399" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>My Orders</span>
                  </button>
                )}

                {/* Header Shopping Cart Button with Dynamic Badge */}
                {currentScreen === 'dashboard' && (
                  <button 
                    className="header-cart-btn" 
                    onClick={() => setIsCartOpen(true)}
                    title="Shopping Cart"
                  >
                    <ShoppingBag size={20} />
                    {cartCount > 0 && (
                      <span className="cart-badge-count">{cartCount}</span>
                    )}
                  </button>
                )}

                {currentUser && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--border-accent)', padding: '0.4rem 0.85rem', borderRadius: 9999 }}>
                      <User size={16} color="#D4AF37" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>{currentUser.firstName}</span>
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
                )}
              </>
            )}
          </div>
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
        {currentScreen === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <VirtualTryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOpenOrders={() => setIsOrdersOpen(true)} />
      <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />

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
