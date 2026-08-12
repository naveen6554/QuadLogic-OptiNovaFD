import React, { useState } from 'react';
import { Glasses, LogOut, User, Sparkles, AlertCircle, CheckCircle, Info, ShoppingBag, Package, Shield, ChevronDown, Heart } from 'lucide-react';
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
import { WishlistModal } from './components/WishlistModal';
import { CustomerHeroShowcaseScreen } from './components/CustomerHeroShowcaseScreen';

import { AdminSecurityGate } from './components/admin/AdminSecurityGate';

const AppContent = () => {
  const { currentScreen, navigateTo, currentUser, logoutUser, toasts, cartCount, wishlistCount } = useAuth();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isAdmin = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'ADMINISTRATOR');

  return (
    <div className="app-container">
      {/* Background Animated Ambient Lights */}
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>

      {/* Top Header (Shown on store screens, hidden on Splash, Admin Panel & Admin Login) */}
      {currentScreen !== 'splash' && currentScreen !== 'admin' && currentScreen !== 'admin_login' && (
        <header className="brand-header">
          <div className="header-logo-container" onClick={() => navigateTo(currentUser ? 'hero_showcase' : 'login')}>
            <div className="brand-icon-box">
              <Glasses size={24} />
            </div>
            <div>
              <div className="brand-title">OPTINOVA</div>
              <div className="brand-subtitle">Premium Eyewear Store</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Navigation tabs for Showcase vs Catalog */}
            {currentUser && !isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem', marginRight: '0.5rem' }}>
                <button
                  onClick={() => navigateTo('hero_showcase')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: currentScreen === 'hero_showcase' ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                    background: currentScreen === 'hero_showcase' ? 'rgba(212, 175, 55, 0.18)' : 'transparent',
                    color: currentScreen === 'hero_showcase' ? '#D4AF37' : '#94A3B8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => navigateTo('dashboard')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: '1px solid',
                    borderColor: currentScreen === 'dashboard' ? '#D4AF37' : 'rgba(255,255,255,0.15)',
                    background: currentScreen === 'dashboard' ? 'rgba(212, 175, 55, 0.18)' : 'transparent',
                    color: currentScreen === 'dashboard' ? '#D4AF37' : '#94A3B8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Shop
                </button>
              </div>
            )}

            {/* Navigation links for Dashboard or Admin Panel */}
            {(currentScreen === 'dashboard' || currentScreen === 'hero_showcase' || currentScreen === 'admin') && (
              <>
                {/* 1. Header Wishlist Button beside Cart */}
                {(currentScreen === 'dashboard' || currentScreen === 'hero_showcase') && (
                  <button 
                    className="header-cart-btn" 
                    onClick={() => setIsWishlistOpen(true)}
                    title="My Wishlist"
                    style={{ position: 'relative' }}
                  >
                    <Heart size={20} color="#FB7185" fill={wishlistCount > 0 ? '#FB7185' : 'none'} />
                    {wishlistCount > 0 && (
                      <span className="cart-badge-count" style={{ background: '#FB7185' }}>{wishlistCount}</span>
                    )}
                  </button>
                )}

                {/* 2. Header Shopping Cart Button with Dynamic Badge */}
                {(currentScreen === 'dashboard' || currentScreen === 'hero_showcase') && (
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

                {/* Profile Button & Integrated Dropdown Menu containing My Orders & Logout */}
                {currentUser && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        background: 'rgba(212, 175, 55, 0.12)',
                        border: '1px solid var(--border-accent)',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '9999px',
                        color: '#FFF',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <User size={16} color="#D4AF37" />
                      <span>{currentUser.firstName || currentUser.username || 'My Profile'}</span>
                      <ChevronDown 
                        size={14} 
                        color="var(--primary-gold)" 
                        style={{ 
                          transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                          transition: 'transform 0.2s ease' 
                        }} 
                      />
                    </button>

                    {/* Backdrop to close dropdown on click outside */}
                    {isProfileDropdownOpen && (
                      <div 
                        style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                        onClick={() => setIsProfileDropdownOpen(false)} 
                      />
                    )}

                    {/* Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div 
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 'calc(100% + 10px)',
                          width: '230px',
                          background: 'rgba(19, 27, 46, 0.96)',
                          border: '1px solid rgba(212, 175, 55, 0.35)',
                          borderRadius: '12px',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
                          zIndex: 100,
                          padding: '0.5rem 0',
                          overflow: 'hidden'
                        }}
                      >
                        {/* User Header Info */}
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.25rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFF' }}>
                            {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : currentUser.username}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94A3B8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.1rem' }}>
                            {currentUser.email || currentUser.username}
                          </div>
                        </div>

                        {/* 1. My Orders Option */}
                        <button
                          onClick={() => {
                            setIsOrdersOpen(true);
                            setIsProfileDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.65rem 1rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#FFF',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <Package size={17} color="#34D399" />
                          <span>My Orders</span>
                        </button>

                        {/* Admin Control Panel Option */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              navigateTo(currentScreen === 'admin' ? 'dashboard' : 'admin');
                              setIsProfileDropdownOpen(false);
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.65rem 1rem',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--primary-gold)',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <Shield size={17} color="#D4AF37" />
                            <span>{currentScreen === 'admin' ? 'Store Front' : 'Admin Panel'}</span>
                          </button>
                        )}

                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '0.35rem 0' }} />

                        {/* 2. Logout Option */}
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logoutUser();
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.65rem 1rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#FB7185',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(251, 113, 133, 0.12)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <LogOut size={17} color="#FB7185" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
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
        {currentScreen === 'admin_login' && <AdminSecurityGate onLoginSuccess={() => navigateTo('admin')} onBackToStore={() => navigateTo('login')} />}
        {currentScreen === 'register' && <RegistrationScreen onOpenTerms={() => setIsTermsOpen(true)} />}
        {currentScreen === 'otp' && <OTPVerificationScreen />}
        {currentScreen === 'forgot_password' && <ForgotPasswordScreen />}
        {currentScreen === 'reset_password' && <ResetPasswordScreen />}
        {currentScreen === 'reg_success' && <RegSuccessScreen />}
        {currentScreen === 'hero_showcase' && <CustomerHeroShowcaseScreen onOpenVirtualTryOn={() => setIsTryOnOpen(true)} />}
        {currentScreen === 'dashboard' && <StoreDashboard onOpenVirtualTryOn={() => setIsTryOnOpen(true)} />}
        {currentScreen === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <VirtualTryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOpenOrders={() => setIsOrdersOpen(true)} />
      <OrdersModal isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

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
