import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../../utils/Notification/Notification";
import { useNotification } from "../../hook/useNotification";
import { BsCreditCard, BsShieldCheck, BsTruck, BsCheckCircle, BsExclamationTriangle } from "react-icons/bs";
import { AiOutlineLoading3Quarters, AiOutlineUser, AiOutlineHome, AiOutlinePhone } from "react-icons/ai";
import { FaLock, FaGift, FaShippingFast } from "react-icons/fa";
import "./payment.css";
// Importing images for products
import ip16Image from "../../assets/images/ip 16.jpg";
import ip13 from "../../assets/images/ip13.jpg";
import zfold from "../../assets/images/zfold.jpg";
import zfold6 from "../../assets/images/zfold6.jpg";
import huawei from "../../assets/images/huawei.jpg";
import oppo2 from "../../assets/images/oppo2.jpg";
import samsung from "../../assets/images/samsung.jpg";
import samsung3 from "../../assets/images/samsung3.jpg";
import huawei3 from "../../assets/images/huawei3.jpg";
import vivo7 from "../../assets/images/vivo7.jpg";
import vivo2 from "../../assets/images/vivo2.jpg";
import vivo4 from "../../assets/images/vivo4.jpg";
import zfold3 from "../../assets/images/zfold3.jpg";
import oppo1 from "../../assets/images/oppo1.jpg";
import oppo3 from "../../assets/images/oppo3.jpg";
import oppo4 from "../../assets/images/oppo4.jpg";
import samsung6 from "../../assets/images/samsung6.jpg";
import huawei4 from "../../assets/images/huawei4.jpg";
import samsung4 from "../../assets/images/samsung4.jpg";
import ipx from "../../assets/images/ipx.jpg";



const imageMap = {
  "ip 16.jpg" : ip16Image,
  "ip 13.jpg" : ip13,
  "zffold.jpg" : zfold,
  "zfold6.jpg" : zfold6,
  "huawei.jpg" : huawei,
  "oppo2.jpg" : oppo2,
  "samsung.jpg" : samsung,
  "samsung3.jpg" : samsung3,
  "huawei3.jpg" : huawei3,
  "vivo7.jpg" : vivo7,
  "vivo2.jpg" : vivo2,
  "vivo4.jpg" : vivo4,
  "zfold3.jpg" : zfold3,
  "oppo1.jpg" : oppo1,
  "oppo3.jpg" : oppo3,
  "oppo4.jpg" : oppo4,
  "samsung6.jpg" : samsung6,
  "huawei4.jpg" : huawei4,
  "samsung4.jpg" : samsung4,
  "ipx.jpg" : ipx
};


const Payment = ({ cart, setCart }) => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "transfer"
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { notifications, showNotification, removeNotification } = useNotification();

  const totalPrice = cart.reduce((price, item) => price + item.qty * item.price, 0);
  const savings = Math.floor(totalPrice * 0.1); // 10% savings simulation

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Nama lengkap wajib diisi';
        } else if (value.length < 3) {
          errors.name = 'Nama minimal 3 karakter';
        } else {
          delete errors.name;
        }
        break;
      case 'address':
        if (!value.trim()) {
          errors.address = 'Alamat wajib diisi';
        } else if (value.length < 10) {
          errors.address = 'Alamat terlalu singkat';
        } else {
          delete errors.address;
        }
        break;
      case 'phone':
        const phoneRegex = /^[+]?[0-9]{10,15}$/;
        if (!value.trim()) {
          errors.phone = 'Nomor telepon wajib diisi';
        } else if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
          errors.phone = 'Format nomor telepon tidak valid';
        } else {
          delete errors.phone;
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Calculate progress based on form completion
  useEffect(() => {
    const fields = ['name', 'address', 'phone'];
    const completedFields = fields.filter(field => form[field].trim() && !validationErrors[field]);
    setProgress((completedFields.length / fields.length) * 100);
  }, [form, validationErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = ['name', 'address', 'phone'].every(field => 
      validateField(field, form[field])
    );
    
    if (!isValid) {
      showNotification('error', 'Mohon perbaiki kesalahan pada form! ❌', 4000);
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);
    showNotification('info', 'Memproses pembayaran... ⏳', 2000);

    // Simulate payment processing with steps
    setTimeout(() => {
      setCurrentStep(3);
      showNotification('info', 'Memverifikasi data... 🔍', 2000);
    }, 1500);

    setTimeout(() => {
      setCurrentStep(4);
      showNotification('info', 'Menyelesaikan transaksi... 💳', 2000);
    }, 3000);

    setTimeout(() => {
      // Save transaction
      const transaksiLama = JSON.parse(localStorage.getItem("transaksiHP") || "[]");
      const transaksiBaru = {
        id: Date.now(),
        name: form.name,
        address: form.address,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        items: cart,
        total: totalPrice,
        savings: savings,
        date: new Date().toLocaleString(),
        status: "Approved"
      };
      localStorage.setItem("transaksiHP", JSON.stringify([transaksiBaru, ...transaksiLama]));
      
      setCurrentStep(5);
      showNotification('success', `Pembayaran berhasil! 🎉`, 3000);
      
      setTimeout(() => {
        setCart([]);
        navigate("/order-success");
      }, 2000);
    }, 4500);
  };

  const getStepIcon = (step) => {
    if (currentStep > step) return <BsCheckCircle className="step-icon completed" />;
    if (currentStep === step) return <AiOutlineLoading3Quarters className="step-icon active" />;
    return <div className="step-icon pending">{step}</div>;
  };

  return (
    <>
      {/* Render notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => removeNotification(notification.id)}
          duration={notification.duration}
        />
      ))}

      <div className="payment-container">
        {/* Progress Steps */}
        <div className="payment-steps">
          <div className="step-item">
            {getStepIcon(1)}
            <span>Data Pembeli</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            {getStepIcon(2)}
            <span>Verifikasi</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            {getStepIcon(3)}
            <span>Pembayaran</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            {getStepIcon(4)}
            <span>Selesai</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${isProcessing ? 100 : progress}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {isProcessing ? 'Memproses...' : `${Math.round(progress)}% Lengkap`}
          </span>
        </div>

        {/* Payment Header */}
        <div className="payment-header">
          <h1>💳 Checkout Premium</h1>
          <p>Lengkapi data pembayaran untuk menyelesaikan pesanan Anda</p>
        </div>

        {/* Security Badges */}
        <div className="security-badges">
          <div className="security-badge">
            <BsShieldCheck className="security-icon" />
            <span>SSL Encrypted</span>
          </div>
          <div className="security-badge">
            <FaLock className="security-icon" />
            <span>Secure Payment</span>
          </div>
          <div className="security-badge">
            <FaShippingFast className="security-icon" />
            <span>Fast Delivery</span>
          </div>
        </div>

        <div className="payment-content">
          {/* Enhanced Order Summary */}
          <div className="payment-summary">
            <h3><BsTruck /> Ringkasan Pesanan</h3>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>Keranjang kosong.</p>
                <Link to="/product" className="shop-now-btn">
                  <FaGift /> Belanja Sekarang
                </Link>
              </div>
            ) : (
              <>
                <div className="order-items">
                  {cart.map((item, index) => (
                    <div key={item.id} className="order-item" style={{animationDelay: `${index * 0.1}s`}}>
                      <img src={imageMap[item.image]} alt={item.name} className="item-image" />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-category">{item.Cat}</p>
                        <div className="item-pricing">
                          <span className="item-price">${item.price}</span>
                          <span className="item-qty">x {item.qty}</span>
                          <span className="item-total">${item.price * item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="price-row savings">
                    <span>💰 Hemat:</span>
                    <span className="savings-amount">-${savings}</span>
                  </div>
                  <div className="price-row">
                    <span>Ongkos Kirim:</span>
                    <span className="free">Gratis ✨</span>
                  </div>
                  <div className="price-row total">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                {/* Special Offers */}
                <div className="special-offers">
                  <div className="offer-item">
                    <FaGift className="offer-icon" />
                    <span>Gratis ongkir untuk pembelian ini!</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Payment Form */}
          <form className="payment-form" onSubmit={handleSubmit}>
            <h3><BsCreditCard /> Data Pembayaran</h3>
            
            <div className="form-group">
              <label htmlFor="name">
                <AiOutlineUser /> Nama Lengkap *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={handleChange}
                required
                disabled={isProcessing}
                className={validationErrors.name ? 'error' : form.name ? 'valid' : ''}
              />
              {validationErrors.name && (
                <span className="error-message">
                  <BsExclamationTriangle /> {validationErrors.name}
                </span>
              )}
              {form.name && !validationErrors.name && (
                <span className="success-message">
                  <BsCheckCircle /> Terlihat bagus!
                </span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="address">
                <AiOutlineHome /> Alamat Pengiriman *
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Masukkan alamat lengkap untuk pengiriman"
                value={form.address}
                onChange={handleChange}
                required
                disabled={isProcessing}
                rows="3"
                className={validationErrors.address ? 'error' : form.address ? 'valid' : ''}
              />
              {validationErrors.address && (
                <span className="error-message">
                  <BsExclamationTriangle /> {validationErrors.address}
                </span>
              )}
              {form.address && !validationErrors.address && (
                <span className="success-message">
                  <BsCheckCircle /> Alamat valid!
                </span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">
                <AiOutlinePhone /> No. Telepon *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Contoh: +62 812-3456-7890"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={isProcessing}
                className={validationErrors.phone ? 'error' : form.phone ? 'valid' : ''}
              />
              {validationErrors.phone && (
                <span className="error-message">
                  <BsExclamationTriangle /> {validationErrors.phone}
                </span>
              )}
              {form.phone && !validationErrors.phone && (
                <span className="success-message">
                  <BsCheckCircle /> Nomor valid!
                </span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="paymentMethod">💳 Metode Pembayaran</label>
              <select 
                id="paymentMethod"
                name="paymentMethod" 
                value={form.paymentMethod} 
                onChange={handleChange}
                disabled={isProcessing}
              >
                <option value="transfer">🏦 Transfer Bank</option>
                <option value="cod">🚚 Bayar di Tempat (COD)</option>
                <option value="ewallet">📱 E-Wallet</option>
                <option value="credit">💳 Kartu Kredit</option>
              </select>
            </div>

            {/* Enhanced Payment Method Info */}
            <div className="payment-info">
              {form.paymentMethod === 'transfer' && (
                <div className="info-card transfer">
                  <h4>🏦 Transfer Bank</h4>
                  <p>Setelah checkout, Anda akan mendapat detail rekening untuk transfer. Pesanan akan diproses setelah pembayaran dikonfirmasi.</p>
                  <div className="info-benefits">
                    <span>✅ Aman & Terpercaya</span>
                    <span>✅ Tanpa Biaya Admin</span>
                  </div>
                </div>
              )}
              {form.paymentMethod === 'cod' && (
                <div className="info-card cod">
                  <h4>🚚 Bayar di Tempat (COD)</h4>
                  <p>Bayar langsung kepada kurir saat produk sampai di alamat Anda. Tersedia untuk area tertentu.</p>
                  <div className="info-benefits">
                    <span>✅ Bayar Setelah Terima</span>
                    <span>✅ Cek Produk Dulu</span>
                  </div>
                </div>
              )}
              {form.paymentMethod === 'ewallet' && (
                <div className="info-card ewallet">
                  <h4>📱 E-Wallet</h4>
                  <p>Pembayaran instan menggunakan GoPay, OVO, DANA, atau ShopeePay. Proses otomatis dan cepat.</p>
                  <div className="info-benefits">
                    <span>✅ Pembayaran Instan</span>
                    <span>✅ Cashback Tersedia</span>
                  </div>
                </div>
              )}
              {form.paymentMethod === 'credit' && (
                <div className="info-card credit">
                  <h4>💳 Kartu Kredit</h4>
                  <p>Pembayaran menggunakan Visa, Mastercard, atau JCB. Transaksi aman dengan enkripsi SSL.</p>
                  <div className="info-benefits">
                    <span>✅ Cicilan 0%</span>
                    <span>✅ Reward Points</span>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`btn-pay ${isProcessing ? 'processing' : ''} ${progress === 100 && !isProcessing ? 'ready' : ''}`}
                disabled={isProcessing || cart.length === 0 || Object.keys(validationErrors).length > 0}
              >
                {isProcessing ? (
                  <>
                    <AiOutlineLoading3Quarters className="loading-icon" />
                    Memproses Pembayaran...
                  </>
                ) : (
                  <>
                    <BsCreditCard />
                    💳 Bayar Sekarang - ${totalPrice}
                  </>
                )}
              </button>
              
              <Link to="/cart" className="btn-back">
                ← Kembali ke Keranjang
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment;