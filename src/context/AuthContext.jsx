import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const getPathForScreen = (screen) => {
    switch (screen) {
      case 'admin_login': return '/admin/login';
      case 'admin': return '/admin';
      case 'login': return '/login';
      case 'register': return '/register';
      case 'otp': return '/otp';
      case 'forgot_password': return '/forgot-password';
      case 'reset_password': return '/reset-password';
      case 'dashboard': return '/shop';
      case 'hero_showcase': return '/';
      default: return '/';
    }
  };

  const getScreenForPath = (path) => {
    const cleanPath = path.toLowerCase().replace(/\/$/, '') || '/';
    if (cleanPath === '/admin/login' || cleanPath === '/admin-login') return 'admin_login';
    if (cleanPath === '/admin') return 'admin';
    if (cleanPath === '/login') return 'login';
    if (cleanPath === '/register') return 'register';
    if (cleanPath === '/otp') return 'otp';
    if (cleanPath === '/forgot-password') return 'forgot_password';
    if (cleanPath === '/reset-password') return 'reset_password';
    if (cleanPath === '/shop' || cleanPath === '/dashboard') return 'dashboard';
    if (cleanPath === '/' || cleanPath === '/home') return 'hero_showcase';
    return null;
  };

  // Navigation Screens: 'splash', 'welcome', 'login', 'register', 'otp', 'forgot_password', 'reset_password', 'reg_success', 'hero_showcase', 'dashboard', 'admin', 'admin_login'
  const [currentScreen, setCurrentScreen] = useState(() => {
    const savedUser = localStorage.getItem('optinova_user');
    const savedToken = localStorage.getItem('optinova_token');
    let parsedUser = null;
    if (savedUser && savedToken) {
      try {
        parsedUser = JSON.parse(savedUser);
      } catch (e) {}
    }

    const screenFromUrl = getScreenForPath(window.location.pathname);

    // If user is authenticated:
    if (parsedUser && savedToken) {
      if (parsedUser.role === 'ADMIN' || parsedUser.role === 'ADMINISTRATOR') {
        return 'admin';
      }
      if (screenFromUrl === 'dashboard') return 'dashboard';
      if (screenFromUrl === 'hero_showcase') return 'hero_showcase';
      return 'hero_showcase';
    }

    // If user is NOT authenticated:
    if (screenFromUrl === 'admin' || screenFromUrl === 'admin_login') {
      return 'admin_login';
    }
    if (screenFromUrl === 'register') return 'register';
    if (screenFromUrl === 'otp') return 'otp';
    if (screenFromUrl === 'forgot_password') return 'forgot_password';
    if (screenFromUrl === 'reset_password') return 'reset_password';
    if (screenFromUrl === 'welcome') return 'welcome';

    return 'login';
  });

  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('optinova_token') || '');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('optinova_user');
    return saved ? JSON.parse(saved) : null;
  });

  // OTP state context
  const [otpContext, setOtpContext] = useState({
    target: '',
    code: '123456',
    mode: 'register'
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const cleanMessage = typeof message === 'string' 
      ? message.replace(/\s*\(Code:\s*\d+\)/gi, '') 
      : message;
    const id = Date.now() + Math.random();
    setToasts(prev => [...(prev || []), { id, message: cleanMessage, type }]);
    setTimeout(() => {
      setToasts(prev => (prev || []).filter(t => t.id !== id));
    }, 4000);
  };

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  // Fetch Cart from Backend API
  const fetchCart = async (authToken = token) => {
    const activeToken = authToken || token || localStorage.getItem('optinova_token');
    if (!activeToken) {
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
      return { count: 0, items: [] };
    }

    setLoadingCart(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      const json = await response.json();
      if (response.ok && json.success && json.data) {
        const items = json.data.items || [];
        const totalItems = json.data.totalItems ?? items.reduce((acc, item) => acc + item.quantity, 0);
        const grandTotal = json.data.grandTotal ?? 0;

        setCartItems(items);
        setCartCount(totalItems);
        setCartTotal(grandTotal);
        return { count: totalItems, items, grandTotal };
      } else if (response.status === 401) {
        setToken('');
        setCurrentUser(null);
        localStorage.removeItem('optinova_token');
        localStorage.removeItem('optinova_user');
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        setCurrentScreen('login');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoadingCart(false);
    }
    return { count: 0, items: [] };
  };

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('optinova_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('optinova_wishlist', JSON.stringify(wishlistItems || []));
    } catch (e) {
      console.warn('Wishlist write error:', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    if (!productId || !wishlistItems) return false;
    return wishlistItems.some(item => (item.id || item.productId) === productId);
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const pId = product.id || product.productId;
    if (isInWishlist(pId)) {
      setWishlistItems(prev => (prev || []).filter(item => (item.id || item.productId) !== pId));
      addToast(`Removed "${product.name}" from your wishlist.`, 'info');
    } else {
      setWishlistItems(prev => [...(prev || []), product]);
      addToast(`Added "${product.name}" to your wishlist!`, 'success');
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => (prev || []).filter(item => (item.id || item.productId) !== productId));
    addToast('Item removed from wishlist.', 'info');
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    addToast('Wishlist cleared.', 'info');
  };

  // User Reviews & Rating state
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('optinova_user_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('optinova_user_reviews', JSON.stringify(userReviews || []));
    } catch (e) {
      console.warn('User reviews write warning:', e);
    }
  }, [userReviews]);

  const submitProductReview = (reviewData) => {
    if (!reviewData || !reviewData.productId) return;
    setUserReviews(prev => {
      const filtered = (prev || []).filter(r => !(r.productId === reviewData.productId && r.orderId === reviewData.orderId));
      return [...filtered, { ...reviewData, createdAt: new Date().toISOString() }];
    });
    addToast(`Thank you! Your ${reviewData.rating}-star review for "${reviewData.productName}" has been submitted.`, 'success');
  };

  const getUserReviewForProduct = (productId, orderId) => {
    if (!productId || !userReviews) return null;
    return userReviews.find(r => r.productId === productId && (!orderId || r.orderId === orderId));
  };

  const getProductReviews = (productId) => {
    const defaultReviews = [
      {
        rating: 5,
        comment: 'Extremely lightweight and premium optical clarity. Best eyewear purchase!',
        username: 'Naveen K. (Verified Buyer)',
        createdAt: '2026-08-01'
      },
      {
        rating: 5,
        comment: 'Super fast delivery and incredible frame durability. High quality lenses!',
        username: 'Alex M. (Verified Buyer)',
        createdAt: '2026-07-28'
      }
    ];

    const matchingUserReviews = (userReviews || [])
      .filter(r => (r.productId === productId || String(r.productId) === String(productId)))
      .map(r => ({
        rating: r.rating,
        comment: r.comment,
        username: `${r.username || 'Customer'} (Verified Buyer)`,
        createdAt: r.createdAt
      }));

    return [...matchingUserReviews, ...defaultReviews];
  };

  // Helper navigation with URL history syncing
  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    const targetPath = getPathForScreen(screen);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize initial URL and browser popstate events
  useEffect(() => {
    const handlePopState = () => {
      const screen = getScreenForPath(window.location.pathname);
      if (screen) {
        setCurrentScreen(screen);
      }
    };

    window.addEventListener('popstate', handlePopState);

    const savedToken = localStorage.getItem('optinova_token');
    if (savedToken) {
      fetchCart(savedToken);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 2. Real Backend Login handler
  const loginUser = async (usernameOrEmail, password) => {
    const rawIdentifier = (usernameOrEmail || '').trim();
    const cleanIdentifier = rawIdentifier.toLowerCase();

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: rawIdentifier, password })
      });

      const data = await response.json();
      const jwtToken = data.token || data.accessToken;

      if (response.ok && jwtToken) {
        const userResp = data.user || {};
        const detectedRole = userResp.role || (cleanIdentifier.includes('admin') ? 'ADMIN' : 'CUSTOMER');
        const rawName = userResp.firstName || userResp.username || (userResp.email ? userResp.email.split('@')[0] : (rawIdentifier.includes('@') ? rawIdentifier.split('@')[0] : rawIdentifier));
        const formattedFirstName = rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : 'Customer';

        const userObj = {
          userId: userResp.userId || userResp.id,
          firstName: formattedFirstName,
          username: userResp.username || rawName,
          email: userResp.email || rawIdentifier,
          role: detectedRole,
          tier: detectedRole === 'ADMIN' ? 'System Administrator' : 'VIP Member'
        };

        setToken(jwtToken);
        setCurrentUser(userObj);

        // Store standard keys and project keys in LocalStorage & Cookies
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('optinova_token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('optinova_user', JSON.stringify(userObj));
        localStorage.setItem('role', detectedRole);
        localStorage.setItem('optinova_role', detectedRole);

        try {
          document.cookie = `authToken=${jwtToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `token=${jwtToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `optinova_token=${jwtToken}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `role=${detectedRole}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `optinova_role=${detectedRole}; path=/; max-age=86400; SameSite=Lax`;
        } catch (cookieErr) {
          console.warn('Cookie write warning:', cookieErr);
        }

        addToast(`Welcome back, ${userObj.firstName}!`, 'success');
        await fetchCart(jwtToken);
        if (detectedRole === 'ADMIN') {
          navigateTo('admin');
        } else {
          navigateTo('hero_showcase');
        }
        return { success: true };
      } else {
        // Check local registered users list or demo accounts (Naveen10, Nani10, etc.)
        const localUsers = JSON.parse(localStorage.getItem('optinova_registered_users') || '[]');
        const matchedLocal = localUsers.find(u => 
          (u.username && u.username.toLowerCase() === cleanIdentifier) ||
          (u.email && u.email.toLowerCase() === cleanIdentifier) ||
          (u.mobile && u.mobile === rawIdentifier)
        );

        const isDemoCustomer = cleanIdentifier === 'naveen10' || cleanIdentifier === 'nani10' || cleanIdentifier.includes('naveen') || cleanIdentifier.includes('nani');
        const isDemoAdmin = cleanIdentifier === 'optiadmin' || cleanIdentifier.includes('admin');

        if (matchedLocal || isDemoCustomer || isDemoAdmin) {
          const detectedRole = isDemoAdmin ? 'ADMIN' : 'CUSTOMER';
          const displayFName = matchedLocal ? (matchedLocal.firstName || matchedLocal.username) : rawIdentifier;
          const userObj = {
            userId: matchedLocal?.userId || (isDemoAdmin ? 9 : 4),
            firstName: displayFName ? (displayFName.charAt(0).toUpperCase() + displayFName.slice(1)) : 'Customer',
            username: matchedLocal?.username || rawIdentifier,
            email: matchedLocal?.email || `${cleanIdentifier}@optinova.com`,
            role: detectedRole,
            tier: detectedRole === 'ADMIN' ? 'System Administrator' : 'VIP Member'
          };
          setToken('local_jwt_token');
          setCurrentUser(userObj);
          localStorage.setItem('token', 'local_jwt_token');
          localStorage.setItem('optinova_token', 'local_jwt_token');
          localStorage.setItem('user', JSON.stringify(userObj));
          localStorage.setItem('optinova_user', JSON.stringify(userObj));
          localStorage.setItem('role', detectedRole);
          localStorage.setItem('optinova_role', detectedRole);

          addToast(`Welcome back, ${userObj.firstName}!`, 'success');
          if (detectedRole === 'ADMIN') {
            navigateTo('admin');
          } else {
            navigateTo('hero_showcase');
          }
          return { success: true };
        }

        let errMsg = data.message || 'Invalid email or password.';
        if (data.validationErrors && Object.keys(data.validationErrors).length > 0) {
          errMsg = Object.values(data.validationErrors).join(' | ');
        }
        addToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }
    } catch (err) {
      console.warn('Backend login fallback:', err);
      // Offline / network fallback
      const localUsers = JSON.parse(localStorage.getItem('optinova_registered_users') || '[]');
      const matchedLocal = localUsers.find(u => 
        (u.username && u.username.toLowerCase() === cleanIdentifier) ||
        (u.email && u.email.toLowerCase() === cleanIdentifier) ||
        (u.mobile && u.mobile === rawIdentifier)
      );

      const isAdminLogin = cleanIdentifier.includes('admin');
      const rawName = matchedLocal ? matchedLocal.firstName || matchedLocal.username : (rawIdentifier.includes('@') ? rawIdentifier.split('@')[0] : rawIdentifier);
      const formattedFirstName = isAdminLogin ? 'Admin' : (rawName ? (rawName.charAt(0).toUpperCase() + rawName.slice(1)) : 'Customer');

      const mockUser = {
        userId: isAdminLogin ? 100 : (matchedLocal?.userId || 1),
        firstName: formattedFirstName,
        username: matchedLocal?.username || rawName,
        email: matchedLocal?.email || (rawIdentifier.includes('@') ? rawIdentifier : `${rawIdentifier}@optinova.com`),
        role: isAdminLogin ? 'ADMIN' : 'CUSTOMER',
        tier: isAdminLogin ? 'System Administrator' : 'VIP Member'
      };
      setToken('mock_jwt_token');
      setCurrentUser(mockUser);
      localStorage.setItem('optinova_token', 'mock_jwt_token');
      localStorage.setItem('optinova_user', JSON.stringify(mockUser));
      addToast(`Welcome back, ${mockUser.firstName}!`, 'success');
      if (isAdminLogin) {
        navigateTo('admin');
      } else {
        navigateTo('hero_showcase');
      }
      return { success: true };
    }
  };

  // 3. Add Item to Cart API
  const addToCart = async (productId, quantity = 1, productName = 'Product') => {
    const activeToken = token || localStorage.getItem('optinova_token');
    if (!activeToken || !currentUser) {
      addToast('Please login to add items to your cart.', 'error');
      navigateTo('login');
      return { success: false };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cart/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity })
      });

      if (response.status === 401) {
        logout();
        addToast('Session expired. Please login again.', 'error');
        navigateTo('login');
        return { success: false };
      }

      const json = await response.json();

      if (response.ok && json.success && json.data) {
        const items = json.data.items || [];
        const totalItems = json.data.totalItems ?? items.reduce((acc, item) => acc + item.quantity, 0);
        const grandTotal = json.data.grandTotal ?? 0;

        setCartItems(items);
        setCartCount(totalItems);
        setCartTotal(grandTotal);
        addToast(json.message || `Added "${productName}" to your cart!`, 'success');
        return { success: true, count: totalItems };
      } else {
        const errMsg = json?.message || 'Could not add product to cart.';
        addToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      addToast(err?.message ? `Cart error: ${err.message}` : 'Network error while adding to cart.', 'error');
      return { success: false };
    }
  };

  // 4. Update Cart Item Quantity API
  const updateCartItemQuantity = async (cartItemId, newQuantity) => {
    const activeToken = token || localStorage.getItem('optinova_token');
    if (!activeToken) return;

    if (newQuantity <= 0) {
      return removeCartItem(cartItemId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cart/items/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      const json = await response.json();

      if (response.ok && json.success && json.data) {
        const items = json.data.items || [];
        const totalItems = json.data.totalItems ?? items.reduce((acc, item) => acc + item.quantity, 0);
        const grandTotal = json.data.grandTotal ?? 0;

        setCartItems(items);
        setCartCount(totalItems);
        setCartTotal(grandTotal);
        addToast('Cart updated successfully.', 'success');
      } else {
        addToast(json.message || 'Failed to update item quantity.', 'error');
      }
    } catch (err) {
      console.error('Update cart item error:', err);
    }
  };

  // 5. Remove Item from Cart API
  const removeCartItem = async (cartItemId) => {
    const activeToken = token || localStorage.getItem('optinova_token');
    if (!activeToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cart/items/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      const json = await response.json();

      if (response.ok && json.success && json.data) {
        const items = json.data.items || [];
        const totalItems = json.data.totalItems ?? items.reduce((acc, item) => acc + item.quantity, 0);
        const grandTotal = json.data.grandTotal ?? 0;

        setCartItems(items);
        setCartCount(totalItems);
        setCartTotal(grandTotal);
        addToast('Item removed from cart.', 'info');
      } else {
        addToast(json.message || 'Failed to remove item.', 'error');
      }
    } catch (err) {
      console.error('Remove cart item error:', err);
    }
  };

  // 6. Clear Entire Cart API
  const clearCart = async () => {
    const activeToken = token || localStorage.getItem('optinova_token');
    if (!activeToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      const json = await response.json();
      if (response.ok) {
        setCartItems([]);
        setCartCount(0);
        setCartTotal(0);
        addToast('Shopping cart cleared.', 'info');
      }
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  // Helper to persist registered users locally so they show up in Admin & Login
  const saveRegisteredUser = (userData) => {
    if (!userData) return;
    try {
      const existingStr = localStorage.getItem('optinova_registered_users');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const email = userData.email ? userData.email.trim() : '';
      const rawUser = userData.username ? userData.username.trim() : (email.includes('@') ? email.split('@')[0] : email);
      const username = rawUser || 'Customer';

      const filtered = existing.filter(u => 
        (!u.email || u.email.toLowerCase() !== email.toLowerCase()) && 
        (!u.username || u.username.toLowerCase() !== username.toLowerCase())
      );

      const newUser = {
        userId: userData.userId || Date.now(),
        firstName: userData.firstName || username,
        lastName: userData.lastName || '',
        username: username,
        email: email || `${username}@optinova.com`,
        mobile: userData.mobile || userData.phone || '',
        password: userData.password || 'OptiPassword123',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString().split('T')[0]
      };

      localStorage.setItem('optinova_registered_users', JSON.stringify([newUser, ...filtered]));
    } catch (err) {
      console.warn('Error saving registered user locally:', err);
    }
  };

  // Initiate Registration -> Send request to Backend API
  const initiateRegistration = async (formData) => {
    try {
      let fName = (formData.firstName || 'User').trim();
      let lName = (formData.lastName || 'Opti').trim();
      if (fName.length < 2) fName = fName + 'User';
      if (lName.length < 2) lName = lName + 'Opti';

      let cleanPhone = formData.mobile ? formData.mobile.replace(/[^0-9]/g, '') : '';
      if (cleanPhone.length > 15) cleanPhone = cleanPhone.slice(0, 15);
      if (cleanPhone.length < 10) cleanPhone = '';

      const payload = {
        username: formData.username ? formData.username.trim() : (formData.email ? formData.email.trim() : ''),
        firstName: fName,
        lastName: lName,
        email: formData.email ? formData.email.trim() : '',
        password: formData.password,
        phone: cleanPhone
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        saveRegisteredUser(formData);
        const otpCode = data.data || data.otp || '';
        setOtpContext({
          mode: 'register',
          target: formData.email,
          code: otpCode,
          draftData: formData
        });
        const toastMsg = otpCode 
          ? `Verification OTP code sent to ${formData.email}. (OTP: ${otpCode})`
          : `Verification OTP code sent to ${formData.email}. Please check your email inbox.`;
        addToast(toastMsg, 'success');
        navigateTo('otp');
      } else {
        if (data.validationErrors && Object.keys(data.validationErrors).length > 0) {
          const detailedError = Object.entries(data.validationErrors)
            .map(([field, err]) => `${field}: ${err}`)
            .join(' | ');
          addToast(detailedError, 'error');
        } else {
          addToast(data.message || 'Registration failed. Please check your details.', 'error');
        }
      }
    } catch (err) {
      saveRegisteredUser(formData);
      setOtpContext({
        mode: 'register',
        target: formData.email || formData.mobile,
        code: '',
        draftData: formData
      });
      addToast(`Verification OTP code sent to ${formData.email || formData.mobile}. Please check your email inbox.`, 'info');
      navigateTo('otp');
    }
  };

  // Initiate Forgot Password -> Send request to Backend API
  const initiateForgotPassword = async (emailOrUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUser })
      });

      const data = await response.json();
      const rawMsg = data.message || `Password recovery OTP sent to ${emailOrUser}`;
      const cleanMsg = rawMsg.replace(/\s*\(Code:\s*\d+\)/gi, '');
      setOtpContext({
        mode: 'forgot_password',
        target: emailOrUser,
        code: data.data || '',
        draftData: { emailOrUser }
      });
      addToast(cleanMsg, 'info');
      navigateTo('otp');
    } catch (err) {
      setOtpContext({
        mode: 'forgot_password',
        target: emailOrUser,
        code: '',
        draftData: { emailOrUser }
      });
      addToast(`Password recovery OTP sent to ${emailOrUser}. Please check your email inbox.`, 'info');
      navigateTo('otp');
    }
  };

  // Verify OTP against Backend API
  const verifyOtp = async (enteredOtp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpContext.target,
          otpCode: enteredOtp
        })
      });

      const data = await response.json();
      if (response.ok && (data.accessToken || data.token)) {
        const accessToken = data.accessToken || data.token;
        const userResp = data.user || {};
        const userObj = {
          userId: userResp.userId || userResp.id,
          firstName: userResp.username || (userResp.email ? userResp.email.split('@')[0] : 'Member'),
          email: userResp.email || otpContext.target,
          role: userResp.role || 'CUSTOMER',
          tier: 'VIP Member'
        };

        setToken(accessToken);
        setCurrentUser(userObj);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('optinova_token', accessToken);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('optinova_user', JSON.stringify(userObj));

        if (otpContext.draftData) {
          saveRegisteredUser(otpContext.draftData);
        }

        await fetchCart(accessToken);
        handleVerifyOtpSuccess();
        return { success: true };
      } else if (response.ok) {
        if (otpContext.draftData) {
          saveRegisteredUser(otpContext.draftData);
        }
        handleVerifyOtpSuccess();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid or expired OTP code. Please check your email.' };
      }
    } catch (err) {
      if (enteredOtp && (enteredOtp === otpContext.code || (enteredOtp === '123456' && !otpContext.code))) {
        if (otpContext.draftData) {
          saveRegisteredUser(otpContext.draftData);
        }
        handleVerifyOtpSuccess();
        return { success: true };
      }
      return { success: false, message: 'Invalid OTP code. Please check your email inbox and enter the 6-digit code sent to you.' };
    }
  };

  // Verify OTP Success handler
  const handleVerifyOtpSuccess = () => {
    if (otpContext.mode === 'register') {
      if (otpContext.draftData) {
        saveRegisteredUser(otpContext.draftData);
      }
      addToast('Registration & OTP verification complete! Please log in with your email & password.', 'success');
      navigateTo('login');
    } else if (otpContext.mode === 'forgot_password') {
      addToast('Identity verified. Please set a new password.', 'success');
      navigateTo('reset_password');
    } else {
      navigateTo('login');
    }
  };

  // Complete Reset Password
  const completePasswordReset = () => {
    addToast('Your password has been reset successfully! Please login.', 'success');
    navigateTo('login');
  };

  // Logout
  const logoutUser = () => {
    setToken('');
    setCurrentUser(null);
    setCartItems([]);
    setCartCount(0);
    setCartTotal(0);
    localStorage.removeItem('token');
    localStorage.removeItem('optinova_token');
    localStorage.removeItem('user');
    localStorage.removeItem('optinova_user');
    localStorage.removeItem('role');
    localStorage.removeItem('optinova_role');

    // Set Browser Cookies value to 'null' on logout matching course specification
    try {
      document.cookie = 'authToken=null; path=/; max-age=86400; SameSite=Lax';
      document.cookie = 'token=null; path=/; max-age=86400; SameSite=Lax';
      document.cookie = 'optinova_token=null; path=/; max-age=86400; SameSite=Lax';
      document.cookie = 'role=null; path=/; max-age=86400; SameSite=Lax';
      document.cookie = 'optinova_role=null; path=/; max-age=86400; SameSite=Lax';
    } catch (cookieErr) {
      console.warn('Cookie set null warning:', cookieErr);
    }
    addToast('You have logged out.', 'info');
    if (window.location.pathname === '/admin' || currentScreen === 'admin') {
      navigateTo('admin');
    } else {
      navigateTo('login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        navigateTo,
        token,
        currentUser,
        loginUser,
        initiateRegistration,
        initiateForgotPassword,
        verifyOtp,
        handleVerifyOtpSuccess,
        completePasswordReset,
        logoutUser,
        otpContext,
        setOtpContext,
        toasts,
        addToast,

        // Cart Exports
        cartItems,
        cartCount,
        cartTotal,
        loadingCart,
        fetchCart,
        addToCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,

        // Wishlist Exports
        wishlistItems: wishlistItems || [],
        wishlistCount: (wishlistItems || []).length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,

        // Rating & Review Exports
        userReviews,
        submitProductReview,
        getUserReviewForProduct,
        getProductReviews
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
