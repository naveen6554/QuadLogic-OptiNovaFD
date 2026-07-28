import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Navigation Screens: 'splash', 'welcome', 'login', 'register', 'otp', 'forgot_password', 'reset_password', 'reg_success', 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);
  
  // Pending verification flow context
  const [otpContext, setOtpContext] = useState({
    mode: 'register', // 'register' or 'forgot_password'
    target: '',
    code: '123456',
    draftData: null
  });
  
  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Helper navigation
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const loginUser = (usernameOrEmail, password) => {
    const mockUser = {
      firstName: 'Alex',
      lastName: 'Vance',
      username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@optinova.com`,
      phone: '+1 (555) 234-5678',
      tier: 'VIP Member'
    };
    setCurrentUser(mockUser);
    addToast(`Welcome back, ${mockUser.firstName}!`, 'success');
    navigateTo('dashboard');
  };

  // Initiate Registration -> Go to OTP
  const initiateRegistration = (formData) => {
    const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpContext({
      mode: 'register',
      target: formData.email || formData.mobile,
      code: sampleOtp,
      draftData: formData
    });
    addToast(`OTP Code sent to ${formData.email || formData.mobile}`, 'info');
    navigateTo('otp');
  };

  // Initiate Forgot Password -> Go to OTP
  const initiateForgotPassword = (emailOrUser) => {
    const sampleOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpContext({
      mode: 'forgot_password',
      target: emailOrUser,
      code: sampleOtp,
      draftData: { emailOrUser }
    });
    addToast(`Password recovery OTP sent to ${emailOrUser}`, 'info');
    navigateTo('otp');
  };

  // Verify OTP Success
  const handleVerifyOtpSuccess = () => {
    if (otpContext.mode === 'register') {
      const newUser = {
        firstName: otpContext.draftData?.firstName || 'Valued',
        lastName: otpContext.draftData?.lastName || 'Customer',
        username: otpContext.draftData?.username || 'optinova_member',
        email: otpContext.draftData?.email || 'user@optinova.com',
        phone: otpContext.draftData?.mobile || '+1 555-0199',
        tier: 'Gold Member'
      };
      setCurrentUser(newUser);
      addToast('Mobile/Email verified successfully!', 'success');
      navigateTo('reg_success');
    } else if (otpContext.mode === 'forgot_password') {
      addToast('Identity verified. Please set a new password.', 'success');
      navigateTo('reset_password');
    }
  };

  // Complete Reset Password
  const completePasswordReset = () => {
    addToast('Your password has been reset successfully! Please login.', 'success');
    navigateTo('login');
  };

  // Logout
  const logoutUser = () => {
    setCurrentUser(null);
    addToast('You have logged out.', 'info');
    navigateTo('welcome');
  };

  return (
    <AuthContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigateTo,
        currentUser,
        loginUser,
        initiateRegistration,
        initiateForgotPassword,
        handleVerifyOtpSuccess,
        completePasswordReset,
        logoutUser,
        otpContext,
        setOtpContext,
        toasts,
        addToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
