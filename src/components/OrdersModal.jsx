import React, { useState, useEffect } from 'react';
import { Package, X, Glasses, CheckCircle2, Calendar, Star, ThumbsUp, MessageSquare, Download, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleDirectPdfDownload } from '../utils/downloadInvoice';
import { API_BASE_URL } from '../config/apiConfig';

export const OrdersModal = ({ isOpen, onClose }) => {
  const { token, currentUser, submitProductReview, getUserReviewForProduct, addToast } = useAuth();
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Active Order Detail View State
  const [viewingOrderDetail, setViewingOrderDetail] = useState(null);

  // Rating Modal state
  const [ratingTargetItem, setRatingTargetItem] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserOrders = async () => {
      setLoading(true);
      const activeToken = token || localStorage.getItem('optinova_token');

      let productsFound = [];
      let userRole = currentUser?.role || 'CUSTOMER';
      let userDisplay = currentUser?.username || currentUser?.firstName || currentUser?.email || 'Customer';

      // 0. Fetch Product Catalog for 100% exact product image matching
      let catalogImageMap = {};
      let catalogProductMap = {};
      try {
        const catalogResp = await fetch(`${API_BASE_URL}/api/v1/products?pageSize=100`);
        if (catalogResp.ok) {
          const catData = await catalogResp.json();
          const prods = catData?.data?.content || [];
          prods.forEach(p => {
            const pId = p.productId || p.id;
            const img = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : (p.images && p.images.length > 0 ? p.images[0].imageUrl : '');
            if (pId) {
              catalogProductMap[pId] = p;
              if (img) catalogImageMap[pId] = img;
            }
          });
        }
      } catch (e) {
        console.warn('Catalog fetch warning:', e);
      }

      // Read local storage saved orders
      const localSaved = JSON.parse(localStorage.getItem('optinova_user_orders') || '[]');
      const localMap = {};
      if (Array.isArray(localSaved)) {
        localSaved.forEach(item => {
          if (item.orderId) localMap[`ord-${item.orderId}`] = item;
          if (item.productId) localMap[`prod-${item.productId}`] = item;
          if (item.orderId && item.productId) localMap[`${item.orderId}-${item.productId}`] = item;
        });
      }

      try {
        if (activeToken && activeToken !== 'mock_jwt_token') {
          // 1. Fetch from GET /api/orders
          const response = await fetch(`${API_BASE_URL}/api/orders`, {
            headers: {
              'Authorization': `Bearer ${activeToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const json = await response.json();
            const root = json.data || json;
            userRole = root.role || userRole;
            userDisplay = root.username || userDisplay;

            let apiProds = [];
            if (root.orders?.products && Array.isArray(root.orders.products)) {
              apiProds = root.orders.products;
            } else if (Array.isArray(root.products)) {
              apiProds = root.products;
            }

            apiProds.forEach(p => {
              const pId = p.productId || 1;
              const catalogP = catalogProductMap[pId] || {};
              const matchedLocal = localMap[`${p.orderId}-${pId}`] || localMap[`ord-${p.orderId}`] || localMap[`prod-${pId}`];
              
              const rawImg = p.imageUrl || p.primaryImageUrl || matchedLocal?.imageUrl || catalogImageMap[pId] || (catalogP.imageUrls && catalogP.imageUrls[0]) || '';
              const resolvedImg = (typeof rawImg === 'string' && rawImg.trim() !== '' && !rawImg.includes('unsplash'))
                ? rawImg.trim()
                : (catalogImageMap[pId] || (catalogP.imageUrls && catalogP.imageUrls[0]) || '');

              productsFound.push({
                orderId: p.orderId || `ORD-${Date.now()}`,
                productId: pId,
                name: p.name || catalogP.name || matchedLocal?.name || 'OptiNova Eyewear Frame',
                description: p.description || catalogP.description || matchedLocal?.description || 'German engineered precision optics',
                category: p.category || catalogP.category?.categoryName || catalogP.category?.name || matchedLocal?.category || 'Eyewear',
                quantity: p.quantity || 1,
                pricePerUnit: p.pricePerUnit || catalogP.price || matchedLocal?.pricePerUnit || 0,
                totalPrice: p.totalPrice || matchedLocal?.totalPrice || ((p.pricePerUnit || catalogP.price || 0) * (p.quantity || 1)),
                imageUrl: resolvedImg,
                status: p.status || 'SUCCESS',
                orderDate: p.orderDate || new Date().toISOString()
              });
            });
          }

          // 2. Also fetch from GET /api/v1/orders/my-orders for detailed order items
          const fallbackResp = await fetch(`${API_BASE_URL}/api/v1/orders/my-orders`, {
            headers: {
              'Authorization': `Bearer ${activeToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (fallbackResp.ok) {
            const fallbackJson = await fallbackResp.json();
            const orderList = fallbackJson.data || fallbackJson;

            if (Array.isArray(orderList)) {
              const existingKeys = new Set(productsFound.map(p => `${p.orderId}-${p.productId}`));

              orderList.forEach(ord => {
                if (ord.orderItems && Array.isArray(ord.orderItems)) {
                  ord.orderItems.forEach(item => {
                    const pId = item.productId || item.product?.productId || item.product?.id || item.id || 1;
                    const key = `${ord.orderId || ord.id}-${pId}`;

                    if (!existingKeys.has(key)) {
                      const p = item.product || {};
                      const catalogP = catalogProductMap[pId] || {};
                      const matchedLocal = localMap[key] || localMap[`ord-${ord.orderId}`] || localMap[`prod-${pId}`];

                      let rawImg = item.primaryImageUrl || item.imageUrl || matchedLocal?.imageUrl || catalogImageMap[pId] || (p.images && p.images[0]?.imageUrl) || (p.imageUrls && p.imageUrls[0]) || (catalogP.imageUrls && catalogP.imageUrls[0]) || '';
                      const resolvedImg = (typeof rawImg === 'string' && rawImg.trim() !== '' && !rawImg.includes('unsplash'))
                        ? rawImg.trim()
                        : (catalogImageMap[pId] || (catalogP.imageUrls && catalogP.imageUrls[0]) || '');

                      productsFound.push({
                        orderId: ord.orderId || ord.id || `ORD-${Date.now()}`,
                        productId: pId,
                        name: item.productName || p.name || catalogP.name || matchedLocal?.name || 'OptiNova Eyewear Frame',
                        description: item.description || p.description || catalogP.description || matchedLocal?.description || 'German engineered precision optics',
                        category: item.categoryName || p.category?.categoryName || p.category?.name || catalogP.category?.categoryName || matchedLocal?.category || 'Eyewear',
                        quantity: item.quantity || 1,
                        pricePerUnit: item.pricePerUnit || item.price || p.price || catalogP.price || 0,
                        totalPrice: item.totalPrice || item.subtotal || ((item.pricePerUnit || p.price || catalogP.price || 0) * (item.quantity || 1)),
                        imageUrl: resolvedImg,
                        status: ord.status || 'SUCCESS',
                        orderDate: ord.createdAt || ord.orderDate || new Date().toISOString()
                      });
                      existingKeys.add(key);
                    }
                  });
                }
              });
            }
          }
        }
      } catch (err) {
        console.warn('Orders API fetch warning:', err);
      }

      // 3. Merge Local Storage saved orders for offline or missing items
      if (Array.isArray(localSaved) && localSaved.length > 0) {
        const existingKeys = new Set(productsFound.map(p => `${p.orderId}-${p.productId}`));
        localSaved.forEach(localItem => {
          const key = `${localItem.orderId}-${localItem.productId}`;
          if (!existingKeys.has(key)) {
            const pId = localItem.productId || 1;
            const catalogP = catalogProductMap[pId] || {};
            const rawImg = localItem.imageUrl || catalogImageMap[pId] || (catalogP.imageUrls && catalogP.imageUrls[0]) || '';
            const imgUrl = (typeof rawImg === 'string' && rawImg.trim() !== '' && !rawImg.includes('unsplash'))
              ? rawImg.trim()
              : (catalogImageMap[pId] || (catalogP.imageUrls && catalogP.imageUrls[0]) || '');

            productsFound.push({
              ...localItem,
              name: localItem.name || catalogP.name || 'OptiNova Eyewear Frame',
              description: localItem.description || catalogP.description || 'German engineered precision optics',
              category: localItem.category || catalogP.category?.categoryName || catalogP.category?.name || 'Eyewear',
              imageUrl: imgUrl
            });
            existingKeys.add(key);
          }
        });
      }

      setOrdersData({
        role: userRole,
        username: userDisplay,
        orders: { products: productsFound }
      });
      setLoading(false);
    };

    fetchUserOrders();
  }, [isOpen, token, currentUser]);

  if (!isOpen) return null;

  const productsList = ordersData?.orders?.products || [];
  const username = ordersData?.username || currentUser?.firstName || currentUser?.email || 'Customer';
  const role = ordersData?.role || 'CUSTOMER';

  const totalOrderedAmount = productsList.reduce((sum, item) => sum + Number(item.totalPrice || (item.pricePerUnit * item.quantity) || 0), 0);
  const totalOrderedItems = productsList.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  const totalOrdersCount = new Set(productsList.map(p => p.orderId)).size;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content orders-modal-container" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: 740, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon-box" style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
              <Package size={24} color="#34D399" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 className="modal-title" style={{ fontSize: '1.25rem', marginBottom: 0 }}>My Orders & Purchased Eyewear</h2>
                <span style={{ fontSize: '0.72rem', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                  {role}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
                Customer: <strong style={{ color: 'var(--text-main)' }}>{username}</strong>
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close Orders">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 0' }}>
          {loading ? (
            <div className="loading-box" style={{ padding: '3rem 1rem' }}>
              <div className="loading-spinner"></div>
              <p>Fetching your confirmed orders from server...</p>
            </div>
          ) : productsList.length === 0 ? (
            <div className="empty-state-box" style={{ padding: '3rem 1.5rem' }}>
              <Glasses size={56} color="var(--primary-gold)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto' }}>
                You haven't completed any orders yet. Add products to your cart and complete checkout to see your orders here!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: 4 }}>
              {productsList.map((item, idx) => {
                const rawImg = item.imageUrl || item.image_url || item.primaryImageUrl || (item.product?.imageUrls?.[0]) || (item.product?.images?.[0]?.imageUrl) || (item.images?.[0]?.imageUrl) || '';
                const itemImageUrl = (typeof rawImg === 'string' && rawImg.trim() !== '') ? rawImg.trim() : null;
                const formattedUnitPrice = item.pricePerUnit != null ? `₹${Number(item.pricePerUnit).toLocaleString('en-IN')}` : 'N/A';
                const formattedTotalPrice = item.totalPrice != null ? `₹${Number(item.totalPrice).toLocaleString('en-IN')}` : 'N/A';
                const formattedDate = item.orderDate ? new Date(item.orderDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                }) : 'Recently';

                return (
                  <div 
                    key={`${item.orderId}-${item.productId}-${idx}`}
                    style={{
                      background: 'var(--card-bg, rgba(255, 255, 255, 0.03))',
                      border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
                      borderRadius: 16,
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Header Row: Order ID & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingBottom: '0.6rem', borderBottom: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID:</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--primary-gold)', fontFamily: 'monospace' }}>#{item.orderId}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34D399', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle2 size={13} />
                        <span>{item.status || 'SUCCESS'}</span>
                      </div>
                    </div>

                    {/* Content Row: Image & Details */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      {/* Image Box - Renders exact productimage table URL */}
                      <div style={{ width: 90, height: 90, borderRadius: 14, background: '#0F172A', border: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {itemImageUrl ? (
                          <img 
                            src={itemImageUrl} 
                            alt={item.name || 'Product Image'} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div style={{ display: itemImageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                          <Glasses size={42} color="#D4AF37" strokeWidth={1.2} />
                        </div>
                      </div>

                      {/* Product Text Details */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.75rem', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.1)', padding: '1px 7px', borderRadius: 4, fontWeight: 500 }}>
                            {item.category || 'Eyewear'}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #FFF)' }}>
                          {item.name || 'OptiNova Eyewear Frame'}
                        </h4>
                        {item.description && (
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #AAA)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Row: Quantity, Unit Price, Total & Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                        <span>Qty: <strong style={{ color: 'var(--text-main)' }}>{item.quantity}</strong></span>
                        <span>Unit: <strong style={{ color: 'var(--text-main)' }}>{formattedUnitPrice}</strong></span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          <Calendar size={13} />
                          <span>{formattedDate}</span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-gold, #D4AF37)' }}>
                          {formattedTotalPrice}
                        </div>
                      </div>
                    </div>

                    {/* Customer Invoice & Order Actions Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      paddingTop: '0.65rem',
                      marginTop: '0.4rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                        {(item.status || '').toUpperCase() === 'PENDING' ? (
                          <span style={{ color: '#F59E0B', fontStyle: 'italic' }}>
                            ⚠ Invoice will be available after payment confirmation.
                          </span>
                        ) : (item.status || '').toUpperCase() === 'CANCELLED' ? (
                          <span style={{ color: '#EF4444', fontWeight: 600 }}>
                            ● Cancelled Invoice / Refund Statement
                          </span>
                        ) : (
                          <span style={{ color: '#10B981', fontWeight: 600 }}>
                            ✓ Payment Confirmed & Settled
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => setViewingOrderDetail(item)}
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.12)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#3B82F6',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Eye size={13} />
                          <span>View Order</span>
                        </button>

                        <button
                          onClick={() => handleDirectPdfDownload(item, addToast)}
                          disabled={(item.status || '').toUpperCase() === 'PENDING'}
                          style={{
                            backgroundColor: (item.status || '').toUpperCase() === 'PENDING' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(212, 175, 55, 0.15)',
                            border: (item.status || '').toUpperCase() === 'PENDING' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #D4AF37',
                            color: (item.status || '').toUpperCase() === 'PENDING' ? '#64748B' : '#D4AF37',
                            padding: '5px 14px',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: (item.status || '').toUpperCase() === 'PENDING' ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Download size={13} />
                          <span>Download Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Rate & Review Button / Submitted Review Badge for Customer */}
                    {(() => {
                      const existingReview = getUserReviewForProduct(item.productId, item.orderId);
                      if (existingReview) {
                        return (
                          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 10, padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', gap: '2px' }}>
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} size={13} color="#F59E0B" fill={s <= existingReview.rating ? '#F59E0B' : 'none'} />
                                ))}
                              </div>
                              <span style={{ fontSize: '0.78rem', color: '#FFF', fontStyle: 'italic' }}>"{existingReview.comment}"</span>
                            </div>
                            <button 
                              onClick={() => {
                                setRatingTargetItem(item);
                                setRatingStars(existingReview.rating);
                                setRatingComment(existingReview.comment);
                              }}
                              style={{ background: 'transparent', border: 'none', color: '#F59E0B', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', flexShrink: 0 }}
                            >
                              Edit Rating
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                            <button
                              onClick={() => {
                                setRatingTargetItem(item);
                                setRatingStars(5);
                                setRatingComment('');
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(212, 175, 55, 0.12) 100%)',
                                border: '1px solid #F59E0B',
                                color: '#F59E0B',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <Star size={14} fill="#F59E0B" color="#F59E0B" />
                              <span>Rate & Review Product</span>
                            </button>
                          </div>
                        );
                      }
                    })()}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {productsList.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Amount Ordered
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-gold, #D4AF37)' }}>
                  ₹{totalOrderedAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <div style={{ paddingLeft: '1rem', borderLeft: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main, #FFF)' }}>{totalOrderedItems}</strong> {totalOrderedItems === 1 ? 'item' : 'items'} across <strong style={{ color: 'var(--text-main, #FFF)' }}>{totalOrdersCount}</strong> {totalOrdersCount === 1 ? 'order' : 'orders'}
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <button className="btn-primary" style={{ width: 'auto', padding: '0.65rem 1.5rem' }} onClick={onClose}>
            Close Orders
          </button>
        </div>

        {/* Sub-Modal: Rate & Review Dialog for Received Order Item */}
        {ratingTargetItem && (
          <div className="modal-overlay" style={{ display: 'flex', zIndex: 120 }}>
            <div className="modal-container glass-card" style={{ maxWidth: '480px', width: '100%', padding: '1.5rem', background: 'rgba(19, 27, 46, 0.98)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
              <div className="modal-header" style={{ marginBottom: '1rem' }}>
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFF' }}>
                  <Star size={20} color="#F59E0B" fill="#F59E0B" />
                  <span>Rate & Review Received Item</span>
                </h3>
                <button className="close-btn" onClick={() => setRatingTargetItem(null)}><X size={18} /></button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#FFF', marginBottom: '0.25rem' }}>
                  {ratingTargetItem.name}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Order #{ratingTargetItem.orderId} • Delivered Order Item
                </p>

                {/* Interactive 5-Star Selection */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '1.25rem 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingStars(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        transform: ratingStars >= star ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Star 
                        size={32} 
                        color="#F59E0B" 
                        fill={ratingStars >= star ? '#F59E0B' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F59E0B' }}>
                  {ratingStars === 5 ? '⭐⭐⭐⭐⭐ Excellent' : ratingStars === 4 ? '⭐⭐⭐⭐ Great' : ratingStars === 3 ? '⭐⭐⭐ Good' : '⭐⭐ Fair'}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Your Customer Feedback / Review</label>
                <textarea
                  className="form-input form-input-no-icon"
                  rows="3"
                  placeholder="Share your experience regarding optical frame fit, lens clarity, or build quality..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setRatingTargetItem(null)}>Cancel</button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ width: 'auto', padding: '0.55rem 1.4rem', background: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 100%)', color: '#000', fontWeight: 800 }}
                  onClick={() => {
                    submitProductReview({
                      productId: ratingTargetItem.productId,
                      orderId: ratingTargetItem.orderId,
                      productName: ratingTargetItem.name,
                      rating: ratingStars,
                      comment: ratingComment.trim() || 'Great eyewear and excellent build quality!',
                      username: currentUser?.firstName || currentUser?.username || 'Verified Customer'
                    });
                    setRatingTargetItem(null);
                  }}
                >
                  Submit Customer Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Preview & Download Modal Overlay */}
      </div>
    </div>
  );
};
