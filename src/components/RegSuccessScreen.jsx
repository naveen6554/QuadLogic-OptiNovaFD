import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export const RegSuccessScreen = () => {
  const { navigateTo, currentUser } = useAuth();

  useEffect(() => {
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#38BDF8', '#FFFFFF', '#34D399']
      });
    } catch (e) {
      // fallback if canvas not available
    }
  }, []);

  return (
    <div className="glass-card success-container">
      <div className="success-badge-icon">
        <CheckCircle2 size={48} />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        <Sparkles size={14} />
        <span>WELCOME TO OPTINOVA</span>
      </div>

      <h1 className="welcome-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Registration Successful!
      </h1>

      <p className="welcome-subtitle" style={{ marginBottom: '2rem' }}>
        Your account <strong>{currentUser?.email || 'member'}</strong> has been created and verified. You are now eligible for exclusive VIP optics benefits.
      </p>

      <button 
        className="btn-primary" 
        onClick={() => navigateTo('dashboard')}
        id="continue-shopping-btn"
      >
        <ShoppingBag size={18} />
        CONTINUE SHOPPING
        <ArrowRight size={16} />
      </button>
    </div>
  );
};
