import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight, BsStarFill, BsStar } from "react-icons/bs";
import { FiTruck, FiShield, FiHeadphones, FiGift } from "react-icons/fi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";
import { BiHeadphone } from "react-icons/bi";
import {
  AiOutlineShoppingCart,
  AiOutlineCloseCircle,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { BsEye } from "react-icons/bs";
import {
  MdFlashOn,
  MdTrendingUp,
  MdVerified,
  MdSecurity,
  MdLocalShipping,
} from "react-icons/md";
import { FaRocket, FaAward, FaUsers, FaChartLine } from "react-icons/fa";
import Homeproduct from "../../components/HomeProduct/HomeProducts";
import Notification from "../../utils/Notification/Notification";
import { useNotification } from "../../hook/useNotification";
import QuickView from "../../components/QuickView/QuickView"; // Import QuickView component
import ip13 from '../../assets/images/ip13.jpg';
import logoh from '../../assets/images/logo huawei.jpg';
import logoi from '../../assets/images/logo ip.jpg';
import logov from '../../assets/images/logo vivo.jpg';
import logos from '../../assets/images/logo samsung.jpg';
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide2.jpg';
import slide3 from '../../assets/images/slide3.jpg';
import iklanbawah2 from '../../assets/images/iklanbawah2.jpg';
import "./Home.css";

const Home = ({ detail, view, close, setClose, addtocart, cartCount }) => {
  const { notifications, showNotification, removeNotification } =
    useNotification();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateCart, setAnimateCart] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isScrolled, setIsScrolled] = useState(false);
  const featuresRef = useRef(null);
  const [featuresInView, setFeaturesInView] = useState(false);

  // QuickView States - Enhanced
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Hero slider data dengan lebih banyak slide
  const heroSlides = [
    {
      id: 1,
      title: "Revolutionary Technology 2025",
      subtitle: "Experience the Future Today",
      description:
        "Discover cutting-edge smartphones with AI-powered cameras, lightning-fast processors, and revolutionary features that redefine mobile technology.",
      image: slide1,
      buttonText: "Explore Now",
      badge: "🚀 New Launch",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: "Premium Audio Revolution",
      subtitle: "Immersive Sound Experience",
      description:
        "Professional-grade headphones and wireless earbuds with noise cancellation, spatial audio, and crystal-clear sound quality.",
      image: slide2,
      buttonText: "Listen Now",
      badge: "🎵 Best Seller",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: "Smart Lifestyle Accessories",
      subtitle: "Power Your Digital Life",
      description:
        "From power banks to smartwatches, discover accessories that seamlessly integrate with your lifestyle and boost productivity.",
      image: slide3,
      buttonText: "Shop Collection",
      badge: "⚡ Limited Time",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: 4,
      title: "Gaming Excellence",
      subtitle: "Next-Level Performance",
      description:
        "High-performance gaming devices and accessories designed for competitive gaming and immersive entertainment experiences.",
      image: iklanbawah2,
      buttonText: "Game On",
      badge: "🎮 Pro Series",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
  ];

  // Enhanced brand categories
  const brandCategories = [
    {
      name: "iPhone",
      logo: logoi,
      products: 23,
      trending: true,
      description: "Premium smartphones",
      color: "#007AFF",
    },
    {
      name: "Samsung",
      logo: logos,
      products: 63,
      trending: true,
      description: "Innovation technology",
      color: "#1428A0",
    },
    {
      name: "Huawei",
      logo: logoh,
      products: 18,
      trending: false,
      description: "Smart devices",
      color: "#FF0000",
    },
    {
      name: "Vivo",
      logo: logov,
      products: 52,
      trending: true,
      description: "Camera focused",
      color: "#4285F4",
    },
  ];

  // Enhanced interactive features dengan animasi dan efek
  const features = [
    {
      icon: <FiTruck />,
      title: "Free Shipping",
      description: "Order above $1000",
      color: "#e44c8c",
      bgGradient: "linear-gradient(135deg, #e44c8c, #ff6b9d)",
      delay: 0,
      stats: "24h Delivery",
    },
    {
      icon: <FiShield />,
      title: "Return & Refund",
      description: "Money Back Guarantee",
      color: "#0989ff",
      bgGradient: "linear-gradient(135deg, #0989ff, #4facfe)",
      delay: 100,
      stats: "30 Days Policy",
    },
    {
      icon: <FiGift />,
      title: "Member Discount",
      description: "On every Order",
      color: "#28a745",
      bgGradient: "linear-gradient(135deg, #28a745, #20bf6b)",
      delay: 200,
      stats: "Up to 50% Off",
    },
    {
      icon: <FiHeadphones />,
      title: "24/7 Support",
      description: "Always here to help",
      color: "#ff6b35",
      bgGradient: "linear-gradient(135deg, #ff6b35, #f7931e)",
      delay: 300,
      stats: "Live Chat",
    },
  ];

  // Stats counter untuk interaktivitas
  const stats = [
    {
      icon: <FaUsers />,
      number: "50K+",
      label: "Happy Customers",
      color: "#667eea",
    },
    { icon: <FaAward />, number: "1000+", label: "Products", color: "#f093fb" },
    { icon: <FaRocket />, number: "99.9%", label: "Uptime", color: "#4facfe" },
    {
      icon: <FaChartLine />,
      number: "24/7",
      label: "Support",
      color: "#fa709a",
    },
  ];

  // Intersection Observer untuk animasi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFeaturesInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Simulate loading dengan progress
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Enhanced auto-slide dengan pause on hover
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    // Set products dengan shuffle untuk variasi
    const shuffledProducts = [...Homeproduct].sort(() => Math.random() - 0.5);
    setFeaturedProducts(shuffledProducts.slice(0, 8));
    setTrendingProducts(shuffledProducts.slice(8, 16));

    return () => {
      clearTimeout(timer);
      clearInterval(slideTimer);
    };
  }, []);

  // QuickView Handlers - Enhanced dan Optimized
  const handleQuickView = (product) => {
    // Enhanced product data dengan fallback values
    const enhancedProduct = {
      ...product,
      id: product.id || Math.random().toString(36).substr(2, 9),
      rating: product.rating || 4.5,
      reviews: product.reviews || Math.floor(Math.random() * 200) + 50,
      description: product.description || `Experience the premium quality of ${product.Title}. This product features cutting-edge technology, superior build quality, and exceptional performance that meets all your needs.`,
      features: product.features || [
        "Premium Build Quality",
        "Advanced Technology",
        "2 Year Warranty",
        "Free Shipping"
      ],
      variants: product.variants || [
        { id: 'default', name: 'Default', color: '#4F46E5' },
        { id: 'black', name: 'Black', color: '#1F2937' },
        { id: 'white', name: 'White', color: '#F3F4F6' }
      ],
      inStock: product.inStock !== undefined ? product.inStock : true,
      stockCount: product.stockCount || Math.floor(Math.random() * 50) + 10
    };

    setSelectedProduct(enhancedProduct);
    setIsQuickViewOpen(true);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
    
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Enhanced QuickView Add to Cart Handler
  const handleQuickViewAddToCart = (productWithQuantity) => {
    // Validate product data
    if (!productWithQuantity || !productWithQuantity.Title) {
      showNotification("error", "⚠️ Invalid product data", 3000);
      return;
    }

    // Add the product to cart with enhanced data
    const cartItem = {
      ...productWithQuantity,
      id: productWithQuantity.id || Math.random().toString(36).substr(2, 9),
      quantity: productWithQuantity.quantity || 1,
      variant: productWithQuantity.variant || 'default',
      addedAt: new Date().toISOString(),
      price: parseFloat(productWithQuantity.Price) || 0
    };

    // Call the parent addtocart function
    if (typeof addtocart === 'function') {
      addtocart(cartItem);
    }
    
    // Show enhanced notification
    const variantText = cartItem.variant !== 'default' ? ` (${cartItem.variant})` : '';
    const quantityText = cartItem.quantity > 1 ? ` (${cartItem.quantity}x)` : '';
    
    showNotification(
      "success",
      `🛒 ${cartItem.Title}${variantText}${quantityText} berhasil ditambahkan ke keranjang!`,
      4000
    );
    
    // Animate cart icon
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 1000);
    
    // Optional: Auto-close QuickView after 2 seconds
    setTimeout(() => {
      if (isQuickViewOpen) {
        handleCloseQuickView();
      }
    }, 2000);
  };

  // Enhanced regular Add to Cart Handler
  const handleAddToCart = (product) => {
    if (!product || !product.Title) {
      showNotification("error", "⚠️ Invalid product data", 3000);
      return;
    }

    const cartItem = {
      ...product,
      id: product.id || Math.random().toString(36).substr(2, 9),
      quantity: 1,
      addedAt: new Date().toISOString(),
      price: parseFloat(product.Price) || 0
    };

    if (typeof addtocart === 'function') {
      addtocart(cartItem);
    }
    
    setAnimateCart(true);
    showNotification(
      "success",
      `🛒 ${product.Title} berhasil ditambahkan ke keranjang!`,
      3000
    );

    // Reset animation dengan bounce effect
    setTimeout(() => setAnimateCart(false), 800);
  };

  // Enhanced Favorite Toggle Handler
  const toggleFavorite = (productId) => {
    if (!productId) return;
    
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      const isCurrentlyFavorite = newFavorites.has(productId);
      
      if (isCurrentlyFavorite) {
        newFavorites.delete(productId);
        showNotification("info", "💔 Removed from favorites", 2000);
      } else {
        newFavorites.add(productId);
        showNotification("success", "❤️ Added to favorites!", 2000);
      }
      
      // Store favorites in localStorage for persistence
      try {
        localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      } catch (error) {
        console.warn('Could not save favorites to localStorage:', error);
      }
      
      return newFavorites;
    });
  };

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(new Set(parsedFavorites));
      }
    } catch (error) {
      console.warn('Could not load favorites from localStorage:', error);
    }
  }, []);

  const renderStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={i} />);
    }
    if (hasHalfStar) {
      stars.push(<BsStar key="half" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<BsStar key={i} />);
    }
    return stars;
  };

  // Enhanced Product Card Component
  const ProductCard = ({ product, showBadge = false, index = 0 }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    const handleImageLoad = () => setImageLoaded(true);
    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(true);
    };

    const productId = product.id || product.Title || index;
    const isFavorited = favorites.has(productId);
    
    return (
      <div
        className="product-card-mini modern"
        data-aos="fade-up"
        style={{ "--animation-delay": `${index * 50}ms` }}
      >
        {showBadge && (
          <div className="product-badges-mini">
            <span className="badge-mini new">NEW</span>
            {Math.random() > 0.7 && <span className="badge-mini sale">-20%</span>}
            {Math.random() > 0.8 && (
              <span className="badge-mini featured">⭐</span>
            )}
          </div>
        )}
        <div className="product-image-mini">
          {!imageLoaded && (
            <div className="image-placeholder">
              <div className="loading-spinner"></div>
            </div>
          )}
          <img 
            src={imageError ? "https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=Product" : product.Img} 
            alt={product.Title} 
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          <div className="image-overlay-mini"></div>
          <div className="product-actions-mini">
            <button
              className="action-btn-mini view"
              onClick={() => handleQuickView(product)}
              title="Quick View"
              aria-label={`Quick view ${product.Title}`}
            >
              <BsEye />
            </button>
            <button
              className={`action-btn-mini favorite ${
                isFavorited ? "active" : ""
              }`}
              onClick={() => toggleFavorite(productId)}
              title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
            <button
              className="action-btn-mini cart"
              onClick={() => handleAddToCart(product)}
              title="Add to Cart"
              aria-label={`Add ${product.Title} to cart`}
            >
              <AiOutlineShoppingCart />
            </button>
          </div>
          <div className="quick-add-overlay">
            <span>Quick Add</span>
          </div>
        </div>
        <div className="product-info-mini">
          <div className="product-category-mini">{product.Cat}</div>
          <h3 className="product-title-mini" title={product.Title}>
            {product.Title}
          </h3>
          <div className="product-rating-mini">
            <div className="stars-mini">{renderStars(product.rating || 4.5)}</div>
            <span className="rating-count-mini">
              ({product.rating || 4.5})
            </span>
          </div>
          <div className="product-price-mini">
            <span className="current-price-mini">${product.Price}</span>
            <span className="original-price-mini">
              ${(parseFloat(product.Price) * 1.2).toFixed(0)}
            </span>
          </div>
          <div className="product-tags-mini">
            <span className="tag-mini">🚚 Free</span>
            <span className="tag-mini">⚡ Fast</span>
            {product.inStock !== false && <span className="tag-mini">✅ Stock</span>}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container enhanced">
        <div className="loading-spinner"></div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <>
      {/* Notifications */}
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => removeNotification(notification.id)}
          duration={notification.duration}
        />
      ))}

      {/* Enhanced QuickView Component */}
      <QuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        onAddToCart={handleQuickViewAddToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
      />

      {/* Enhanced Product Detail Modal (Legacy - keeping for backward compatibility) */}
      {close && (
        <div className="product-detail-modal enhanced">
          <div className="modal-backdrop" onClick={() => setClose(false)}></div>
          <div className="modal-content">
            <button onClick={() => setClose(false)} className="modal-close">
              <AiOutlineCloseCircle />
            </button>
            {detail.map((product) => (
              <div className="product-detail-content" key={product.id}>
                <div className="detail-image">
                  <img src={product.Img} alt={product.Title} />
                  <div className="image-zoom-indicator">🔍 Hover to zoom</div>
                </div>
                <div className="detail-info">
                  <div className="detail-category">{product.Cat}</div>
                  <h2 className="detail-title">{product.Title}</h2>
                  <div className="detail-rating">
                    {renderStars()}
                    <span>(4.5 stars • 128 reviews)</span>
                  </div>
                  <p className="detail-description">
                    Experience cutting-edge technology with this premium device.
                    Features advanced processors, stunning display quality, and
                    professional-grade camera systems for the ultimate user
                    experience.
                  </p>
                  <div className="detail-features">
                    <div className="feature-item">
                      <MdVerified /> Verified Quality
                    </div>
                    <div className="feature-item">
                      <FiShield /> 2 Year Warranty
                    </div>
                    <div className="feature-item">
                      <FiTruck /> Free Shipping
                    </div>
                  </div>
                  <div className="detail-price">
                    <span className="current-price">${product.Price}</span>
                    <span className="original-price">
                      ${(parseFloat(product.Price) * 1.2).toFixed(0)}
                    </span>
                    <span className="discount">Save 20%</span>
                  </div>
                  <div className="detail-actions">
                    <button
                      className="add-to-cart-btn enhanced"
                      onClick={() => handleAddToCart(product)}
                    >
                      <AiOutlineShoppingCart /> Add To Cart
                    </button>
                    <button
                      className={`favorite-btn ${
                        favorites.has(product.id) ? "active" : ""
                      }`}
                      onClick={() => toggleFavorite(product.id)}
                    >
                      {favorites.has(product.id) ? (
                        <AiFillHeart />
                      ) : (
                        <AiOutlineHeart />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Hero Section dengan parallax */}
      <section className="hero-section enhanced">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{ background: slide.gradient }}
            >
              <div className="hero-background">
                <img src={slide.image} alt={slide.title} />
                <div className="hero-overlay"></div>
                <div className="hero-particles"></div>
              </div>
              <div className="hero-content">
                <div className="hero-badge animated">{slide.badge}</div>
                <h1 className="hero-title animated">{slide.title}</h1>
                <p className="hero-subtitle animated">{slide.subtitle}</p>
                <p className="hero-description animated">{slide.description}</p>
                <Link to="/product" className="hero-cta animated">
                  {slide.buttonText} <BsArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-arrow">↓</div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card animate-on-scroll"
                style={{ "--delay": `${index * 100}ms` }}
              >
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <div className="stat-number" data-target={stat.number}>
                    {stat.number}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className="stat-bg-icon">{stat.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Brand Categories */}
      <section className="brand-categories">
        <div className="container">
          <div className="section-header">
            <h2>
              <FaRocket /> Top Brands <FaRocket />
            </h2>
          </div>
          <div className="brands-grid">
            {brandCategories.map((brand, index) => (
              <Link
                key={index}
                to={`/product?brand=${brand.name}`}
                className="brand-card enhanced"
                style={{ "--delay": `${index * 150}ms` }}
              >
                {brand.trending && (
                  <div className="trending-badge">
                    <MdTrendingUp /> Trending
                  </div>
                )}
                <div
                  className="brand-logo"
                  style={{ "--brand-color": brand.color }}
                >
                  <img src={brand.logo} alt={brand.name} />
                  <div className="brand-glow"></div>
                </div>
                <div className="brand-info">
                  <h3>{brand.name}</h3>
                  <p>{brand.description}</p>
                  <div className="brand-stats">
                    <span className="product-count">
                      {brand.products} Products
                    </span>
                    <span className="brand-rating">
                      <BsStarFill /> 4.8
                    </span>
                  </div>
                </div>
                <div className="brand-overlay">
                  <span>Explore Collection</span>
                  <BsArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="features-section" ref={featuresRef}>
        <div className="container">
          <div className="features-header">
            <h2>🚀 Why Choose Us</h2>
            <p>
              Experience the difference with our premium services and unmatched
              quality
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${
                  featuresInView ? "animate-fade-in" : ""
                }`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div
                  className="feature-icon"
                  style={{ background: feature.bgGradient }}
                >
                  {feature.icon}
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-stats">{feature.stats}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-icon">📧</div>
            <h2 className="newsletter-title">Stay Updated with Latest Deals</h2>
            <p className="newsletter-subtitle">
              Get exclusive offers, product updates, and tech news delivered to
              your inbox
            </p>
            <p className="newsletter-description">
              ✨ Exclusive Deals / Early Access / Tech News
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="newsletter-button">
                SUBSCRIBE NOW →
              </button>
            </form>
            <div className="newsletter-privacy">
              <span className="newsletter-privacy-icon">🔒</span>
              We respect your privacy. Unsubscribe anytime.
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Compact Version */}
      <section className="products-section featured compact">
        <div className="container">
          <div className="section-header">
            <div className="section-title-wrapper">
              <h2>
                <MdFlashOn /> Featured Products <MdFlashOn />
              </h2>
              <p>Discover our handpicked selection of premium products</p>
            </div>
            <Link to="/product" className="view-all-compact">
              View All Products <BsArrowRight />
            </Link>
          </div>
          <div className="products-grid-compact">
            {featuredProducts
              .slice(0, visibleProducts)
              .map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showBadge={true}
                  index={index}
                />
              ))}
          </div>
          <div className="load-more-section">
            <button
              className="load-more-btn"
              onClick={() => setVisibleProducts((prev) => prev + 4)}
            >
              Load More Products
            </button>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="products-section trending">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>
                <MdTrendingUp /> Trending Now
              </h2>
              <p>Most popular products this week</p>
            </div>
            <Link to="/product" className="view-all">
              Explore Trending <BsArrowRight />
            </Link>
          </div>
          <div className="products-grid">
            {trendingProducts.slice(0, 8).map((product, index) => (
              <ProductCard
                key={`trending-${product.id}`}
                product={product}
                showBadge={false}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories Showcase */}
      <section className="categories-showcase">
        <div className="container">
          <div className="section-header">
            <h2>
              <FaRocket /> Shop by Category
            </h2>
            <p>Find exactly what you're looking for</p>
          </div>
          <div className="categories-grid">
            {[...new Set(Homeproduct.map((p) => p.Cat))].map(
              (category, index) => {
                const categoryProducts = Homeproduct.filter(
                  (p) => p.Cat === category
                );
                const featuredProduct = categoryProducts[0];
                return (
                  <Link
                    key={category}
                    to={`/product?category=${category}`}
                    className="category-card"
                    style={{ "--delay": `${index * 100}ms` }}
                  >
                    <div className="category-image">
                      <img src={featuredProduct.Img} alt={category} />
                      <div className="category-overlay">
                        <div className="category-count">
                          {categoryProducts.length} Products
                        </div>
                      </div>
                    </div>
                    <div className="category-info">
                      <h3>{category}</h3>
                      <p>
                        Starting from $
                        {Math.min(
                          ...categoryProducts.map((p) => parseInt(p.Price))
                        )}
                      </p>
                      <div className="category-cta">
                        Explore Collection <BsArrowRight />
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="special-offers">
        <div className="container">
          <div className="offers-grid">
            <div className="offer-card mega-deal">
              <div className="offer-content">
                <div className="offer-badge">🔥 MEGA DEAL</div>
                <h3>Up to 50% OFF</h3>
                <p>On selected smartphones and accessories</p>
                <Link to="/product" className="offer-btn">
                  Shop Now <BsArrowRight />
                </Link>
              </div>
              <div className="offer-image">
                <img src={ip13} alt="Mega Deal" />
              </div>
            </div>

            <div className="offer-card flash-sale">
              <div className="offer-content">
                <div className="offer-badge">⚡ FLASH SALE</div>
                <h3>24 Hours Only</h3>
                <p>Limited time offers on premium devices</p>
                <div className="countdown">
                  <div className="countdown-item">
                    <span className="countdown-number">12</span>
                    <span className="countdown-label">Hours</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-number">34</span>
                    <span className="countdown-label">Minutes</span>
                  </div>
                </div>
                <Link to="/product" className="offer-btn">
                  Grab Deal <BsArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;