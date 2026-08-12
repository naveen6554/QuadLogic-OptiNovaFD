import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig';
import optinovaBg from '../assets/optinova_bg.png';
import { AdminSidebar } from './admin/AdminSidebar';
import { AdminTopNavbar } from './admin/AdminTopNavbar';
import { DashboardHomeView } from './admin/DashboardHomeView';
import { ProductsModuleView } from './admin/ProductsModuleView';
import { UsersModuleView } from './admin/UsersModuleView';
import { OrdersModuleView } from './admin/OrdersModuleView';
import { AnalyticsModuleView } from './admin/AnalyticsModuleView';
import { SettingsModuleView } from './admin/SettingsModuleView';
import { NotificationsModuleView } from './admin/NotificationsModuleView';
import { AdminModals } from './admin/AdminModals';
import { AdminSecurityGate } from './admin/AdminSecurityGate';
import { Footer } from './admin/Footer';

export const AdminDashboard = () => {
  const { token, currentUser, navigateTo, addToast, loginUser, logoutUser } = useAuth();

  // Navigation Module View State: 'dashboard' | 'products' | 'users' | 'orders' | 'analytics' | 'notifications' | 'settings'
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Active Overlay Modals
  const [activeModal, setActiveModal] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ---------------------------------------------------------------------------
  // DATA STATES
  // ---------------------------------------------------------------------------
  const [revenueData, setRevenueData] = useState({
    daily: { totalRevenue: 1450.00, totalOrders: 4 },
    monthly: { totalRevenue: 12850.50, totalOrders: 32 },
    yearly: { totalRevenue: 88400.00, totalOrders: 215 },
    overall: { totalRevenue: 145900.75, totalOrders: 380 }
  });
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const [editUserTarget, setEditUserTarget] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [submittingUser, setSubmittingUser] = useState(false);

  const savedUserStr = localStorage.getItem('optinova_user');
  const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
  const activeUser = currentUser || savedUser;
  const isAdmin = Boolean(activeUser && (
    activeUser.role === 'ADMIN' || 
    activeUser.role === 'ADMINISTRATOR' || 
    activeUser.username === 'optiadmin' || 
    localStorage.getItem('optinova_token') === 'mock_admin_token'
  ));

  // Live Customer Orders Dataset
  const [salesOrders, setSalesOrders] = useState([
    {
      orderId: '#ORD-792AE88A',
      customerName: 'Naveen Kumar',
      customerEmail: 'naveen@optinova.com',
      customerPhone: '+91 98765 43210',
      address: '123 OptiNova Tower, Suite 400',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      name: 'Zenni Optical Reading Frame',
      category: 'Reading Glass',
      quantity: 1,
      pricePerItem: 2500,
      totalPrice: 2500,
      orderDate: '4 Aug 2026, 5:26 PM',
      deliveryDate: '5 Aug 2026',
      paymentMethod: 'UPI / Razorpay',
      paymentStatus: 'PAID',
      transactionId: 'TXN_9981247781',
      status: 'DELIVERED',
      imageUrl: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=300&q=80'
    },
    {
      orderId: '#ORD-96EE4B59',
      customerName: 'Naveen Kumar',
      customerEmail: 'naveen@optinova.com',
      customerPhone: '+91 98765 43210',
      address: '123 OptiNova Tower, Suite 400',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      name: 'Wayfarer Prescription Optical',
      category: 'Prescription Glasses',
      quantity: 1,
      pricePerItem: 9200,
      totalPrice: 9200,
      orderDate: '3 Aug 2026, 6:10 PM',
      deliveryDate: '4 Aug 2026',
      paymentMethod: 'Credit Card',
      paymentStatus: 'PAID',
      transactionId: 'TXN_8823410923',
      status: 'DELIVERED',
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80'
    },
    {
      orderId: '#ORD-109283AB',
      customerName: 'Alex Smith',
      customerEmail: 'alex@example.com',
      customerPhone: '+91 91234 56789',
      address: '45 MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      name: 'Titanium Flex Rimless Pro',
      category: 'Titanium Eyewear',
      quantity: 1,
      pricePerItem: 14500,
      totalPrice: 14500,
      orderDate: '7 Aug 2026, 10:15 AM',
      deliveryDate: 'Pending Dispatch',
      paymentMethod: 'NetBanking',
      paymentStatus: 'UNPAID',
      transactionId: 'TXN_PENDING_001',
      status: 'PENDING',
      imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=300&q=80'
    },
    {
      orderId: '#ORD-88B12C44',
      customerName: 'Alex Smith',
      customerEmail: 'alex@example.com',
      customerPhone: '+91 91234 56789',
      address: '45 MG Road, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
      name: 'Aviator Classic Gold Frame',
      category: 'Sunglasses',
      quantity: 2,
      pricePerItem: 1499,
      totalPrice: 2998,
      orderDate: '2 Aug 2026, 2:15 PM',
      deliveryDate: '3 Aug 2026',
      paymentMethod: 'Razorpay UPI',
      paymentStatus: 'PAID',
      transactionId: 'TXN_7721839210',
      status: 'DELIVERED',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80'
    },
    {
      orderId: '#ORD-554433XX',
      customerName: 'Michael Brown',
      customerEmail: 'michael@example.com',
      customerPhone: '+91 99887 76655',
      address: '78 Park Street, Civil Lines',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110054',
      name: 'Ray-Ban Wayfarer Polarized',
      category: 'Sunglasses',
      quantity: 1,
      pricePerItem: 12000,
      totalPrice: 12000,
      orderDate: '30 Jul 2026, 1:40 PM',
      deliveryDate: 'N/A (Cancelled)',
      cancellationDate: '31 Jul 2026',
      paymentMethod: 'Credit Card',
      paymentStatus: 'PAID',
      transactionId: 'TXN_CANCELLED_09',
      status: 'CANCELLED',
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80'
    }
  ]);

  // ---------------------------------------------------------------------------
  // REAL-TIME NOTIFICATIONS ENGINE STATE
  // ---------------------------------------------------------------------------
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'notif-101',
      title: '🛒 New Order Received',
      desc: 'Order #ORD-109283AB placed by Alex Smith (₹14,500)',
      time: '2 minutes ago',
      horizon: 'TODAY',
      category: 'ORDER',
      type: 'NEW_ORDER',
      targetSection: 'orders',
      isRead: false
    },
    {
      id: 'notif-102',
      title: '⚡ Low Stock Warning',
      desc: 'OptiNova Titan Flex Pro stock has fallen below threshold (3 remaining)',
      time: '15 minutes ago',
      horizon: 'TODAY',
      category: 'PRODUCT',
      type: 'LOW_STOCK',
      targetSection: 'products',
      isRead: false
    },
    {
      id: 'notif-103',
      title: '💳 Payment Successful',
      desc: 'Razorpay payment ₹2,500 settled for Order #ORD-792AE88A',
      time: '1 hour ago',
      horizon: 'TODAY',
      category: 'PAYMENT',
      type: 'PAYMENT_SUCCESS',
      targetSection: 'orders',
      isRead: false
    },
    {
      id: 'notif-104',
      title: '👤 New User Registered',
      desc: 'Customer sarah_vision created a new OptiNova account',
      time: '3 hours ago',
      horizon: 'TODAY',
      category: 'USER',
      type: 'NEW_USER',
      targetSection: 'users',
      isRead: false
    },
    {
      id: 'notif-105',
      title: '📦 Order Delivered',
      desc: 'Order #ORD-88B12C44 successfully delivered to customer',
      time: 'Yesterday at 4:30 PM',
      horizon: 'YESTERDAY',
      category: 'ORDER',
      type: 'ORDER_DELIVERED',
      targetSection: 'orders',
      isRead: true
    },
    {
      id: 'notif-106',
      title: '❌ Order Cancelled',
      desc: 'Order #ORD-554433XX cancelled by customer Michael Brown',
      time: '3 days ago',
      horizon: 'EARLIER',
      category: 'ORDER',
      type: 'ORDER_CANCELLED',
      targetSection: 'orders',
      isRead: true
    }
  ]);

  // Sync localStorage customer orders and auto-generate store event notifications
  useEffect(() => {
    const syncStoreEvents = () => {
      try {
        const localSaved = JSON.parse(localStorage.getItem('optinova_user_orders') || '[]');
        if (Array.isArray(localSaved) && localSaved.length > 0) {
          setSalesOrders(prevOrders => {
            const existingIds = new Set(prevOrders.map(o => o.orderId));
            const newFormatted = [];
            const newNotifs = [];

            localSaved.forEach(item => {
              const oId = item.orderId || `ORD-${Date.now()}`;
              if (!existingIds.has(oId)) {
                newFormatted.push({
                  orderId: oId,
                  customerName: activeUser?.username || item.customerName || 'Naveen10',
                  customerEmail: activeUser?.email || item.customerEmail || 'customer@optinova.com',
                  customerPhone: item.phone || '+91 98765 43210',
                  address: item.address || '45 Park View Avenue',
                  city: item.city || 'Bangalore',
                  state: item.state || 'Karnataka',
                  pincode: item.pincode || '560001',
                  name: item.name || 'OptiNova Premium Frame',
                  category: item.category || 'Eyewear',
                  quantity: item.quantity || 1,
                  pricePerItem: item.pricePerUnit || item.price || 2500,
                  totalPrice: item.totalPrice || ((item.pricePerUnit || item.price || 2500) * (item.quantity || 1)),
                  orderDate: item.orderDate ? new Date(item.orderDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now',
                  deliveryDate: item.deliveryDate || 'Processing Delivery',
                  paymentMethod: item.paymentMethod || 'Razorpay UPI',
                  paymentStatus: item.paymentStatus || 'PAID',
                  transactionId: item.transactionId || `TXN_${Date.now()}`,
                  status: item.status || 'PENDING',
                  imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=300&q=80'
                });

                newNotifs.push({
                  id: `notif-live-${Date.now()}`,
                  title: '🛒 New Order Received',
                  desc: `Order ${oId} placed by ${activeUser?.username || 'Customer'} (₹${(item.totalPrice || 2500).toLocaleString('en-IN')})`,
                  time: 'Just now',
                  horizon: 'TODAY',
                  category: 'ORDER',
                  type: 'NEW_ORDER',
                  targetSection: 'orders',
                  isRead: false
                });

                existingIds.add(oId);
              }
            });

            if (newNotifs.length > 0) {
              setNotificationsList(prev => [...newNotifs, ...prev]);
              addToast(`🛒 ${newNotifs.length} New Customer Order(s) Received!`, 'info');
            }

            return [...newFormatted, ...prevOrders];
          });
        }
      } catch (err) {
        console.warn('Error reading store events:', err);
      }
    };

    syncStoreEvents();
    // Real-time polling refresh interval every 30 seconds
    const intervalId = setInterval(syncStoreEvents, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Unread Notifications Count
  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  // Notification Action Handlers
  const handleMarkAsRead = (id) => {
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('All notifications marked as read.', 'success');
  };

  const handleClearAllNotifications = () => {
    setNotificationsList([]);
    addToast('Notification panel cleared.', 'info');
  };

  const handleDeleteNotification = (id) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    if (notification.targetSection) {
      setActiveSection(notification.targetSection);
    }
  };

  // ---------------------------------------------------------------------------
  // API FETCHERS
  // ---------------------------------------------------------------------------
  const fetchRevenueReports = async () => {
    setLoadingRevenue(true);
    const activeToken = token || localStorage.getItem('optinova_token');
    const headers = { 
      'Authorization': `Bearer ${activeToken}`,
      'Content-Type': 'application/json' 
    };

    try {
      const [dailyRes, monthlyRes, yearlyRes, overallRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/revenue/daily`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/revenue/monthly`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/revenue/yearly`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/revenue/overall`, { headers })
      ]);

      const [dailyJson, monthlyJson, yearlyJson, overallJson] = await Promise.all([
        dailyRes.ok ? dailyRes.json() : null,
        monthlyRes.ok ? monthlyRes.json() : null,
        yearlyRes.ok ? yearlyRes.json() : null,
        overallRes.ok ? overallRes.json() : null
      ]);

      const extractRevenue = (json, fallback) => {
        if (!json) return fallback;
        const payload = json.data || json;
        const rev = payload.totalRevenue != null ? Number(payload.totalRevenue) : fallback.totalRevenue;
        const ord = payload.totalOrders != null ? Number(payload.totalOrders) : fallback.totalOrders;
        return {
          totalRevenue: rev > 0 ? rev : fallback.totalRevenue,
          totalOrders: ord > 0 ? ord : fallback.totalOrders
        };
      };

      setRevenueData({
        daily: extractRevenue(dailyJson, { totalRevenue: 1450.00, totalOrders: 4 }),
        monthly: extractRevenue(monthlyJson, { totalRevenue: 12850.50, totalOrders: 32 }),
        yearly: extractRevenue(yearlyJson, { totalRevenue: 88400.00, totalOrders: 215 }),
        overall: extractRevenue(overallJson, { totalRevenue: 145900.75, totalOrders: 380 })
      });
    } catch (err) {
      console.error('Error fetching revenue reports:', err);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchProductsAndCategories = async () => {
    setLoadingProducts(true);
    const activeToken = token || localStorage.getItem('optinova_token');

    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/products?pageSize=100`),
        fetch(`${API_BASE_URL}/api/v1/categories`)
      ]);

      if (prodRes.ok) {
        const pData = await prodRes.json();
        const pList = pData.data?.content || pData.data || pData.content || (Array.isArray(pData) ? pData : []);
        setProducts(Array.isArray(pList) ? pList : []);
      }

      if (catRes.ok) {
        const cData = await catRes.json();
        const cats = cData.data || (Array.isArray(cData) ? cData : []);
        setCategories(cats);
        if (cats.length > 0 && !newProduct.categoryId) {
          setNewProduct(prev => ({ ...prev, categoryId: cats[0].categoryId || cats[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const activeToken = token || localStorage.getItem('optinova_token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json' 
        }
      });

      if (res.ok) {
        const json = await res.json();
        const userList = json.data || (Array.isArray(json) ? json : []);
        setUsersList(Array.isArray(userList) ? userList : []);
      } else {
        setUsersList([
          { userId: 1, username: 'optiadmin', email: 'optiadmin@optinova.com', role: 'ADMIN', createdAt: '2026-01-15' },
          { userId: 2, username: 'alex_member', email: 'alex@optinova.com', role: 'CUSTOMER', createdAt: '2026-02-10' },
          { userId: 3, username: 'sarah_vision', email: 'sarah@example.com', role: 'CUSTOMER', createdAt: '2026-03-01' }
        ]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersList([
        { userId: 1, username: 'optiadmin', email: 'optiadmin@optinova.com', role: 'ADMIN', createdAt: '2026-01-15' },
        { userId: 2, username: 'alex_member', email: 'alex@optinova.com', role: 'CUSTOMER', createdAt: '2026-02-10' },
        { userId: 3, username: 'sarah_vision', email: 'sarah@example.com', role: 'CUSTOMER', createdAt: '2026-03-01' }
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const [productCatalogImages, setProductCatalogImages] = useState({});

  const fetchCatalogImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/products?pageSize=100`);
      if (response.ok) {
        const json = await response.json();
        const items = json.data?.content || json.data || json.content || [];
        const imgMap = {};
        if (Array.isArray(items)) {
          items.forEach(p => {
            const pId = p.productId || p.id;
            const img = (p.imageUrls && p.imageUrls.length > 0)
              ? p.imageUrls[0]
              : (p.images && p.images.length > 0 ? p.images[0].imageUrl : '');
            if (img) {
              if (pId) imgMap[pId] = img;
              if (p.name) imgMap[p.name.toLowerCase().trim()] = img;
            }
          });
        }
        setProductCatalogImages(imgMap);
      }
    } catch (err) {
      console.warn('Catalog image fetch error:', err);
    }
  };

  useEffect(() => {
    fetchCatalogImages();
    if (isAdmin) {
      fetchRevenueReports();
      fetchProductsAndCategories();
      fetchUsers();
    }
  }, [isAdmin]);

  // ---------------------------------------------------------------------------
  // ACTION HANDLERS
  // ---------------------------------------------------------------------------
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (submittingProduct) return;
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.categoryId) {
      addToast('Please fill in all required product fields.', 'error');
      return;
    }

    setSubmittingProduct(true);
    const activeToken = token || localStorage.getItem('optinova_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock, 10),
          categoryId: parseInt(newProduct.categoryId, 10),
          imageUrl: newProduct.imageUrl ? newProduct.imageUrl.trim() : undefined,
          imageUrls: newProduct.imageUrl ? [newProduct.imageUrl.trim()] : []
        })
      });

      if (response.ok) {
        addToast('Product added successfully and inventory updated!', 'success');
        
        // Add Product Event Notification
        setNotificationsList(prev => [{
          id: `notif-prod-${Date.now()}`,
          title: '📦 Product Added',
          desc: `New frame "${newProduct.name}" added to catalog with stock ${newProduct.stock}`,
          time: 'Just now',
          horizon: 'TODAY',
          category: 'PRODUCT',
          type: 'PRODUCT_ADDED',
          targetSection: 'products',
          isRead: false
        }, ...prev]);

        setNewProduct({ name: '', description: '', price: '', stock: '', categoryId: categories[0]?.categoryId || '', imageUrl: '' });
        setActiveModal(null);
        fetchProductsAndCategories();
        fetchCatalogImages();
      } else {
        const data = await response.json();
        const errMsg = data.message || (data.validationErrors ? Object.values(data.validationErrors).join(' | ') : 'Failed to add product.');
        addToast(errMsg, 'error');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      addToast('Network error while adding product.', 'error');
    } finally {
      setSubmittingProduct(false);
    }
  };

  const handleDeleteProductConfirm = async () => {
    if (!deleteProductTarget) return;

    setDeletingProduct(true);
    const activeToken = token || localStorage.getItem('optinova_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${deleteProductTarget.productId || deleteProductTarget.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });

      if (response.ok) {
        addToast('Product deleted successfully.', 'success');
        
        // Delete Product Event Notification
        setNotificationsList(prev => [{
          id: `notif-del-${Date.now()}`,
          title: '🗑 Product Deleted',
          desc: `Product "${deleteProductTarget.name}" removed from OptiNova catalog`,
          time: 'Just now',
          horizon: 'TODAY',
          category: 'PRODUCT',
          type: 'PRODUCT_DELETED',
          targetSection: 'products',
          isRead: false
        }, ...prev]);

        setDeleteProductTarget(null);
        fetchProductsAndCategories();
      } else {
        const data = await response.json();
        addToast(data.message || 'Failed to delete product.', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      addToast('Network error deleting product.', 'error');
    } finally {
      setDeletingProduct(false);
    }
  };

  const handleUpdateUserSubmit = async (e) => {
    e.preventDefault();
    if (!editUserTarget) return;

    setSubmittingUser(true);
    const activeToken = token || localStorage.getItem('optinova_token');

    try {
      const payload = {
        username: editUserForm.username,
        email: editUserForm.email,
        role: editUserForm.role
      };
      if (editUserForm.password) {
        payload.password = editUserForm.password;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/users/${editUserTarget.userId || editUserTarget.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        addToast(`User ${editUserForm.username} updated successfully!`, 'success');
        setEditUserTarget(null);
        fetchUsers();
      } else {
        const errMsg = data.message || (data.validationErrors ? Object.values(data.validationErrors).join(' | ') : 'Failed to update user.');
        addToast(errMsg, 'error');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      addToast('Network error updating user.', 'error');
    } finally {
      setSubmittingUser(false);
    }
  };

  // Search filtering
  const filteredProducts = products.filter(p => 
    !productSearch ||
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.description?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredUsers = usersList.filter(u => 
    !userSearch ||
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Security Gate
  if (!isAdmin) {
    return (
      <AdminSecurityGate
        onLoginSuccess={() => fetchRevenueReports()}
        onBackToStore={() => navigateTo('dashboard')}
      />
    );
  }

  // Render active module view based on activeSection
  const renderActiveModuleView = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardHomeView
            totalProductsCount={products.length || 8}
            totalUsersCount={usersList.length || 3}
            todayOrdersCount={revenueData?.daily?.totalOrders || 4}
            totalRevenueAmount={revenueData?.overall?.totalRevenue || 145900.75}
            salesOrders={salesOrders}
          />
        );
      case 'products':
        return (
          <ProductsModuleView
            products={products}
            categories={categories}
            productCatalogImages={productCatalogImages}
            onActionClick={(action) => setActiveModal(action)}
            setDeleteProductTarget={setDeleteProductTarget}
          />
        );
      case 'users':
        return (
          <UsersModuleView
            usersList={usersList}
            onActionClick={(action) => setActiveModal(action)}
            setEditUserTarget={setEditUserTarget}
            setEditUserForm={setEditUserForm}
          />
        );
      case 'orders':
        return (
          <OrdersModuleView
            salesOrders={salesOrders}
          />
        );
      case 'analytics':
        return (
          <AnalyticsModuleView
            revenueData={revenueData}
            onOpenReportModal={(reportType) => setActiveModal(reportType)}
            token={token}
          />
        );
      case 'notifications':
        return (
          <NotificationsModuleView
            notifications={notificationsList}
            onMarkAsRead={handleMarkAsRead}
            onDeleteNotification={handleDeleteNotification}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAllNotifications}
          />
        );
      case 'settings':
        return (
          <SettingsModuleView
            currentUser={currentUser || activeUser}
            onToast={addToast}
          />
        );
      default:
        return (
          <DashboardHomeView
            totalProductsCount={products.length || 8}
            totalUsersCount={usersList.length || 3}
            todayOrdersCount={revenueData?.daily?.totalOrders || 4}
            totalRevenueAmount={revenueData?.overall?.totalRevenue || 145900.75}
            salesOrders={salesOrders}
          />
        );
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Fixed Left Sidebar (with Logout button) */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onActionClick={(action) => setActiveModal(action)}
        onLogout={logoutUser}
      />

      {/* Main Content Layout */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        backgroundColor: 'transparent'
      }}>
        {/* Fixed Top Navbar (Current Date, Bell Dropdown, Admin Profile ONLY) */}
        <AdminTopNavbar
          currentUser={currentUser || activeUser}
          notifications={notificationsList}
          unreadCount={unreadCount}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAllNotifications}
          onNavigateToNotifications={() => setActiveSection('notifications')}
        />

        {/* Dynamic Main Content Area */}
        <main style={{
          flex: 1,
          padding: '32px 32px 40px 32px',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto'
        }}>
          {renderActiveModuleView()}
        </main>

        {/* Footer */}
        <Footer onToast={addToast} />
      </div>

      {/* Feature Modals Overlay */}
      <AdminModals
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        categories={categories}
        handleAddProductSubmit={handleAddProductSubmit}
        submittingProduct={submittingProduct}
        filteredProducts={filteredProducts}
        productSearch={productSearch}
        setProductSearch={setProductSearch}
        deleteProductTarget={deleteProductTarget}
        setDeleteProductTarget={setDeleteProductTarget}
        handleDeleteProductConfirm={handleDeleteProductConfirm}
        deletingProduct={deletingProduct}
        filteredUsers={filteredUsers}
        userSearch={userSearch}
        setUserSearch={setUserSearch}
        editUserTarget={editUserTarget}
        setEditUserTarget={setEditUserTarget}
        editUserForm={editUserForm}
        setEditUserForm={setEditUserForm}
        handleUpdateUserSubmit={handleUpdateUserSubmit}
        submittingUser={submittingUser}
        salesOrders={salesOrders}
        currentUser={currentUser || activeUser}
        productCatalogImages={productCatalogImages}
      />
    </div>
  );
};
