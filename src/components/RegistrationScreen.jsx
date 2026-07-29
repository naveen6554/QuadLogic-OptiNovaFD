import React, { useState } from 'react';
import { 
  User, Mail, Phone, Lock, Calendar, MapPin, Globe, Check, 
  AlertCircle, ArrowLeft, Eye, EyeOff, FileText, UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegistrationScreen = ({ onOpenTerms }) => {
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

  // Password Strength Calculation
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

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.username.trim()) errs.username = 'Username is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errs.email = 'Enter a valid email address (e.g. user@domain.com)';
    }

    // Phone validation (numbers only, 10-14 digits)
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.mobile)) {
      errs.mobile = 'Enter a valid phone number (at least 10 digits)';
    }

    if (!formData.dob) errs.dob = 'Date of birth is required';

    // Password validation
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // Confirm password match
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // Address
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pincode.trim()) errs.pincode = 'Pincode is required';

    // Terms
    if (!formData.acceptTerms) {
      errs.acceptTerms = 'You must accept the Terms & Conditions to register';
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
      mobile: '+1 (555) 987-6543',
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
          <ArrowLeft size={20} />
        </button>
        <button 
          type="button" 
          onClick={handleQuickFillRegDemo} 
          className="demo-fill-btn"
        >
          Quick Fill Sample Data
        </button>
      </div>

      <div className="form-header">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join OptiNova for exclusive luxury eyewear perks</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid form-grid-2col">
          {/* First Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-firstname">First Name *</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="reg-firstname"
                type="text"
                className={`form-input ${errors.firstName ? 'has-error' : ''}`}
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            {errors.firstName && <div className="error-text"><AlertCircle size={13} /><span>{errors.firstName}</span></div>}
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-lastname">Last Name *</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="reg-lastname"
                type="text"
                className={`form-input ${errors.lastName ? 'has-error' : ''}`}
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            {errors.lastName && <div className="error-text"><AlertCircle size={13} /><span>{errors.lastName}</span></div>}
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username *</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                id="reg-username"
                type="text"
                className={`form-input ${errors.username ? 'has-error' : ''}`}
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            {errors.username && <div className="error-text"><AlertCircle size={13} /><span>{errors.username}</span></div>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address *</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="reg-email"
                type="email"
                className={`form-input ${errors.email ? 'has-error' : ''}`}
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <div className="error-text"><AlertCircle size={13} /><span>{errors.email}</span></div>}
          </div>

          {/* Mobile Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-mobile">Mobile Number *</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={18} />
              <input
                id="reg-mobile"
                type="tel"
                className={`form-input ${errors.mobile ? 'has-error' : ''}`}
                placeholder="+1 555-000-0000"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>
            {errors.mobile && <div className="error-text"><AlertCircle size={13} /><span>{errors.mobile}</span></div>}
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-gender">Gender</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
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
            <label className="form-label" htmlFor="reg-dob">Date of Birth *</label>
            <div className="input-wrapper">
              <Calendar className="input-icon" size={18} />
              <input
                id="reg-dob"
                type="date"
                className={`form-input ${errors.dob ? 'has-error' : ''}`}
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            {errors.dob && <div className="error-text"><AlertCircle size={13} /><span>{errors.dob}</span></div>}
          </div>

          {/* Empty spacer for alignment */}
          <div className="form-group"></div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password *</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'has-error' : ''}`}
                placeholder="Create password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  Strength: {passwordStrength.label}
                </div>
              </>
            )}
            {errors.password && <div className="error-text"><AlertCircle size={13} /><span>{errors.password}</span></div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="reg-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-input ${errors.confirmPassword ? 'has-error' : ''}`}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-text"><AlertCircle size={13} /><span>{errors.confirmPassword}</span></div>}
          </div>

          {/* Address Line */}
          <div className="form-group form-group-span-2">
            <label className="form-label" htmlFor="reg-address">Street Address *</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                id="reg-address"
                type="text"
                className={`form-input ${errors.address ? 'has-error' : ''}`}
                placeholder="Building / Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            {errors.address && <div className="error-text"><AlertCircle size={13} /><span>{errors.address}</span></div>}
          </div>

          {/* City */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-city">City *</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                id="reg-city"
                type="text"
                className={`form-input ${errors.city ? 'has-error' : ''}`}
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            {errors.city && <div className="error-text"><AlertCircle size={13} /><span>{errors.city}</span></div>}
          </div>

          {/* State */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-state">State / Province *</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                id="reg-state"
                type="text"
                className={`form-input ${errors.state ? 'has-error' : ''}`}
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            {errors.state && <div className="error-text"><AlertCircle size={13} /><span>{errors.state}</span></div>}
          </div>

          {/* Country */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-country">Country *</label>
            <div className="input-wrapper">
              <Globe className="input-icon" size={18} />
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
            <label className="form-label" htmlFor="reg-pincode">Pincode / ZIP *</label>
            <div className="input-wrapper">
              <MapPin className="input-icon" size={18} />
              <input
                id="reg-pincode"
                type="text"
                className={`form-input ${errors.pincode ? 'has-error' : ''}`}
                placeholder="ZIP Code"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>
            {errors.pincode && <div className="error-text"><AlertCircle size={13} /><span>{errors.pincode}</span></div>}
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="form-group form-group-span-2">
            <label className="terms-checkbox-container" htmlFor="reg-terms">
              <div 
                className={`custom-checkbox ${formData.acceptTerms ? 'checked' : ''}`}
              >
                {formData.acceptTerms && <Check size={14} strokeWidth={3} />}
              </div>
              <input 
                type="checkbox" 
                id="reg-terms" 
                style={{ display: 'none' }}
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <div>
                I accept OptiNova's{' '}
                <span className="text-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenTerms(); }}>
                  Terms of Service & Privacy Policy
                </span>
              </div>
            </label>
            {errors.acceptTerms && <div className="error-text"><AlertCircle size={13} /><span>{errors.acceptTerms}</span></div>}
          </div>

          {/* Submit Button */}
          <div className="form-group form-group-span-2" style={{ marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary">
              <UserPlus size={18} />
              REGISTER ACCOUNT
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
