import React, { useState } from 'react';
import { User, Lock, Bell, Save, CheckCircle2, Image } from 'lucide-react';

export const SettingsModuleView = ({ currentUser, onToast }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : (currentUser?.username || 'OptiNova Administrator'),
    email: currentUser?.email || 'optiadmin@optinova.com',
    phone: '+91 98765 43210',
    profilePicUrl: ''
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Notifications Toggle Switches State
  const [notificationsForm, setNotificationsForm] = useState({
    newOrderNotifications: true,
    lowStockAlerts: true,
    userRegistrationNotifications: true,
    promotionalNotifications: false
  });

  // Profile Submit Handler
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (onToast) onToast('Administrator profile updated successfully!', 'success');
  };

  // Password Change Handler
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordError('');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    if (onToast) onToast('Password changed successfully!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Admin Settings
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Manage administrator profile, account security password, and system notifications
        </p>
      </div>

      {/* 3 Tabs Row ONLY (Profile, Password, Notifications) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'password', label: 'Password', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: isActive ? '#3B82F6' : 'rgba(255, 255, 255, 0.04)',
                border: 'none',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Tab Panel Container */}
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        maxWidth: '680px'
      }}>
        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 20px 0' }}>
              Administrator Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  Profile Picture URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={profileForm.profilePicUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, profilePicUrl: e.target.value })}
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#3B82F6',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Save size={16} />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. PASSWORD TAB */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 20px 0' }}>
              Change Password
            </h3>

            {passwordError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#EF4444',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                fontWeight: 600
              }}>
                ⚠ {passwordError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  New Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min. 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#94A3B8', marginBottom: '6px' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: '#111827',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#3B82F6',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                <Lock size={16} />
                <span>Change Password</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. NOTIFICATIONS TAB (Toggle Switches) */}
        {activeTab === 'notifications' && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 20px 0' }}>
              Notification Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Toggle Switch 1 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>New Order Notifications</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>Receive instant alerts when a customer places an order</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationsForm.newOrderNotifications}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, newOrderNotifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notificationsForm.newOrderNotifications ? '#10B981' : '#374151',
                    borderRadius: '34px', transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '20px', width: '20px', left: '3px', bottom: '3px',
                      backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                      transform: notificationsForm.newOrderNotifications ? 'translateX(22px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>

              {/* Toggle Switch 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>Low Stock Alerts</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>Get notified when eyewear frame stock falls below threshold</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationsForm.lowStockAlerts}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, lowStockAlerts: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notificationsForm.lowStockAlerts ? '#10B981' : '#374151',
                    borderRadius: '34px', transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '20px', width: '20px', left: '3px', bottom: '3px',
                      backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                      transform: notificationsForm.lowStockAlerts ? 'translateX(22px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>

              {/* Toggle Switch 3 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>User Registration Notifications</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>Receive alerts when a new customer creates an account</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationsForm.userRegistrationNotifications}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, userRegistrationNotifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notificationsForm.userRegistrationNotifications ? '#10B981' : '#374151',
                    borderRadius: '34px', transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '20px', width: '20px', left: '3px', bottom: '3px',
                      backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                      transform: notificationsForm.userRegistrationNotifications ? 'translateX(22px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>

              {/* Toggle Switch 4 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#111827', padding: '16px', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.92rem' }}>Promotional Notifications</div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>Receive marketing & promotional campaign updates</div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationsForm.promotionalNotifications}
                    onChange={(e) => setNotificationsForm({ ...notificationsForm, promotionalNotifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: notificationsForm.promotionalNotifications ? '#10B981' : '#374151',
                    borderRadius: '34px', transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute', content: '""', height: '20px', width: '20px', left: '3px', bottom: '3px',
                      backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
                      transform: notificationsForm.promotionalNotifications ? 'translateX(22px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
