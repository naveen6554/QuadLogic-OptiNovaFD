import React from 'react';
import { X, Heart, ShoppingBag, Trash2, Glasses, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WishlistModal = ({ isOpen, onClose }) => {
  const { wishlistItems, removeFromWishlist, clearWishlist, addToCart, addToast } = useAuth();

  if (!isOpen) return null;

  const handleMoveToCart = async (product) => {
    const pId = product.id || product.productId;
    const res = await addToCart(pId, 1, product.name);
    if (res && res.success) {
      removeFromWishlist(pId);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 110 }}>
      <div className="modal-container glass-card" style={{ maxWidth: '680px', width: '100%', padding: 0, overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(19, 27, 46, 0.95)' }}>
          <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFF' }}>
            <Heart size={22} color="#FB7185" fill="#FB7185" />
            <span>My Wishlist</span>
            <span style={{ 
              fontSize: '0.8rem', 
              background: 'rgba(251, 113, 133, 0.2)', 
              color: '#FB7185', 
              border: '1px solid rgba(251, 113, 133, 0.4)',
              padding: '0.15rem 0.6rem', 
              borderRadius: '9999px', 
              fontWeight: 700 
            }}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </span>
          </h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.5rem', maxHeight: '440px', overflowY: 'auto' }}>
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'rgba(251, 113, 133, 0.12)',
                border: '1px solid rgba(251, 113, 133, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <Heart size={36} color="#FB7185" />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFF', margin: '0 0 0.5rem 0' }}>Your Wishlist is Empty</h4>
              <p style={{ color: 'var(--text-muted, #94A3B8)', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto 1.5rem auto' }}>
                Save your favorite optical frames, sunglasses, and eyewear to view or purchase them later.
              </p>
              <button 
                className="btn-primary" 
                onClick={onClose}
                style={{ width: 'auto', padding: '0.6rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Browse Eyewear Catalogue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlistItems.map((product) => {
                const pId = product.id || product.productId;
                const imageUrl = (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : product.imageUrl;
                const categoryName = product.category?.categoryName || product.categoryName || product.category?.name || 'Eyewear';
                const stock = product.stockQuantity ?? product.stock ?? 0;
                const isOutOfStock = stock <= 0;

                return (
                  <div key={pId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem',
                    transition: 'all 0.2s ease'
                  }}>
                    {/* Left: Thumbnail & Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        background: '#131b2e',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Glasses size={28} color="#D4AF37" />
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          color: '#A78BFA', 
                          background: 'rgba(167, 139, 250, 0.15)', 
                          padding: '0.1rem 0.45rem', 
                          borderRadius: '4px',
                          display: 'inline-block',
                          marginBottom: '0.2rem'
                        }}>
                          {categoryName}
                        </span>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--primary-gold)', fontSize: '0.95rem' }}>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: isOutOfStock ? '#FB7185' : '#34D399', 
                            fontWeight: 600 
                          }}>
                            {isOutOfStock ? 'Out of stock' : 'In Stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={isOutOfStock}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: isOutOfStock ? 'rgba(255, 255, 255, 0.05)' : 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
                          color: isOutOfStock ? '#94A3B8' : '#000',
                          border: 'none',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ShoppingBag size={15} />
                        <span>Move to Cart</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(pId)}
                        title="Remove from Wishlist"
                        style={{
                          background: 'rgba(251, 113, 133, 0.12)',
                          border: '1px solid rgba(251, 113, 133, 0.3)',
                          color: '#FB7185',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease'
                        }}
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

        {/* Modal Footer */}
        {wishlistItems.length > 0 && (
          <div style={{ 
            padding: '1rem 1.5rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
            background: 'rgba(19, 27, 46, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={clearWishlist}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #94A3B8)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear All Wishlist Items
            </button>

            <button
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '0.45rem 1.25rem' }}
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
