const { useState, useEffect, useRef, createContext, useContext } = React;

// --- ICON HELPER COMPONENT (Renders SVG icons cleanly) ---
const Icon = ({ name, size = 20, color = 'currentColor', strokeWidth = 2, style = {} }) => {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [name]);

  return <i data-lucide={name} style={{ width: size, height: size, color, strokeWidth, display: 'inline-block', verticalAlign: 'middle', ...style }}></i>;
};

// --- AUTH CONTEXT & GLOBAL STATE ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  // Screens: 'splash', 'welcome', 'login', 'register', 'otp', 'forgot_password', 'reset_password', 'reg_success', 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [currentUser, setCurrentUser] = useState(null);
  
  const [otpContext, setOtpContext] = useState({
    mode: 'register',
    target: '',
    code: '123456',
    draftData: null
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginUser = (usernameOrEmail, password) => {
    const mockUser = {
      firstName: 'Alex',
      lastName: 'Vance',
      username: usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@optinova.com`,
      phone: '+1 (555) 234-5678',
      tier: 'VIP Gold Member'
    };
    setCurrentUser(mockUser);
    addToast(`Welcome back, ${mockUser.firstName}!`, 'success');
    navigateTo('dashboard');
  };

  const initiateRegistration = (formData) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpContext({
      mode: 'register',
      target: formData.email || formData.mobile,
      code: generatedOtp,
      draftData: formData
    });
    addToast(`OTP Code sent to ${formData.email || formData.mobile}`, 'info');
    navigateTo('otp');
  };

  const initiateForgotPassword = (emailOrUser) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpContext({
      mode: 'forgot_password',
      target: emailOrUser,
      code: generatedOtp,
      draftData: { emailOrUser }
    });
    addToast(`Password recovery OTP sent to ${emailOrUser}`, 'info');
    navigateTo('otp');
  };

  const handleVerifyOtpSuccess = () => {
    if (otpContext.mode === 'register') {
      const newUser = {
        firstName: otpContext.draftData?.firstName || 'Valued',
        lastName: otpContext.draftData?.lastName || 'Member',
        username: otpContext.draftData?.username || 'optinova_user',
        email: otpContext.draftData?.email || 'user@optinova.com',
        phone: otpContext.draftData?.mobile || '+1 (555) 019-2831',
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

  const completePasswordReset = () => {
    addToast('Your password has been reset successfully! Please login.', 'success');
    navigateTo('login');
  };

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

const useAuth = () => useContext(AuthContext);

// --- 1. SPLASH SCREEN ---
const SplashScreen = () => {
  const { navigateTo } = useAuth();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500; // 2.5s duration
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigateTo('welcome'), 200);
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
          <Icon name="glasses" size={64} color="#D4AF37" strokeWidth={1.5} />
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
        Loading... {Math.floor(progress)}%
      </div>

      <button className="splash-skip-btn" onClick={() => navigateTo('welcome')}>
        Skip Intro
      </button>
    </div>
  );
};

// --- 2. WELCOME SCREEN ---
const WelcomeScreen = () => {
  const { navigateTo } = useAuth();

  return (
    <div className="glass-card welcome-container">
      <div className="welcome-badge">
        <Icon name="award" size={14} color="#D4AF37" />
        <span>Luxury Eyewear Store</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div className="brand-icon-box" style={{ width: '64px', height: '64px', borderRadius: '18px' }}>
          <Icon name="glasses" size={36} color="#D4AF37" />
        </div>
      </div>

      <h1 className="welcome-title">OPTINOVA</h1>
      <p className="welcome-subtitle">Premium Eyewear Store & Optics</p>

      <div className="action-stack">
        <button className="btn-primary" onClick={() => navigateTo('login')} id="welcome-login-btn">
          <Icon name="log-in" size={18} />
          Login
        </button>

        <button className="btn-secondary" onClick={() => navigateTo('register')} id="welcome-register-btn">
          <Icon name="user-plus" size={18} />
          Register
        </button>
      </div>

      <div className="welcome-highlights">
        <div className="highlight-box">
          <Icon name="eye" size={20} color="#D4AF37" />
          <div style={{ marginTop: 4 }}>3D Try-On</div>
        </div>
        <div className="highlight-box">
          <Icon name="shield-check" size={20} color="#D4AF37" />
          <div style={{ marginTop: 4 }}>Blue Filter</div>
        </div>
        <div className="highlight-box">
          <Icon name="award" size={20} color="#D4AF37" />
          <div style={{ marginTop: 4 }}>German Lens</div>
        </div>
      </div>
    </div>
  );
};

// --- 3. LOGIN PAGE ---
const LoginScreen = () => {
  const { navigateTo, loginUser, initiateForgotPassword } = useAuth();
  
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.username.trim()) {
      errs.username = 'Username or Email is Required';
    }
    if (!formData.password) {
      errs.password = 'Password is Required';
    } else if (formData.password.length < 6) {
      errs.password = 'Minimum Password Length is 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      loginUser(formData.username, formData.password);
    }
  };

  const handleQuickFillDemo = () => {
    setFormData({
      username: 'alex_optinova',
      password: 'OptiPassword123'
    });
    setErrors({});
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button onClick={() => navigateTo('welcome')} className="close-btn" title="Back to Welcome">
          <Icon name="arrow-left" size={20} />
        </button>
      </div>

      <div className="form-header">
        <h2 className="form-title">Login</h2>
        <p className="form-subtitle">Enter your details to access your account</p>
      </div>

      <div className="demo-bar">
        <span>Test Credentials:</span>
        <button className="demo-fill-btn" type="button" onClick={handleQuickFillDemo}>
          <Icon name="zap" size={12} style={{ marginRight: 4 }} />
          Auto Fill
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Username / Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username / Email</label>
            <div className="input-wrapper">
              <Icon name="user" className="input-icon" size={18} />
              <input
                id="login-username"
                type="text"
                className={`form-input ${errors.username ? 'has-error' : ''}`}
                placeholder="Enter username or email"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errors.username) setErrors({ ...errors, username: null });
                }}
              />
            </div>
            {errors.username && (
              <div className="error-text">
                <Icon name="alert-circle" size={13} />
                <span>{errors.username}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-wrapper">
              <Icon name="lock" className="input-icon" size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
            {errors.password && (
              <div className="error-text">
                <Icon name="alert-circle" size={13} />
                <span>{errors.password}</span>
              </div>
            )}

            <div className="form-footer-link">
              <span 
                className="text-link"
                onClick={() => {
                  const target = formData.username || 'user@optinova.com';
                  initiateForgotPassword(target);
                }}
              >
                Forgot Password?
              </span>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <Icon name="log-in" size={18} />
            LOGIN
          </button>
        </div>
      </form>

      <div className="form-bottom-prompt">
        Don't have an account?{' '}
        <span className="text-link" style={{ fontWeight: 600 }} onClick={() => navigateTo('register')}>
          Create New Account / Register Here
        </span>
      </div>
    </div>
  );
};

// --- 4. REGISTRATION PAGE ---
const RegistrationScreen = ({ onOpenTerms }) => {
  const { navigateTo, initiateRegistration } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    mobile: '',
    gender: 'Male',
    dob: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    pincode: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'weak' };
    if (score === 2 || score === 3) return { score: 2, label: 'medium' };
    return { score: 3, label: 'strong' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};

    if (!formData.firstName.trim()) errs.firstName = 'First Name Required';
    if (!formData.lastName.trim()) errs.lastName = 'Last Name Required';
    if (!formData.username.trim()) errs.username = 'Username Required';

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address Required';
    } else if (!emailRegex.test(formData.email)) {
      errs.email = 'Invalid Email Format (e.g. user@domain.com)';
    }

    // Phone Number validation
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!formData.mobile.trim()) {
      errs.mobile = 'Phone Number Required';
    } else if (!phoneRegex.test(formData.mobile)) {
      errs.mobile = 'Invalid Phone Number (10+ digits required)';
    }

    if (!formData.dob) errs.dob = 'Date of Birth Required';

    // Password & Strength
    if (!formData.password) {
      errs.password = 'Password Required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm Password Required';
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.address.trim()) errs.address = 'Address Required';
    if (!formData.city.trim()) errs.city = 'City Required';
    if (!formData.state.trim()) errs.state = 'State Required';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode Required';

    if (!formData.acceptTerms) {
      errs.acceptTerms = 'You must accept the Terms & Conditions';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      initiateRegistration(formData);
    }
  };

  const handleQuickFillRegDemo = () => {
    setFormData({
      firstName: 'Sophia',
      lastName: 'Chen',
      username: 'sophiachen',
      email: 'sophia.chen@example.com',
      mobile: '+15559876543',
      gender: 'Female',
      dob: '1996-05-14',
      password: 'OptiPassword123!',
      confirmPassword: 'OptiPassword123!',
      address: '742 Luxury Avenue, Suite 100',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      pincode: '10001',
      acceptTerms: true
    });
    setErrors({});
  };

  return (
    <div className="glass-card glass-card-wide">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={() => navigateTo('welcome')} className="close-btn" title="Back">
          <Icon name="arrow-left" size={20} />
        </button>
        <button type="button" onClick={handleQuickFillRegDemo} className="demo-fill-btn">
          Auto Fill Sample Data
        </button>
      </div>

      <div className="form-header">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Fill in your personal details to register</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid form-grid-2col">
          {/* First Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-firstname">First Name *</label>
            <div className="input-wrapper">
              <Icon name="user" className="input-icon" size={18} />
              <input
                id="reg-firstname"
                type="text"
                className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            {errors.firstName && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.firstName}</span></div>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-lastname">Last Name *</label>
            <div className="input-wrapper">
              <Icon name="user" className="input-icon" size={18} />
              <input
                id="reg-lastname"
                type="text"
                className={`form-input ${errors.lastName ? 'has-error' : ''}`}
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            {errors.lastName && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.lastName}</span></div>}
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username *</label>
            <div className="input-wrapper">
              <Icon name="user" className="input-icon" size={18} />
              <input
                id="reg-username"
                type="text"
                className={`form-input ${errors.username ? 'has-error' : ''}`}
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            {errors.username && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.username}</span></div>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address *</label>
            <div className="input-wrapper">
              <Icon name="mail" className="input-icon" size={18} />
              <input
                id="reg-email"
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.email}</span></div>}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-mobile">Mobile Number *</label>
            <div className="input-wrapper">
              <Icon name="phone" className="input-icon" size={18} />
              <input
                id="reg-mobile"
                type="tel"
                className={`form-input ${errors.mobile ? 'has-error' : ''}`}
                placeholder="Phone Number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            {errors.mobile && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.mobile}</span></div>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-gender">Gender</label>
            <div className="input-wrapper">
              <Icon name="user" className="input-icon" size={18} />
              <select
                id="reg-gender"
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-dob">Date of Birth (DOB) *</label>
            <div className="input-wrapper">
              <Icon name="calendar" className="input-icon" size={18} />
              <input
                id="reg-dob"
                type="date"
                className={`form-input ${errors.dob ? 'has-error' : ''}`}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            {errors.dob && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.dob}</span></div>}
          </div>

          <div className="form-group"></div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password *</label>
            <div className="input-wrapper">
              <Icon name="lock" className="input-icon" size={18} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
            {formData.password && (
              <>
                <div className="strength-bar-container">
                  <div className={`strength-step ${passwordStrength.score >= 1 ? `active-${passwordStrength.label}` : ''}`}></div>
                  <div className={`strength-step ${passwordStrength.score >= 2 ? `active-${passwordStrength.label}` : ''}`}></div>
                  <div className={`strength-step ${passwordStrength.score >= 3 ? `active-${passwordStrength.label}` : ''}`}></div>
                </div>
                <div className={`strength-label ${passwordStrength.label}`}>
                  Password Strength: {passwordStrength.label}
                </div>
              </>
            )}
            {errors.password && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.password}</span></div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
            <div className="input-wrapper">
              <Icon name="lock" className="input-icon" size={18} />
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
            {errors.confirmPassword && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.confirmPassword}</span></div>}
          </div>

          {/* Address */}
          <div className="form-group form-group-span-2">
            <label className="form-label" htmlFor="reg-address">Address *</label>
            <div className="input-wrapper">
              <Icon name="map-pin" className="input-icon" size={18} />
              <input
                id="reg-address"
                type="text"
                className={`form-input ${errors.address ? 'has-error' : ''}`}
                placeholder="Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            {errors.address && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.address}</span></div>}
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-city">City *</label>
            <div className="input-wrapper">
              <Icon name="map-pin" className="input-icon" size={18} />
              <input
                id="reg-city"
                type="text"
                className={`form-input ${errors.city ? 'has-error' : ''}`}
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            {errors.city && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.city}</span></div>}
          </div>

          {/* State */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-state">State *</label>
            <div className="input-wrapper">
              <Icon name="map-pin" className="input-icon" size={18} />
              <input
                id="reg-state"
                type="text"
                className={`form-input ${errors.state ? 'has-error' : ''}`}
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            {errors.state && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.state}</span></div>}
          </div>

          {/* Country */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-country">Country *</label>
            <div className="input-wrapper">
              <Icon name="globe" className="input-icon" size={18} />
              <select
                id="reg-country"
                className="form-select"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* Pincode */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-pincode">Pincode *</label>
            <div className="input-wrapper">
              <Icon name="map-pin" className="input-icon" size={18} />
              <input
                id="reg-pincode"
                type="text"
                className={`form-input ${errors.pincode ? 'has-error' : ''}`}
                placeholder="Pincode / ZIP"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
            {errors.pincode && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.pincode}</span></div>}
          </div>

          {/* Accept Terms Checkbox */}
          <div className="form-group form-group-span-2">
            <label className="terms-checkbox-container" htmlFor="reg-terms">
              <div 
                className={`custom-checkbox ${formData.acceptTerms ? 'checked' : ''}`}
                onClick={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
              >
                {formData.acceptTerms && <Icon name="check" size={14} strokeWidth={3} />}
              </div>
              <input 
                type="checkbox" 
                id="reg-terms" 
                style={{ display: 'none' }}
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <div>
                ☐ Accept Terms & Conditions (
                <span className="text-link" onClick={(e) => { e.preventDefault(); onOpenTerms(); }}>
                  View Terms
                </span>
                )
              </div>
            </label>
            {errors.acceptTerms && <div className="error-text"><Icon name="alert-circle" size={13} /><span>{errors.acceptTerms}</span></div>}
          </div>

          {/* Register Button */}
          <div className="form-group form-group-span-2" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary">
              <Icon name="user-plus" size={18} />
              REGISTER
            </button>
          </div>
        </div>
      </form>

      <div className="form-bottom-prompt">
        Already have an account?{' '}
        <span className="text-link" style={{ fontWeight: 600 }} onClick={() => navigateTo('login')}>
          Login Here
        </span>
      </div>
    </div>
  );
};

// --- 5. OTP VERIFICATION PAGE ---
const OTPVerificationScreen = () => {
  const { navigateTo, otpContext, handleVerifyOtpSuccess, addToast } = useAuth();
  
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const inputRefs = useRef([]);

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
      setOtpDigits(pastedData.split(''));
      inputRefs.current[5].focus();
      setErrorMsg('');
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg('');
    addToast(`New OTP code sent!`, 'info');
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Enter all 6 digits of the OTP.');
      return;
    }

    if (enteredOtp === otpContext.code || enteredOtp === '123456') {
      handleVerifyOtpSuccess();
    } else {
      setErrorMsg(`Invalid OTP code! Hint: Use code ${otpContext.code || '123456'}`);
    }
  };

  const handleAutoFillOtp = () => {
    const code = otpContext.code || '123456';
    setOtpDigits(code.split(''));
    setErrorMsg('');
  };

  return (
    <div className="glass-card otp-container">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo(otpContext.mode === 'forgot_password' ? 'forgot_password' : 'register')} 
          className="close-btn"
          title="Back"
        >
          <Icon name="arrow-left" size={20} />
        </button>
      </div>

      <div className="otp-icon-badge">
        <Icon name="key-round" size={32} color="#38BDF8" />
      </div>

      <h2 className="form-title">Verify OTP</h2>
      <p className="form-subtitle" style={{ marginBottom: '1rem' }}>
        Verify Mobile/Email OTP Code
      </p>

      <div className="otp-target-info">
        <strong>{otpContext.target || 'user@optinova.com'}</strong>
      </div>

      <form onSubmit={handleVerify}>
        {/* 6 Digit OTP Input Boxes */}
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
            />
          ))}
        </div>

        {errorMsg && (
          <div className="error-text" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <Icon name="alert-circle" size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="otp-timer-text">
          {timer > 0 ? (
            <span>Resend OTP ({timer} sec)</span>
          ) : (
            <button type="button" className="resend-btn" onClick={handleResendOtp} disabled={!canResend}>
              <Icon name="refresh-cw" size={13} style={{ marginRight: 4 }} />
              Resend OTP (30 sec)
            </button>
          )}
        </div>

        <button type="submit" className="btn-primary">
          <Icon name="shield-check" size={18} />
          VERIFY
        </button>
      </form>

      <div className="simulated-otp-hint" onClick={handleAutoFillOtp} style={{ cursor: 'pointer' }}>
        <span>Test OTP Code: <strong>{otpContext.code || '123456'}</strong> (Click to auto fill)</span>
      </div>
    </div>
  );
};

// --- 6. FORGOT PASSWORD PAGE ---
const ForgotPasswordScreen = () => {
  const { navigateTo, initiateForgotPassword } = useAuth();
  const [emailOrUser, setEmailOrUser] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUser.trim()) {
      setError('Enter Email or Username');
      return;
    }
    initiateForgotPassword(emailOrUser.trim());
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <button onClick={() => navigateTo('login')} className="close-btn" title="Back to Login">
          <Icon name="arrow-left" size={20} />
        </button>
      </div>

      <div className="form-header">
        <h2 className="form-title">Forgot Password</h2>
        <p className="form-subtitle">Recover Account - Enter Email to receive OTP</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="forgot-email">Enter Email</label>
            <div className="input-wrapper">
              <Icon name="mail" className="input-icon" size={18} />
              <input
                id="forgot-email"
                type="text"
                className={`form-input ${error ? 'has-error' : ''}`}
                placeholder="Enter Email or Username"
                value={emailOrUser}
                onChange={(e) => {
                  setEmailOrUser(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
            {error && (
              <div className="error-text">
                <Icon name="alert-circle" size={13} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <Icon name="send" size={18} />
            SEND OTP
          </button>
        </div>
      </form>

      <div className="form-bottom-prompt">
        Remembered password?{' '}
        <span className="text-link" style={{ fontWeight: 600 }} onClick={() => navigateTo('login')}>
          Back to Login
        </span>
      </div>
    </div>
  );
};

// --- 7. RESET PASSWORD PAGE ---
const ResetPasswordScreen = () => {
  const { completePasswordReset } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});

  const getStrength = (pass) => {
    if (!pass) return { score: 0, label: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'weak' };
    if (score === 2 || score === 3) return { score: 2, label: 'medium' };
    return { score: 3, label: 'strong' };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};

    if (!newPassword) {
      errs.newPassword = 'New Password Required';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm Password Required';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    completePasswordReset();
  };

  return (
    <div className="glass-card">
      <div className="form-header">
        <h2 className="form-title">Reset Password</h2>
        <p className="form-subtitle">Create New Password</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="reset-new-password">New Password</label>
            <div className="input-wrapper">
              <Icon name="lock" className="input-icon" size={18} />
              <input
                id="reset-new-password"
                type={showPass ? 'text' : 'password'}
                className={`form-input ${errors.newPassword ? 'has-error' : ''}`}
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors({ ...errors, newPassword: null });
                }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPass(!showPass)}
              >
                <Icon name={showPass ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>

            {newPassword && (
              <>
                <div className="strength-bar-container">
                  <div className={`strength-step ${strength.score >= 1 ? `active-${strength.label}` : ''}`}></div>
                  <div className={`strength-step ${strength.score >= 2 ? `active-${strength.label}` : ''}`}></div>
                  <div className={`strength-step ${strength.score >= 3 ? `active-${strength.label}` : ''}`}></div>
                </div>
                <div className={`strength-label ${strength.label}`}>
                  Strength: {strength.label}
                </div>
              </>
            )}

            {errors.newPassword && (
              <div className="error-text">
                <Icon name="alert-circle" size={13} />
                <span>{errors.newPassword}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reset-confirm-password">Confirm Password</label>
            <div className="input-wrapper">
              <Icon name="lock" className="input-icon" size={18} />
              <input
                id="reset-confirm-password"
                type={showConfirmPass ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Re-enter New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                }}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Icon name={showConfirmPass ? 'eye-off' : 'eye'} size={18} />
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-text">
                <Icon name="alert-circle" size={13} />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            <Icon name="shield-check" size={18} />
            Password Changed
          </button>
        </div>
      </form>
    </div>
  );
};

// --- REGISTRATION SUCCESSFUL SCREEN ---
const RegSuccessScreen = () => {
  const { navigateTo, currentUser } = useAuth();

  useEffect(() => {
    if (window.confetti) {
      try {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#38BDF8', '#FFFFFF', '#34D399']
        });
      } catch (e) {}
    }
  }, []);

  return (
    <div className="glass-card success-container">
      <div className="success-badge-icon">
        <Icon name="check-circle-2" size={48} color="#34D399" />
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#D4AF37', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
        <Icon name="sparkles" size={14} color="#D4AF37" />
        <span>OPTINOVA MEMBER CREATED</span>
      </div>

      <h1 className="welcome-title" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
        Registration Successful
      </h1>

      <p className="welcome-subtitle" style={{ marginBottom: '2rem' }}>
        Your account <strong>{currentUser?.email || 'member'}</strong> is now active.
      </p>

      <button className="btn-primary" onClick={() => navigateTo('dashboard')} id="continue-shopping-btn">
        <Icon name="shopping-bag" size={18} />
        Continue Shopping
        <Icon name="arrow-right" size={16} />
      </button>
    </div>
  );
};

// --- STORE DASHBOARD ---
const StoreDashboard = ({ onOpenVirtualTryOn }) => {
  const { currentUser, addToast } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(2);

  const categories = ['All', 'Sunglasses', 'Prescription', 'Blue-Light', 'Luxury Line'];

  const products = [
    { id: 1, name: 'OptiNova Aviator Titanium Gold', category: 'Sunglasses', price: '$285', badge: 'Bestseller', rating: 4.9, iconColor: '#D4AF37' },
    { id: 2, name: 'Stellar Blue-Light Shield', category: 'Blue-Light', price: '$165', badge: 'Popular', rating: 4.8, iconColor: '#38BDF8' },
    { id: 3, name: 'Monaco Handcrafted Acetate', category: 'Luxury Line', price: '$420', badge: 'Limited Edition', rating: 5.0, iconColor: '#FB7185' },
    { id: 4, name: 'OptiClear HD Prescription', category: 'Prescription', price: '$210', badge: 'Medical Grade', rating: 4.9, iconColor: '#34D399' },
    { id: 5, name: 'Vanguard Polarized Sport', category: 'Sunglasses', price: '$240', badge: 'UV400 Shield', rating: 4.7, iconColor: '#F59E0B' },
    { id: 6, name: 'Lumina Minimalist Rimless', category: 'Prescription', price: '$310', badge: 'Ultralight 8g', rating: 4.9, iconColor: '#A855F7' }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#D4AF37', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            <Icon name="sparkles" size={16} color="#D4AF37" />
            <span>OPTINOVA BOUTIQUE</span>
          </div>

          <h1 className="dashboard-hero-title">
            Welcome, {currentUser?.firstName || 'Member'}
          </h1>
          <p className="dashboard-hero-desc">
            Explore German optics engineering, titanium frames, and anti-glare prescription lenses.
          </p>

          <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem' }} onClick={onOpenVirtualTryOn}>
            <Icon name="camera" size={18} />
            Virtual Try-On
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="brand-icon-box" style={{ width: 100, height: 100, borderRadius: 24 }}>
            <Icon name="glasses" size={54} color="#D4AF37" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div className="category-tabs" style={{ marginBottom: 0 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: 280 }}>
          <Icon name="search" style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-dim)' }} size={18} />
          <input
            type="text"
            className="form-input"
            placeholder="Search eyewear..."
            style={{ paddingLeft: 42 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-box">
              <span className="product-badge">{product.badge}</span>
              <Icon name="glasses" size={80} color={product.iconColor} strokeWidth={1.2} />
            </div>

            <div className="product-category">{product.category}</div>
            <h3 className="product-title">{product.name}</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', color: '#F59E0B', marginBottom: '0.75rem' }}>
              <Icon name="star" size={14} color="#F59E0B" />
              <span>{product.rating} (120+ Reviews)</span>
            </div>

            <div className="product-price-row">
              <div className="product-price">{product.price}</div>
              <button className="add-cart-btn" onClick={() => handleAddToCart(product)}>
                <Icon name="shopping-bag" size={15} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MODALS ---
const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Icon name="file-text" size={22} color="#D4AF37" />
            <h3 className="modal-title">Terms & Conditions</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to <strong>OptiNova Eyewear Store</strong>. By registering an account, you agree to our prescription accuracy standards, privacy policies, and warranty guidelines.
          </p>
          <h4 style={{ color: '#FFF', marginTop: '1rem', marginBottom: '0.4rem' }}>1. Prescription Verification</h4>
          <p style={{ marginBottom: '1rem' }}>All prescription lenses are made to order according to pupil distance PD measurement.</p>
          <h4 style={{ color: '#FFF', marginTop: '1rem', marginBottom: '0.4rem' }}>2. Data Protection</h4>
          <p style={{ marginBottom: '1.5rem' }}>Your mobile number and email are encrypted for OTP verification and order tracking.</p>

          <button className="btn-primary" onClick={onClose}>
            <Icon name="shield-check" size={18} />
            I AGREE
          </button>
        </div>
      </div>
    </div>
  );
};

const VirtualTryOnModal = ({ isOpen, onClose }) => {
  const [selectedFrame, setSelectedFrame] = useState('gold_aviator');
  const [cameraActive, setCameraActive] = useState(false);

  if (!isOpen) return null;

  const frames = [
    { id: 'gold_aviator', name: 'Titanium Gold Aviator', color: '#D4AF37' },
    { id: 'blue_shield', name: 'Stellar Blue Shield', color: '#38BDF8' },
    { id: 'rose_acetate', name: 'Monaco Rose Acetate', color: '#FB7185' },
    { id: 'green_hd', name: 'OptiClear HD Green', color: '#34D399' }
  ];

  const activeColor = frames.find((f) => f.id === selectedFrame)?.color || '#D4AF37';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Icon name="camera" size={22} color="#D4AF37" />
            <h3 className="modal-title">Virtual Try-On Fitting</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div 
          style={{ 
            height: 260, 
            background: 'linear-gradient(180deg, #101625 0%, #080C14 100%)', 
            borderRadius: 16, 
            border: '1px solid var(--border-accent)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1.25rem',
            position: 'relative'
          }}
        >
          {cameraActive ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#34D399', marginBottom: 12 }}>
                ✓ Live Camera Simulation Active
              </div>
              <Icon name="glasses" size={100} color={activeColor} strokeWidth={1.5} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <Icon name="glasses" size={70} color={activeColor} style={{ marginBottom: '0.75rem' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                Simulate 3D frame placement on your face
              </p>
              <button className="btn-primary" style={{ width: 'auto', padding: '0.6rem 1.25rem' }} onClick={() => setCameraActive(true)}>
                <Icon name="camera" size={16} />
                Enable 3D Camera Tracking
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Select Frame Style:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrame(frame.id)}
                style={{
                  padding: '0.65rem',
                  background: selectedFrame === frame.id ? 'rgba(212, 175, 55, 0.15)' : 'var(--bg-surface)',
                  border: `1px solid ${selectedFrame === frame.id ? 'var(--primary-gold)' : 'var(--border-subtle)'}`,
                  borderRadius: 10,
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: frame.color }}></div>
                <span style={{ fontSize: '0.82rem', flex: 1 }}>{frame.name}</span>
                {selectedFrame === frame.id && <Icon name="check" size={14} color="#D4AF37" />}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-secondary" onClick={onClose}>
          Done Fitting
        </button>
      </div>
    </div>
  );
};

// --- MAIN APP CONTAINER ---
const AppContent = () => {
  const { currentScreen, navigateTo, currentUser, logoutUser, toasts } = useAuth();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>

      {currentScreen !== 'splash' && (
        <header className="brand-header">
          <div className="header-logo-container" onClick={() => navigateTo('welcome')}>
            <div className="brand-icon-box">
              <Icon name="glasses" size={24} color="#D4AF37" />
            </div>
            <div>
              <div className="brand-title">OPTINOVA</div>
              <div className="brand-subtitle">Premium Eyewear Store</div>
            </div>
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--border-accent)', padding: '0.4rem 0.85rem', borderRadius: 9999 }}>
                <Icon name="user" size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFF' }}>{currentUser.firstName}</span>
                <span style={{ fontSize: '0.7rem', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.2)', padding: '1px 6px', borderRadius: 4 }}>{currentUser.tier}</span>
              </div>
              <button onClick={logoutUser} className="close-btn" title="Logout" style={{ color: 'var(--accent-rose)' }}>
                <Icon name="log-out" size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {currentScreen !== 'login' && (
                <button className="splash-skip-btn" style={{ marginTop: 0 }} onClick={() => navigateTo('login')}>
                  Login
                </button>
              )}
              {currentScreen !== 'register' && (
                <button className="splash-skip-btn" style={{ marginTop: 0, borderColor: 'var(--primary-gold)', color: 'var(--primary-gold)' }} onClick={() => navigateTo('register')}>
                  Register
                </button>
              )}
            </div>
          )}
        </header>
      )}

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

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <VirtualTryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} />

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <Icon name="check-circle-2" size={18} color="#34D399" />}
            {toast.type === 'info' && <Icon name="info" size={18} color="#38BDF8" />}
            {toast.type === 'error' && <Icon name="alert-circle" size={18} color="#FB7185" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
