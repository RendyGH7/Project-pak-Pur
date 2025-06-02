import React from "react";
import { FiTruck, FiShield, FiHeadphones, FiStar } from "react-icons/fi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiPercent } from "react-icons/ci";
import { BiHeadphone } from "react-icons/bi";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdVerified, MdSecurity } from "react-icons/md";
import about from '../../assets/images/about.jpg';
import logoh from '../../assets/images/logo huawei.jpg';
import logoi from '../../assets/images/logo ip.jpg';
import logov from '../../assets/images/logo vivo.jpg';
import logos from '../../assets/images/logo samsung.jpg';
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* Background Pattern */}
      <div className="about-background-pattern"></div>
      
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>ZonaHP - Trusted Mobile Phone Center</h1>
          <p>
            Selamat datang di ZonaHP! Kami adalah toko online yang menyediakan berbagai macam handphone original, terbaru, dan bergaransi resmi. Temukan smartphone impian Anda dari brand ternama dengan harga terbaik dan pelayanan profesional.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Pelanggan Puas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Produk Tersedia</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9</div>
              <div className="stat-label">Rating Bintang</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={about} alt="Handphone Collection" className="about-banner-img" />
          <div className="floating-elements">
            <div className="floating-icon floating-1">
              <HiOutlineSparkles />
            </div>
            <div className="floating-icon floating-2">
              <MdVerified />
            </div>
            <div className="floating-icon floating-3">
              <FiStar />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="about-features">
        <div className="section-header">
          <h2>Mengapa Memilih ZonaHP?</h2>
          <p>Kami berkomitmen memberikan pengalaman berbelanja terbaik untuk Anda</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiTruck />
            </div>
            <div className="feature-content">
              <h3>Pengiriman Cepat</h3>
              <p>Pesanan Anda akan dikirim dengan aman dan cepat ke seluruh dunia dengan tracking real-time.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MdSecurity />
            </div>
            <div className="feature-content">
              <h3>Garansi Resmi</h3>
              <p>Semua produk bergaransi resmi dan dijamin keasliannya sesuai dengan ketentuan yang berlaku.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <CiPercent />
            </div>
            <div className="feature-content">
              <h3>Promo & Diskon</h3>
              <p>Dapatkan promo menarik dan diskon khusus untuk berbagai produk pilihan setiap harinya.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <BiHeadphone />
            </div>
            <div className="feature-content">
              <h3>Customer Service 24/7</h3>
              <p>Tim support kami siap membantu Anda kapan saja dengan respon cepat dan solusi terbaik.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="about-story">
        <div className="story-content">
          <div className="story-text">
            <h2>Cerita Kami</h2>
            <p>
              Sejak tahun 2020, ZonaHP hadir untuk memenuhi kebutuhan gadget masyarakat Indonesia dan dunia. Kami berkomitmen menyediakan produk berkualitas, harga kompetitif, dan pengalaman berbelanja yang menyenangkan.
            </p>
            <p>
              Kepuasan pelanggan adalah prioritas utama kami. Dengan tim yang berpengalaman dan sistem yang terpercaya, kami terus berinovasi untuk memberikan pelayanan terbaik.
            </p>
            <div className="story-highlights">
              <div className="highlight-item">
                <FiShield className="highlight-icon" />
                <span>Produk Original 100%</span>
              </div>
              <div className="highlight-item">
                <MdVerified className="highlight-icon" />
                <span>Garansi Resmi</span>
              </div>
              <div className="highlight-item">
                <FiStar className="highlight-icon" />
                <span>Rating Tinggi</span>
              </div>
            </div>
          </div>
          <div className="story-visual">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-desc">ZonaHP didirikan</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-desc">Ekspansi ke seluruh Indonesia</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-desc">Partnership dengan brand global</div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-desc">10K+ pelanggan puas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="about-gallery">
        <div className="gallery-header">
          <h2>Galeri Produk Unggulan</h2>
          <p>Brand-brand ternama yang tersedia di ZonaHP</p>
        </div>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src={logoi} alt="iPhone" />
            <div className="gallery-overlay">
              <h4>iPhone</h4>
              <p>Premium Series</p>
            </div>
          </div>
          <div className="gallery-item">
            <img src={logos} alt="Samsung" />
            <div className="gallery-overlay">
              <h4>Samsung</h4>
              <p>Galaxy Collection</p>
            </div>
          </div>
          <div className="gallery-item">
            <img src={logov} alt="Vivo" />
            <div className="gallery-overlay">
              <h4>Vivo</h4>
              <p>Photography Expert</p>
            </div>
          </div>
          <div className="gallery-item">
            <img src={logoh} alt="Huawei" />
            <div className="gallery-overlay">
              <h4>Huawei</h4>
              <p>Innovation Leader</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta">
        <div className="cta-content">
          <h2>Siap Menemukan Smartphone Impian Anda?</h2>
          <p>Jelajahi koleksi lengkap kami dan dapatkan penawaran terbaik hari ini!</p>
          <div className="cta-buttons">
            <a href="/shop" className="cta-btn primary">
              <span>Mulai Belanja</span>
              <FiStar />
            </a>
            <a href="/contact" className="cta-btn secondary">
              <span>Hubungi Kami</span>
              <FiHeadphones />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;