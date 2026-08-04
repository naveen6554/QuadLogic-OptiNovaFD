import React, { useEffect, useState } from 'react';
import { Glasses, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SplashScreen = () => {
  const { navigateTo } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigateTo('login'), 200);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [navigateTo]);

  return (
    <div className="splash-container">
      <div className="splash-logo-wrapper">
        <div className="splash-icon-ring">
          <Glasses size={64} strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="splash-title">OPTINOVA</h1>
      <p className="splash-tagline">See Better. Look Better.</p>

      <div className="splash-progress-bar-container">
        <div 
          className="splash-progress-bar-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="splash-loading-text">
        Loading Experience {Math.floor(progress)}%
      </div>

      <button 
        className="splash-skip-btn"
        onClick={() => navigateTo('login')}
      >
        Skip intro
      </button>
    </div>
  );
};
