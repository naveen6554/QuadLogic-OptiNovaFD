import React from 'react';
import { Sparkles, ShoppingBag, Camera, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroBannerImg from '../assets/customer_hero_banner.jpg';

export const CustomerHeroShowcaseScreen = ({ onOpenVirtualTryOn }) => {
  const { currentUser, navigateTo } = useAuth();

  return (
    <div 
      style={{ 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)',
        marginTop: '-2rem',
        marginBottom: '-2rem',
        minHeight: 'calc(100vh - 75px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundImage: `linear-gradient(to right, rgba(7, 10, 18, 0.92) 0%, rgba(7, 10, 18, 0.78) 48%, rgba(7, 10, 18, 0.45) 100%), url(${heroBannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        padding: '5rem 8vw',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ zIndex: 2, maxWidth: '820px' }}>
        {/* Member Catalog Badge */}
        <div 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 10, 
            color: '#D4AF37', 
            fontWeight: 700, 
            fontSize: '0.95rem', 
            background: 'rgba(20, 25, 35, 0.9)', 
            padding: '0.6rem 1.4rem', 
            borderRadius: '999px', 
            border: '1px solid rgba(212, 175, 55, 0.45)',
            backdropFilter: 'blur(16px)',
            width: 'fit-content',
            marginBottom: '1.75rem',
            letterSpacing: '0.5px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
          }}
        >
          <Sparkles size={18} color="#D4AF37" />
          <span>EXCLUSIVE MEMBER COLLECTION (87 Products Available)</span>
        </div>

        {/* Welcome Title */}
        <h1 
          style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '4.5rem', 
            fontWeight: 900, 
            color: '#FFFFFF', 
            margin: '0 0 1.5rem 0',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.95)'
          }}
        >
          Welcome, {currentUser?.firstName || currentUser?.username || 'Naveen10'}
        </h1>

        {/* Subtitle */}
        <p 
          style={{ 
            color: 'rgba(255, 255, 255, 0.94)', 
            fontSize: '1.35rem', 
            lineHeight: '1.65', 
            margin: '0 0 3rem 0',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.95)',
            maxWidth: '720px'
          }}
        >
          Discover OptiNova's signature eyewear collection—crafted with German engineered precision optics, handcrafted Japanese titanium, and custom anti-reflection coatings.
        </p>

        {/* Action CTAs: Shop Now & 3D Virtual Try-On */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            style={{ 
              width: 'auto', 
              padding: '1.25rem 3.2rem', 
              fontSize: '1.2rem', 
              fontWeight: 800, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.85rem',
              background: 'linear-gradient(135deg, #EAB308 0%, #D4AF37 100%)',
              color: '#0F172A',
              border: 'none',
              borderRadius: '16px',
              boxShadow: '0 12px 35px rgba(234, 179, 8, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.25 ease'
            }} 
            onClick={() => navigateTo('dashboard')}
            id="showcase-shop-now-btn"
          >
            <ShoppingBag size={24} />
            <span>Shop Now</span>
            <ArrowRight size={22} />
          </button>

          <button 
            className="btn-secondary" 
            style={{ 
              width: 'auto', 
              padding: '1.25rem 2.6rem', 
              fontSize: '1.15rem',
              fontWeight: 700,
              background: 'rgba(20, 25, 35, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              color: '#FFFFFF',
              borderRadius: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }} 
            onClick={onOpenVirtualTryOn}
          >
            <Camera size={24} color="#D4AF37" />
            <span>3D Virtual Try-On</span>
          </button>
        </div>
      </div>
    </div>
  );
};
