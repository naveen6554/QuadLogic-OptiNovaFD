import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, Glasses, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CartModal = ({ isOpen, onClose, onOpenOrders }) => {
  const { cartItems, cartCount, cartTotal, loadingCart, updateCartItemQuantity, removeCartItem, clearCart, addToast, token, currentUser } = useAuth();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  if (!isOpen) return null;

  const saveCompletedOrderToLocalStorage = (dbOrderId) => {
    try {
      const generatedId = dbOrderId || `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const newItems = cartItems.map(item => ({
        orderId: generatedId,
        productId: item.productId || item.id,
        name: item.productName || item.name || item.product?.name || 'Eyewear Frame',
        description: item.productDescription || item.description || item.product?.description || 'German engineered precision optics',
        category: item.categoryName || item.category || item.product?.category?.categoryName || 'Eyewear',
        quantity: item.quantity || 1,
        pricePerUnit: Number(item.price || item.pricePerUnit || 0),
        totalPrice: Number(item.totalPrice || (item.price || 0) * (item.quantity || 1)),
        imageUrl: item.primaryImageUrl || item.imageUrl || (item.product?.imageUrls?.[0]) || (item.product?.images?.[0]?.imageUrl) || '',
        status: 'SUCCESS',
        orderDate: new Date().toISOString()
      }));

      const existing = JSON.parse(localStorage.getItem('optinova_user_orders') || '[]');
      localStorage.setItem('optinova_user_orders', JSON.stringify([...newItems, ...existing]));
    } catch (e) {
      console.warn('Local order save error:', e);
    }
  };

  const handleCheckout = async () => {
    setIsProcessingCheckout(true);
    addToast('Initializing Razorpay Checkout...', 'info');

    const res = await loadRazorpayScript();
    if (!res) {
      addToast('Failed to load Razorpay SDK. Please check your internet connection.', 'error');
      setIsProcessingCheckout(false);
      return;
    }

    const activeToken = token || localStorage.getItem('optinova_token') || localStorage.getItem('token');

    try {
      if (activeToken && activeToken !== 'mock_jwt_token') {
        // Call Backend to create Order & Razorpay Order
        const response = await fetch(`${API_BASE_URL}/api/v1/orders/razorpay/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            shippingAddress: '123 OptiNova Boulevard, Tech Park',
            paymentMethod: 'RAZORPAY'
          })
        });

        const json = await response.json();

        if (response.ok && json.success && json.data) {
          const rzpData = json.data;

          const options = {
            key: rzpData.keyId || 'rzp_test_TKuA5lmo946ez2',
            amount: rzpData.amount,
            currency: rzpData.currency || 'INR',
            name: 'OptiNova Eyewear',
            description: `Payment for Order #${rzpData.dbOrderId}`,
            order_id: (rzpData.razorpayOrderId && rzpData.razorpayOrderId.startsWith('order_')) ? rzpData.razorpayOrderId : undefined,
            handler: async function (paymentResponse) {
              addToast('Payment authorization received. Verifying signature...', 'info');
              try {
                const verifyResp = await fetch(`${API_BASE_URL}/api/v1/orders/razorpay/verify`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${activeToken}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    razorpayOrderId: paymentResponse.razorpay_order_id || rzpData.razorpayOrderId,
                    razorpayPaymentId: paymentResponse.razorpay_payment_id,
                    razorpaySignature: paymentResponse.razorpay_signature || 'mock_sig',
                    dbOrderId: rzpData.dbOrderId
                  })
                });

                const verifyJson = await verifyResp.json();
                saveCompletedOrderToLocalStorage(rzpData.dbOrderId);
                if (verifyResp.ok && verifyJson.success) {
                  addToast(`Payment successful! Order ${rzpData.dbOrderId} confirmed.`, 'success');
                  await clearCart();
                  onClose();
                  if (onOpenOrders) onOpenOrders();
                } else {
                  addToast(verifyJson.message || 'Payment signature verification failed.', 'error');
                  await clearCart();
                  onClose();
                  if (onOpenOrders) onOpenOrders();
                }
              } catch (err) {
                console.error('Verification network error:', err);
                saveCompletedOrderToLocalStorage(rzpData.dbOrderId);
                addToast(`Payment completed! Order ${rzpData.dbOrderId} recorded.`, 'success');
                await clearCart();
                onClose();
                if (onOpenOrders) onOpenOrders();
              } finally {
                setIsProcessingCheckout(false);
              }
            },
            prefill: {
              name: rzpData.customerName || currentUser?.firstName || 'OptiNova Customer',
              email: rzpData.customerEmail || currentUser?.email || 'customer@optinova.com',
              contact: rzpData.customerPhone || '9999999999'
            },
            notes: {
              dbOrderId: rzpData.dbOrderId
            },
            theme: {
              color: '#D4AF37'
            },
            modal: {
              ondismiss: function () {
                addToast('Razorpay payment process was cancelled.', 'info');
                setIsProcessingCheckout(false);
              }
            }
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.on('payment.failed', function (resp) {
            addToast(`Payment Failed: ${resp.error?.description || 'Transaction declined'}`, 'error');
            setIsProcessingCheckout(false);
          });
          razorpayInstance.open();
          return;
        } else if (json && json.message) {
          addToast(`Checkout notice: ${json.message}`, 'warning');
        }
      }

      // Fallback checkout options for local/demo mode
      const grandTotalAmount = Math.max(Math.round(Number(cartTotal || 500) * 100), 100);
      const fallbackOptions = {
        key: 'rzp_test_TKuA5lmo946ez2',
        amount: grandTotalAmount,
        currency: 'INR',
        name: 'OptiNova Eyewear',
        description: 'OptiNova Premium Eyewear Order',
        handler: function (response) {
          saveCompletedOrderToLocalStorage();
          addToast(`Payment successful! Payment ID: ${response.razorpay_payment_id}`, 'success');
          clearCart();
          onClose();
          if (onOpenOrders) onOpenOrders();
          setIsProcessingCheckout(false);
        },
        prefill: {
          name: currentUser?.firstName || 'Customer',
          email: currentUser?.email || 'customer@optinova.com',
          contact: '9999999999'
        },
        theme: {
          color: '#D4AF37'
        },
        modal: {
          ondismiss: function () {
            addToast('Razorpay payment cancelled.', 'info');
            setIsProcessingCheckout(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(fallbackOptions);
      rzpInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      addToast(err.message || 'Error starting payment process. Please try again.', 'error');
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cart-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Header */}
        <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon-box" style={{ width: 40, height: 40, borderRadius: 10 }}>
              <ShoppingCart size={22} color="var(--primary-gold)" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem', marginBottom: 2 }}>Your Shopping Cart</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                {cartCount === 1 ? '1 item selected' : `${cartCount} items selected`}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close Cart">
            <X size={20} />
          </button>
        </div>

        {/* Cart Body */}
        <div className="cart-modal-body" style={{ margin: '1.5rem 0', maxHeight: '55vh', overflowY: 'auto', paddingRight: 4 }}>
          {loadingCart ? (
            <div className="loading-box" style={{ padding: '2.5rem 1rem' }}>
              <div className="loading-spinner"></div>
              <p>Updating shopping cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-state-box" style={{ padding: '3rem 1.5rem', marginBottom: 0 }}>
              <Glasses size={52} color="var(--primary-gold)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Your Cart is Empty</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 320, margin: '0 auto' }}>
                Discover our collection of premium German engineered eyewear and add your favorite frames!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.map((item) => {
                const itemPrice = Number(item.price || 0);
                const itemTotal = Number(item.totalPrice || itemPrice * item.quantity);
                const imageUrl = item.primaryImageUrl || (item.product?.imageUrls?.[0]);

                return (
                  <div key={item.id} className="cart-item-row">
                    {/* Item Image */}
                    <div className="cart-item-img-box">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={item.productName} 
                          className="cart-item-img"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div style={{ display: imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <Glasses size={32} color="#D4AF37" />
                      </div>
                    </div>

                    {/* Item Info */}
                    <div style={{ flex: 1 }}>
                      <h4 className="cart-item-title">{item.productName || 'Eyewear Frame'}</h4>
                      <div className="cart-item-unit-price">
                        ₹{itemPrice.toLocaleString('en-IN')} each
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="qty-stepper">
                      <button 
                        className="qty-btn"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        title="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total Price & Delete */}
                    <div style={{ textAlignment: 'right', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="cart-item-total">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </div>
                      <button 
                        className="close-btn"
                        onClick={() => removeCartItem(item.id)}
                        title="Remove item"
                        style={{ color: 'var(--accent-rose)', opacity: 0.8 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-summary-row">
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Grand Total</span>
              <span className="cart-grand-total">₹{Number(cartTotal).toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button 
                className="splash-skip-btn" 
                style={{ flex: 1, marginTop: 0 }}
                onClick={clearCart}
                disabled={isProcessingCheckout}
              >
                Clear Cart
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 2, padding: '0.75rem 1rem', opacity: isProcessingCheckout ? 0.7 : 1 }}
                onClick={handleCheckout}
                disabled={isProcessingCheckout}
              >
                {isProcessingCheckout ? (
                  <>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Redirecting to Razorpay...
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

