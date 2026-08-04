import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OTPVerificationScreen = () => {
  const { navigateTo, otpContext, verifyOtp, initiateRegistration, initiateForgotPassword, addToast } = useAuth();
  
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef([]);

  // Countdown timer for Resend OTP (30 sec)
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // Focus first digit on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);
    setErrorMsg('');

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs.current[5].focus();
      setErrorMsg('');
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg('');

    if (otpContext.draftData && otpContext.mode === 'register') {
      await initiateRegistration(otpContext.draftData);
    } else if (otpContext.target && otpContext.mode === 'forgot_password') {
      await initiateForgotPassword(otpContext.target);
    } else {
      addToast(`New OTP email requested for ${otpContext.target}!`, 'info');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    const result = await verifyOtp(enteredOtp);
    setIsVerifying(false);

    if (!result.success) {
      setErrorMsg(result.message || 'Invalid OTP code. Please check your email and try again.');
    }
  };

  return (
    <div className="glass-card otp-container">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo(otpContext.mode === 'forgot_password' ? 'forgot_password' : 'register')} 
          className="close-btn"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="otp-icon-badge">
        <KeyRound size={32} />
      </div>

      <h2 className="form-title">Verify OTP</h2>
      <p className="form-subtitle" style={{ marginBottom: '1rem' }}>
        We sent a 6-digit code to verify your account
      </p>

      <div className="otp-target-info">
        <strong>{otpContext.target || 'user@optinova.com'}</strong>
      </div>

      <form onSubmit={handleVerify}>
        <div className="otp-inputs-wrapper" onPaste={handlePaste}>
          {otpDigits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="otp-box"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              id={`otp-box-${idx}`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="error-text" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="otp-timer-text">
          {timer > 0 ? (
            <span>Resend OTP in <strong>{timer}s</strong></span>
          ) : (
            <button 
              type="button" 
              className="resend-btn"
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              <RefreshCw size={13} style={{ display: 'inline', marginRight: 4 }} />
              Resend OTP
            </button>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={isVerifying}>
          <ShieldCheck size={18} />
          {isVerifying ? 'VERIFYING...' : 'VERIFY OTP'}
        </button>
      </form>
    </div>
  );
};
