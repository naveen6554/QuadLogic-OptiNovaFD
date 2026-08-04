import React, { useState, useEffect } from 'react';
import { 
  X, Glasses, ShoppingBag, CheckCircle, AlertCircle, Shield, Sparkles, Award, Plus, Minus, Info 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  const { addToCart, addToast } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!isOpen || !product) return null;

  const stock = product.stockQuantity ?? product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const pId = product.id || product.productId;
  const categoryName = product.category?.categoryName || product.categoryName || product.category?.name || 'Luxury Eyewear';
  const imageUrl = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : null;
  const formattedPrice = Number(product.price || 0).toLocaleString('en-IN');
  const totalPrice = (Number(product.price || 0) * quantity).toLocaleString('en-IN');

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      addToast('This product is currently out of stock and cannot be added.', 'error');
      return;
    }

    if (quantity > stock) {
      addToast(`Only ${stock} items available in stock.`, 'error');
      return;
    }

    setAdding(true);
    const result = await addToCart(pId, quantity, product.name);
    setAdding(false);

    if (result && result.success) {
      onClose();
    }
  };

  const handleIncrement = () => {
    if (quantity >= stock) {
      addToast(`Cannot select more than total stock (${stock} units available).`, 'info');
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content product-detail-modal" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: 760, width: '92%', borderRadius: '24px', overflow: 'hidden', padding: 0 }}
      >
        {/* Top Header */}
        <div 
          style={{ 
            display: 'flex', 
            justify: 'space-between', 
            alignItems: 'center', 
            padding: '1.25rem 1.75rem', 
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(20, 20, 28, 0.6)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span 
              style={{ 
                background: 'rgba(212, 175, 55, 0.15)', 
                color: 'var(--primary-gold)', 
                padding: '0.25rem 0.75rem', 
                borderRadius: 9999, 
                fontSize: '0.8rem', 
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              {categoryName.toUpperCase()}
            </span>
          </div>

          <button className="close-btn" onClick={onClose} title="Close Details">
            <X size={22} />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '1.75rem' }}>
          
          {/* Left Column: Image & Stock Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              style={{ 
                width: '100%', 
                height: '260px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid var(--border-subtle)', 
                display: 'flex', 
                alignItems: 'center', 
                justify: 'center', 
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Stock Badge Overlay */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 12, 
                  left: 12, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6,
                  padding: '0.35rem 0.75rem',
                  borderRadius: 9999,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: isOutOfStock ? 'rgba(251, 113, 133, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                  border: isOutOfStock ? '1px solid rgba(251, 113, 133, 0.4)' : '1px solid rgba(52, 211, 153, 0.4)',
                  color: isOutOfStock ? 'var(--accent-rose)' : '#34D399'
                }}
              >
                {isOutOfStock ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                <span>{isOutOfStock ? 'Out of Stock' : `In Stock (${stock} available)`}</span>
              </div>

              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div style={{ display: imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Glasses size={96} color="#D4AF37" strokeWidth={1.2} />
              </div>
            </div>

            {/* Quality Tags */}
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
              <div style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Shield size={14} color="#D4AF37" style={{ marginBottom: 4, display: 'block', margin: '0 auto 4px' }} />
                Anti-Blue Light
              </div>
              <div style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Award size={14} color="#D4AF37" style={{ marginBottom: 4, display: 'block', margin: '0 auto 4px' }} />
                German Optics
              </div>
              <div style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Sparkles size={14} color="#D4AF37" style={{ marginBottom: 4, display: 'block', margin: '0 auto 4px' }} />
                UV 400 Protection
              </div>
            </div>
          </div>

          {/* Right Column: Title, Description & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {product.name}
              </h2>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-gold)', marginBottom: '1.25rem' }}>
                ₹{formattedPrice}
              </div>

              {/* Product Description from DB */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={14} color="var(--primary-gold)" />
                  PRODUCT DESCRIPTION
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                  {product.description || 'Crafted with premium grade materials and precision engineered lenses designed for optical clarity and maximum eye comfort.'}
                </p>
              </div>
            </div>

            {/* Bottom Controls: Quantity Stepper & Add to Cart */}
            <div>
              {!isOutOfStock ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>Quantity:</span>
                  <div className="qty-stepper">
                    <button className="qty-btn" onClick={handleDecrement} disabled={quantity <= 1}>
                      <Minus size={14} />
                    </button>
                    <span className="qty-val">{quantity}</span>
                    <button className="qty-btn" onClick={handleIncrement} disabled={quantity >= stock}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    (Max: {stock})
                  </span>
                </div>
              ) : (
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.3)', borderRadius: 12, color: 'var(--accent-rose)', fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={18} />
                  <span>This product is currently out of stock and cannot be added to cart.</span>
                </div>
              )}

              <button 
                className="btn-primary" 
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem',
                  opacity: isOutOfStock ? 0.5 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  background: isOutOfStock ? 'rgba(255,255,255,0.08)' : undefined,
                  borderColor: isOutOfStock ? 'transparent' : undefined,
                  color: isOutOfStock ? 'var(--text-muted)' : undefined
                }}
              >
                {isOutOfStock ? (
                  <>
                    <AlertCircle size={18} />
                    Out of Stock
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    {adding ? 'Adding...' : `Add ${quantity} to Cart - ₹${totalPrice}`}
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
