import React, { useState, useEffect } from 'react';
import { 
  AiOutlineShoppingCart, 
  AiOutlineHeart, 
  AiFillHeart, 
  AiOutlineCloseCircle,
  AiOutlineMinus,
  AiOutlinePlus
} from 'react-icons/ai';
import { BsStarFill, BsStar, BsEye, BsShare } from 'react-icons/bs';
import { FiTruck, FiShield, FiAward, FiZoomIn } from 'react-icons/fi';
import { MdVerified, MdSecurity, MdRefresh } from 'react-icons/md';
import { IoFlashOutline } from 'react-icons/io5';
import './QuickView.css';

const QuickView = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Generate multiple product images (in real app, these would come from product data)
  const productImages = product ? [
    product.Img,
    product.Img2 || product.Img, // Use secondary image if available
    product.Img3 || product.Img, // Use tertiary image if available
    product.Img4 || product.Img  // Use quaternary image if available
  ] : [];

  const variants = [
    { id: 'default', name: 'Default', color: '#4285f4' },
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'blue', name: 'Blue', color: '#007AFF' },
    { id: 'red', name: 'Red', color: '#e74c3c' }
  ];

  // Calculate discount percentage
  const originalPrice = product ? parseFloat(product.Price) * 1.25 : 0;
  const currentPrice = product ? parseFloat(product.Price) : 0;
  const discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelectedImage(0);
      setQuantity(1);
      setIsZoomed(false);
      setSelectedVariant('default');
      setShowFullDescription(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => Math.min(prev + 1, 10)); // Max 10 items
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product && onAddToCart) {
      setIsAddingToCart(true);
      
      // Simulate API call delay
      setTimeout(() => {
        onAddToCart({ 
          ...product, 
          quantity, 
          variant: selectedVariant,
          selectedColor: variants.find(v => v.id === selectedVariant)?.name || 'Default'
        });
        setIsAddingToCart(false);
        
        // Show success feedback
        const button = document.querySelector('.add-to-cart');
        if (button) {
          button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
          button.innerHTML = '✓ Added to Cart!';
          setTimeout(() => {
            button.style.background = 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)';
            button.innerHTML = `<svg><use href="#cart-icon"></use></svg> Add to Cart • $${(currentPrice * quantity).toFixed(0)}`;
          }, 2000);
        }
      }, 500);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.Title,
          text: `Check out this ${product.Title} for only $${product.Price}!`,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={i} style={{ color: '#ffc107' }} />);
    }
    if (hasHalfStar) {
      stars.push(<BsStarFill key="half" style={{ color: '#ffc107', opacity: 0.5 }} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<BsStar key={i} style={{ color: '#ddd' }} />);
    }
    return stars;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="quickview-overlay" style={overlayStyles}>
      <div className="quickview-backdrop" onClick={onClose} style={backdropStyles}></div>
      <div className="quickview-container" style={containerStyles}>
        <button className="quickview-close" onClick={onClose} style={closeButtonStyles}>
          <AiOutlineCloseCircle />
        </button>
        
        <div className="quickview-content" style={contentStyles}>
          {/* Image Section */}
          <div className="quickview-images" style={imagesSectionStyles}>
            <div className="main-image-container" style={mainImageContainerStyles}>
              <div 
                className={`main-image ${isZoomed ? 'zoomed' : ''}`} 
                style={mainImageStyles}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.Title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in'
                  }}
                />
                <div className="image-overlay" style={imageOverlayStyles}>
                  <FiZoomIn style={{ marginRight: '5px' }} />
                  <span>Click to zoom</span>
                </div>
              </div>
              <div className="image-badges" style={imageBadgesStyles}>
                {product.isNew && <span className="badge new" style={badgeNewStyles}>NEW</span>}
                {discountPercentage > 0 && (
                  <span className="badge sale" style={badgeSaleStyles}>-{discountPercentage}%</span>
                )}
              </div>
            </div>
            
            <div className="thumbnail-images" style={thumbnailsStyles}>
              {productImages.map((img, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    ...thumbnailStyles,
                    border: selectedImage === index ? '3px solid #007AFF' : '2px solid transparent',
                    transform: selectedImage === index ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  <img src={img} alt={`View ${index + 1}`} style={thumbnailImageStyles} />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="quickview-info" style={infoSectionStyles}>
            <div className="product-header" style={productHeaderStyles}>
              <div className="product-category" style={categoryStyles}>{product.Cat}</div>
              <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
                style={{
                  ...favoriteButtonStyles,
                  background: isFavorite ? '#e74c3c' : 'transparent',
                  color: isFavorite ? 'white' : '#666',
                  borderColor: isFavorite ? '#e74c3c' : '#ddd'
                }}
              >
                {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
              </button>
            </div>

            <h1 className="product-title" style={titleStyles}>{product.Title}</h1>
            
            <div className="product-rating" style={ratingStyles}>
              <div className="stars" style={{ display: 'flex', gap: '2px' }}>
                {renderStars(4.5)}
              </div>
              <span className="rating-text" style={ratingTextStyles}>(4.5 • 128 reviews)</span>
              <a href="#reviews" className="view-reviews" style={viewReviewsStyles}>View all reviews</a>
            </div>

            <div className="product-price" style={priceStyles}>
              <span className="current-price" style={currentPriceStyles}>${currentPrice}</span>
              {discountPercentage > 0 && (
                <>
                  <span className="original-price" style={originalPriceStyles}>${originalPrice.toFixed(0)}</span>
                  <span className="discount-badge" style={discountBadgeStyles}>Save {discountPercentage}%</span>
                </>
              )}
            </div>

            <div className="product-description" style={descriptionStyles}>
              <p style={{ color: '#666', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                {showFullDescription 
                  ? `Experience cutting-edge technology with the ${product.Title}. This premium device features advanced processors, stunning display quality, and professional-grade camera systems for the ultimate user experience. Built with premium materials and designed for performance, reliability, and style.`
                  : `Experience cutting-edge technology with the ${product.Title}. This premium device features advanced processors, stunning display quality...`
                }
              </p>
              <button 
                className="read-more"
                onClick={() => setShowFullDescription(!showFullDescription)}
                style={readMoreStyles}
              >
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            </div>

            {/* Color Variants */}
            <div className="product-variants" style={{ marginBottom: '20px' }}>
              <h4 style={variantTitleStyles}>Color:</h4>
              <div className="variant-options" style={variantOptionsStyles}>
                {variants.map(variant => (
                  <button
                    key={variant.id}
                    className={`variant-option ${selectedVariant === variant.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(variant.id)}
                    style={{
                      ...variantOptionStyles,
                      backgroundColor: variant.color,
                      borderColor: selectedVariant === variant.id ? '#007AFF' : '#ddd',
                      transform: selectedVariant === variant.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                    title={variant.name}
                  >
                    {selectedVariant === variant.id && <MdVerified style={{ color: variant.color === '#ffffff' ? '#333' : '#fff' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section" style={{ marginBottom: '25px' }}>
              <h4 style={variantTitleStyles}>Quantity:</h4>
              <div className="quantity-controls" style={quantityControlsStyles}>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  style={{
                    ...quantityButtonStyles,
                    opacity: quantity <= 1 ? 0.5 : 1,
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <AiOutlineMinus />
                </button>
                <span className="quantity-display" style={quantityDisplayStyles}>{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= 10}
                  style={{
                    ...quantityButtonStyles,
                    opacity: quantity >= 10 ? 0.5 : 1,
                    cursor: quantity >= 10 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <AiOutlinePlus />
                </button>
              </div>
              <span style={{ fontSize: '12px', color: '#666', marginTop: '5px', display: 'block' }}>
                Maximum 10 items per order
              </span>
            </div>

            {/* Action Buttons */}
            <div className="quickview-actions" style={actionsStyles}>
              <button 
                className="btn-primary add-to-cart" 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                style={{
                  ...primaryButtonStyles,
                  opacity: isAddingToCart ? 0.7 : 1,
                  cursor: isAddingToCart ? 'not-allowed' : 'pointer'
                }}
              >
                {isAddingToCart ? (
                  <>
                    <MdRefresh style={{ animation: 'spin 1s linear infinite' }} />
                    Adding...
                  </>
                ) : (
                  <>
                    <AiOutlineShoppingCart />
                    Add to Cart • ${(currentPrice * quantity).toFixed(0)}
                  </>
                )}
              </button>
              <button className="btn-secondary share-btn" onClick={handleShare} style={secondaryButtonStyles}>
                <BsShare /> Share
              </button>
            </div>

            {/* Product Features */}
            <div className="product-features" style={featuresStyles}>
              <div className="feature-item" style={featureItemStyles}>
                <FiTruck style={featureIconStyles} />
                <div>
                  <strong style={featureStrongStyles}>Free Shipping</strong>
                  <p style={featurePStyles}>On orders over $100</p>
                </div>
              </div>
              <div className="feature-item" style={featureItemStyles}>
                <FiShield style={featureIconStyles} />
                <div>
                  <strong style={featureStrongStyles}>2 Year Warranty</strong>
                  <p style={featurePStyles}>Full coverage included</p>
                </div>
              </div>
              <div className="feature-item" style={featureItemStyles}>
                <FiAward style={featureIconStyles} />
                <div>
                  <strong style={featureStrongStyles}>Premium Quality</strong>
                  <p style={featurePStyles}>Certified authentic</p>
                </div>
              </div>
              <div className="feature-item" style={featureItemStyles}>
                <IoFlashOutline style={featureIconStyles} />
                <div>
                  <strong style={featureStrongStyles}>Fast Processing</strong>
                  <p style={featurePStyles}>Same day dispatch</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="trust-indicators" style={trustIndicatorsStyles}>
              <div className="trust-item" style={trustItemStyles}>
                <MdSecurity style={{ fontSize: '20px', color: '#28a745' }} />
                <span>Secure Payment</span>
              </div>
              <div className="trust-item" style={trustItemStyles}>
                <MdVerified style={{ fontSize: '20px', color: '#28a745' }} />
                <span>Verified Seller</span>
              </div>
              <div className="trust-item" style={trustItemStyles}>
                <FiTruck style={{ fontSize: '20px', color: '#28a745' }} />
                <span>Fast Delivery</span>
              </div>
              <div className="trust-item" style={trustItemStyles}>
                <FiShield style={{ fontSize: '20px', color: '#28a745' }} />
                <span>Protected Purchase</span>
              </div>
            </div>

            {/* Additional Product Info */}
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              background: '#f8f9fa', 
              borderRadius: '12px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>SKU:</strong> {product.id || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Category:</strong> {product.Cat}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Availability:</strong> <span style={{ color: '#28a745' }}>✓ In Stock</span>
              </div>
              <div>
                <strong>Estimated Delivery:</strong> 2-3 business days
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Styles
const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  animation: 'fadeIn 0.3s ease-out'
};

const backdropStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)'
};

const containerStyles = {
  position: 'relative',
  background: 'white',
  borderRadius: '20px',
  maxWidth: '1200px',
  width: '100%',
  maxHeight: '90vh',
  overflow: 'hidden',
  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
  animation: 'slideUp 0.4s ease-out'
};

const closeButtonStyles = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 10,
  background: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '20px',
  color: '#333',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(10px)'
};

const contentStyles = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  height: '100%',
  maxHeight: '90vh'
};

const imagesSectionStyles = {
  padding: '30px',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const mainImageContainerStyles = {
  position: 'relative',
  flex: 1,
  borderRadius: '15px',
  overflow: 'hidden',
  background: 'white',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
};

const mainImageStyles = {
  width: '100%',
  height: '400px',
  position: 'relative',
  overflow: 'hidden'
};

const imageOverlayStyles = {
  position: 'absolute',
  bottom: '15px',
  right: '15px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '12px',
  opacity: 0,
  transition: 'opacity 0.3s ease'
};

const imageBadgesStyles = {
  position: 'absolute',
  top: '15px',
  left: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const badgeNewStyles = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  color: 'white'
};

const badgeSaleStyles = {
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: '600',
  textTransform: 'uppercase',
  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  color: 'white'
};

const thumbnailsStyles = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'center'
};

const thumbnailStyles = {
  width: '60px',
  height: '60px',
  borderRadius: '8px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const thumbnailImageStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover'
};

const infoSectionStyles = {
  padding: '30px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const productHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const categoryStyles = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '15px',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase'
};

const favoriteButtonStyles = {
  border: '2px solid #ddd',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '18px',
  transition: 'all 0.3s ease'
};

const titleStyles = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#333',
  margin: 0,
  lineHeight: '1.3'
};

const ratingStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap'
};

const ratingTextStyles = {
  color: '#666',
  fontSize: '14px'
};

const viewReviewsStyles = {
  color: '#007AFF',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500'
};

const priceStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  flexWrap: 'wrap'
};

const currentPriceStyles = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#e74c3c'
};

const originalPriceStyles = {
  fontSize: '20px',
  color: '#999',
  textDecoration: 'line-through'
};

const discountBadgeStyles = {
  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600'
};

const descriptionStyles = {
  color: '#666',
  lineHeight: '1.6'
};

const readMoreStyles = {
  background: 'none',
  border: 'none',
  color: '#007AFF',
  cursor: 'pointer',
  fontWeight: '500',
  padding: 0,
  marginTop: '5px'
};

const variantTitleStyles = {
  margin: '0 0 10px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#333'
};

const variantOptionsStyles = {
  display: 'flex',
  gap: '10px'
};

const variantOptionStyles = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  border: '3px solid #ddd',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  fontSize: '16px'
};

const quantityControlsStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  background: '#f8f9fa',
  padding: '10px',
  borderRadius: '12px',
  width: 'fit-content'
};

const quantityButtonStyles = {
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '8px',
  width: '35px',
  height: '35px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const quantityDisplayStyles = {
  fontSize: '18px',
  fontWeight: '600',
  minWidth: '30px',
  textAlign: 'center'
};

const actionsStyles = {
  display: 'flex',
  gap: '15px'
};

const primaryButtonStyles = {
  flex: 1,
  background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
  color: 'white',
  border: 'none',
  padding: '15px 25px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'all 0.3s ease'
};

const secondaryButtonStyles = {
  background: 'white',
  color: '#333',
  border: '2px solid #ddd',
  padding: '15px 25px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.3s ease'
};

const featuresStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  padding: '20px',
  background: '#f8f9fa',
  borderRadius: '12px'
};

const featureItemStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const featureIconStyles = {
  fontSize: '20px',
  color: '#007AFF',
  minWidth: '20px'
};

const featureStrongStyles = {
  fontSize: '14px',
  color: '#333',
  marginBottom: '2px',
  display: 'block'
};

const featurePStyles = {
  fontSize: '12px',
  color: '#666',
  margin: 0
};

const trustIndicatorsStyles = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '15px',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: '12px'
};

const trustItemStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5px',
  fontSize: '12px',
  color: '#666'
};

export default QuickView;