import React from 'react'
import { AiOutlineInstagram, AiOutlineTwitter, AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment } from 'react-icons/ai';
import { RiFacebookFill } from 'react-icons/ri';
import { BsYoutube, BsTiktok } from 'react-icons/bs';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import goapy from '../../assets/images/gopay.jpg';
import mastercard from '../../assets/images/mastercard.jpg';
import ovo from '../../assets/images/ovo.jpg';
import paypal from '../../assets/images/paypal.jpg';
import visa from '../../assets/images/visa.jpg';
import './footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className='modern-footer'>
        {/* Main Footer Content */}
        <div className='footer-main'>
          <div className='footer-container'>
            {/* Company Info Section */}
            <div className='footer-section company-info'>
              <div className='footer-logo'>
                <img src='./img/logofooter.png' alt='ZonaHPF Logo' className='logo-img' />
              </div>
              <p className='company-description'>
                ZonaHPF adalah destinasi terpercaya untuk handphone dan aksesoris berkualitas tinggi. 
                Kami berkomitmen memberikan produk terbaik dengan layanan pelanggan yang memuaskan.
              </p>
              <div className='contact-info'>
                <div className='contact-item'>
                  <AiOutlineEnvironment className='contact-icon' />
                  <span>Jakarta, Indonesia</span>
                </div>
                <div className='contact-item'>
                  <AiOutlinePhone className='contact-icon' />
                  <span>+62 896-6955-7444</span>
                </div>
                <div className='contact-item'>
                  <AiOutlineMail className='contact-icon' />
                  <span>rendyftbaru@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className='footer-section quick-links'>
              <h3 className='section-title'>Quick Links</h3>
              <ul className='footer-links'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/product'>Products</Link></li>
                <li><Link to='/about'>About Us</Link></li>
                <li><Link to='/contact'>Contact</Link></li>
                <li><Link to='/blog'>Blog</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className='footer-section customer-service'>
              <h3 className='section-title'>Customer Service</h3>
              <ul className='footer-links'>
                <li><Link to='/account'>My Account</Link></li>
                <li><Link to='/orders'>Order History</Link></li>
                <li><Link to='/cart'>Shopping Cart</Link></li>
                <li><Link to='/shipping'>Shipping Info</Link></li>
                <li><Link to='/returns'>Returns & Exchanges</Link></li>
                <li><Link to='/support'>Customer Support</Link></li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div className='footer-section legal-info'>
              <h3 className='section-title'>Legal & Policies</h3>
              <ul className='footer-links'>
                <li><Link to='/privacy'>Privacy Policy</Link></li>
                <li><Link to='/terms'>Terms & Conditions</Link></li>
                <li><Link to='/cookies'>Cookie Policy</Link></li>
                <li><Link to='/warranty'>Warranty</Link></li>
                <li><Link to='/faq'>FAQ</Link></li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className='footer-section newsletter-social'>
              <h3 className='section-title'>Stay Connected</h3>
              <p className='newsletter-text'>
                Subscribe to our newsletter for the latest updates and exclusive offers!
              </p>
              <div className='newsletter-form'>
                <input 
                  type='email' 
                  placeholder='Enter your email address'
                  className='newsletter-input'
                />
                <button className='newsletter-btn'>
                  Subscribe
                </button>
              </div>
              
              <div className='social-media'>
                <h4 className='social-title'>Follow Us</h4>
                <div className='social-icons'>
                  <a href="https://www.facebook.com/share/15u6Axv9hx/" className='social-link facebook' aria-label='Facebook'>
                    <RiFacebookFill />
                  </a>
                  <a href="https://www.instagram.com/renfertz?igsh=MXN0ZzU5b2hyenhqOQ==" className='social-link instagram' aria-label='Instagram'>
                    <AiOutlineInstagram />
                  </a>
                  <a href="https://x.com/Renkksss?t=gMFj5DPIbztGCWg4bl1cvA&s=09" className='social-link twitter' aria-label='Twitter'>
                    <AiOutlineTwitter />
                  </a>
                  <a href="https://www.tiktok.com/@rennegoist?_t=ZS-8wQD2vrToCF&_r=1" className='social-link tiktok' aria-label='TikTok'>
                    <BsTiktok />
                  </a>
                  <a href="#" className='social-link youtube' aria-label='YouTube'>
                    <BsYoutube />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='footer-bottom'>
          <div className='footer-container'>
            <div className='footer-bottom-content'>
              <div className='copyright'>
                <p>
                  © {currentYear} ZonaHPF. All rights reserved. Made with <FaHeart className='heart-icon' /> by ZonaHPF Team.
                </p>
              </div>
              <div className='payment-methods'>
                <span className='payment-text'>We Accept:</span>
                <div className='payment-icons'>
                  <img src={visa} alt='Visa' className='payment-icon' />
                  <img src={mastercard} alt='Mastercard' className='payment-icon' />
                  <img src={paypal} alt='PayPal' className='payment-icon' />
                  <img src={goapy} alt='GoPay' className='payment-icon' />
                  <img src={ovo} alt='OVO' className='payment-icon' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer