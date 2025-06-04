import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlineShoppingCart, AiOutlinePrinter } from 'react-icons/ai';
import { BsCalendar, BsPhone, BsGeoAlt, BsCreditCard } from 'react-icons/bs';
import './OrderSucces.css';

const OrderSuccess = () => {
  const [orderData, setOrderData] = useState(null);
  
  useEffect(() => {
  const latestOrder = JSON.parse(localStorage.getItem("transaksiHP") || "[]")[0];
  if (latestOrder) {
    const orderWithValidDate = {
      ...latestOrder,
      date: latestOrder.date || new Date().toISOString()
    };
    
    setOrderData(orderWithValidDate);
    saveToAdminOrders(orderWithValidDate);
  }
}, []);
  const saveToAdminOrders = (orderData) => {
    try {
      // Ambil data orders admin yang sudah ada
      const existingAdminOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
      
      // Cek apakah order ini sudah ada berdasarkan ID
      const orderExists = existingAdminOrders.some(order => order.id === orderData.id);
      
      if (!orderExists) {
        const currentDate = new Date();
      let formattedDate;
      
      if (orderData.date) {
        const existingDate = new Date(orderData.date);
        formattedDate = isNaN(existingDate.getTime()) ? currentDate.toISOString() : existingDate.toISOString();
      } else {
        formattedDate = currentDate.toISOString();
      }
        // Format data untuk admin dashboard
        const adminOrderData = {
          id: orderData.id,
          name: orderData.name,
          phone: orderData.phone,
          address: orderData.address,
          items: orderData.items,
          total: orderData.total,
          paymentMethod: orderData.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat (COD)',
          date: orderData.date,
          status: orderData.status || 'pending',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(orderData.name)}&background=random&size=40`,
          timestamp: new Date().toISOString(),
          orderDetails: {
            subtotal: orderData.total,
            shipping: 0, // Gratis
            finalTotal: orderData.total
          }
        };

        // Tambahkan order baru ke array
        const updatedAdminOrders = [adminOrderData, ...existingAdminOrders];
        
        // Simpan kembali ke localStorage
        localStorage.setItem("adminOrders", JSON.stringify(updatedAdminOrders));
        
        // Update statistik admin
        updateAdminStats(adminOrderData);
        
        console.log("Order berhasil disimpan ke admin dashboard:", adminOrderData);
      }
    } catch (error) {
      console.error("Error saving to admin orders:", error);
    }
  };

  const updateAdminStats = (newOrder) => {
    try {
      // Ambil statistik yang sudah ada
      const existingStats = JSON.parse(localStorage.getItem("adminStats") || "{}");
      
      // Update statistik
      const updatedStats = {
        totalRevenue: (existingStats.totalRevenue || 45230) + parseFloat(newOrder.total),
        totalSales: (existingStats.totalSales || 1250) + newOrder.items.reduce((sum, item) => sum + (item.qty || 1), 0),
        totalPurchase: (existingStats.totalPurchase || 89) + 1,
        lastUpdated: new Date().toISOString()
      };
      
      // Simpan statistik yang diperbarui
      localStorage.setItem("adminStats", JSON.stringify(updatedStats));
      
      console.log("Admin stats updated:", updatedStats);
    } catch (error) {
      console.error("Error updating admin stats:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!orderData) {
    return (
      <div className="order-loading">
        <h2>Memuat data pesanan...</h2>
        <Link to="/" className="back-home">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      {/* Header Success */}
      <div className="success-header">
        <div className="success-icon">
          <AiOutlineCheckCircle />
        </div>
        <h1>Pesanan Berhasil!</h1>
        <p>Terima kasih atas kepercayaan Anda berbelanja di toko kami</p>
      </div>

      {/* Order Details Card */}
      <div className="order-card">
        <div className="order-header">
          <h2>Detail Pesanan</h2>
          <div className="order-id">
            <span>Order ID: #{orderData.id}</span>
            <button onClick={handlePrint} className="print-btn">
              <AiOutlinePrinter /> Cetak
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="customer-info">
          <h3>Informasi Pelanggan</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Nama:</span>
              <span className="info-value">{orderData.name}</span>
            </div>
            <div className="info-item">
              <BsPhone className="info-icon" />
              <span className="info-label">Telepon:</span>
              <span className="info-value">{orderData.phone}</span>
            </div>
            <div className="info-item">
              <BsGeoAlt className="info-icon" />
              <span className="info-label">Alamat:</span>
              <span className="info-value">{orderData.address}</span>
            </div>
            <div className="info-item">
              <BsCreditCard className="info-icon" />
              <span className="info-label">Metode Pembayaran:</span>
              <span className="info-value">
                {orderData.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Bayar di Tempat (COD)'}
              </span>
            </div>
            <div className="info-item">
              <BsCalendar className="info-icon" />
              <span className="info-label">Tanggal Pesanan:</span>
              <span className="info-value">{orderData.date}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge ${orderData.status?.toLowerCase() || 'pending'}`}>
                {orderData.status || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="order-items">
          <h3>Produk yang Dipesan</h3>
          <div className="items-list">
            {orderData.items.map((item, index) => (
              <div key={index} className="item-card">
                <div className="item-image">
                  <img src={item.Img} alt={item.Title} />
                </div>
                <div className="item-details">
                  <h4>{item.Title}</h4>
                  <p className="item-category">{item.Cat}</p>
                  <div className="item-price-qty">
                    <span className="item-price">${item.Price}</span>
                    <span className="item-qty">x {item.qty || 1}</span>
                    <span className="item-subtotal">${item.Price * (item.qty || 1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${orderData.total}</span>
          </div>
          <div className="summary-row">
            <span>Ongkos Kirim:</span>
            <span>Gratis</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${orderData.total}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h3>Langkah Selanjutnya</h3>
          <div className="steps-list">
            {orderData.paymentMethod === 'transfer' ? (
              <>
                <div className="step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h4>Transfer Pembayaran</h4>
                    <p>Silakan transfer ke rekening: <strong>BCA 1234567890 a.n. Toko HP</strong></p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h4>Konfirmasi Pembayaran</h4>
                    <p>Kirim bukti transfer ke WhatsApp: <strong>+62 896-6955-7444</strong></p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h4>Pesanan Diproses</h4>
                    <p>Pesanan akan diproses dalam 1-2 hari kerja setelah pembayaran dikonfirmasi</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h4>Pesanan Dikonfirmasi</h4>
                    <p>Tim kami akan menghubungi Anda untuk konfirmasi pesanan</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h4>Pengiriman</h4>
                    <p>Produk akan dikirim ke alamat Anda dalam 1-3 hari kerja</p>
                  </div>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h4>Pembayaran</h4>
                    <p>Bayar langsung kepada kurir saat produk sampai</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">
            <AiOutlineShoppingCart /> Belanja Lagi
          </Link>
          <Link to="/orders" className="btn btn-secondary">
            Lihat Semua Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;