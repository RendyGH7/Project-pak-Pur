import React, { useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlinePlus, AiOutlineMinus, AiOutlineShoppingCart, AiOutlineHeart } from 'react-icons/ai';
import { BsTrash, BsArrowRight, BsShieldCheck, BsTruck } from 'react-icons/bs';
import { FaGift, FaPercent } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Notification from '../../utils/Notification/Notification';
import { useNotification } from '../../hook/useNotification';
import './Cart.css'

const Cart = ({cart, setCart}) => {
    const { notifications, showNotification, removeNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [animatingItems, setAnimatingItems] = useState(new Set());
    const [savedItems, setSavedItems] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    // Calculate totals
    const subtotal = cart.reduce((price, item) => price + item.qty * item.Price, 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const discount = subtotal > 200 ? subtotal * 0.1 : 0;
    const total = subtotal + shipping - discount;

    // Progress bar untuk free shipping
    const shippingProgress = (subtotal / 100) * 100;

    // Estimated delivery date
    const getEstimatedDelivery = () => {
        const today = new Date();
        const deliveryDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
        return deliveryDate.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Promo code functionality
    const applyPromoCode = () => {
        const promoCodes = {
            'SAVE10': { discount: 0.1, description: 'Diskon 10%' },
            'WELCOME': { discount: 0.15, description: 'Diskon Welcome 15%' },
            'FREESHIP': { freeShipping: true, description: 'Gratis Ongkir' }
        };
        
        if (promoCodes[promoCode.toUpperCase()]) {
            setAppliedPromo(promoCodes[promoCode.toUpperCase()]);
            showNotification('success', `🎉 Kode promo ${promoCode} berhasil diterapkan!`, 3000);
        } else {
            showNotification('error', '❌ Kode promo tidak valid!', 3000);
        }
    };

    // Animate item changes
    const animateItem = (itemId) => {
        setAnimatingItems(prev => new Set([...prev, itemId]));
        setTimeout(() => {
            setAnimatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }, 300);
    };

    // Increase quantity
    const incqty = (product) => {
        const exist = cart.find((x) => x.id === product.id);
        setCart(cart.map((curElm) => 
            curElm.id === product.id ? {...exist, qty: exist.qty + 1} : curElm
        ));
        animateItem(product.id);
        showNotification('success', `✨ ${product.Title} ditambah! Qty: ${exist.qty + 1}`, 2000);
    }

    // Decrease quantity
    const decqty = (product) => {
        const exist = cart.find((x) => x.id === product.id);
        if(exist.qty > 1) {
            setCart(cart.map((curElm) => 
                curElm.id === product.id ? {...exist, qty: exist.qty - 1} : curElm
            ));
            animateItem(product.id);
            showNotification('info', `📉 ${product.Title} dikurangi! Qty: ${exist.qty - 1}`, 2000);
        } else {
            showNotification('warning', '⚠️ Kuantitas minimal adalah 1!', 2000);
        }
    }

    // Remove product from cart
    const removeproduct = (product) => {
        setCart(cart.filter((x) => x.id !== product.id));
        showNotification('success', `🗑️ ${product.Title} dihapus dari keranjang!`, 3000);
    }

    // Save for later
    const saveForLater = (product) => {
        setSavedItems([...savedItems, product]);
        removeproduct(product);
        showNotification('info', `💾 ${product.Title} disimpan untuk nanti!`, 3000);
    }

    // Move back to cart
    const moveToCart = (product) => {
        setCart([...cart, {...product, qty: 1}]);
        setSavedItems(savedItems.filter(item => item.id !== product.id));
        showNotification('success', `🛒 ${product.Title} dipindah ke keranjang!`, 3000);
    }

    // Clear entire cart
    const clearCart = () => {
        if (window.confirm('Yakin ingin mengosongkan keranjang?')) {
            setCart([]);
            showNotification('info', '🧹 Keranjang dikosongkan!', 3000);
        }
    }

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

            <div className='cart-container'>
                {/* Cart Header */}
                <div className='cart-header'>
                    <div className='header-content'>
                        <h1><AiOutlineShoppingCart /> Keranjang Belanja</h1>
                    </div>
                    {cart.length > 0 && (
                        <button className='clear-cart-btn' onClick={clearCart}>
                            <BsTrash /> Kosongkan
                        </button>
                    )}
                </div>

                {/* Security Badges */}
                <div className='security-info'>
                    <div className='security-badge'>
                        <BsShieldCheck /> Pembayaran Aman
                    </div>
                    <div className='security-badge'>
                        <BsTruck /> Gratis Ongkir $100
                    </div>
                    <div className='security-badge'>
                        <FaPercent /> Diskon 10% $200
                    </div>
                </div>

                {/* Empty Cart */}
                {cart.length === 0 && (
                    <div className='empty-cart'>
                        <div className='empty-cart-icon'>
                            <AiOutlineShoppingCart />
                        </div>
                        <h2>Keranjang Kosong</h2>
                        <p>Belum ada produk yang dipilih. Yuk mulai belanja!</p>
                        <Link to='/product' className='shop-now-btn'>
                            <FaGift /> Mulai Belanja
                        </Link>
                    </div>
                )}

                {/* Cart Content */}
                {cart.length > 0 && (
                    <div className='cart-content'>
                        {/* Cart Items */}
                        <div className='cart-items'>
                            <div className='items-header'>
                                <h3>Produk ({cart.length} item)</h3>
                            </div>
                            
                            {cart.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`cart-item ${animatingItems.has(item.id) ? 'animating' : ''}`}
                                >
                                    <div className='item-image'>
                                        <img src={item.Img} alt={item.Title} />
                                        <div className='item-badge'>New</div>
                                    </div>
                                    
                                    <div className='item-details'>
                                        <div className='item-info'>
                                            <span className='item-category'>{item.Cat}</span>
                                            <h4 className='item-title'>{item.Title}</h4>
                                            <p className='item-price'>${item.Price}</p>
                                        </div>
                                        
                                        <div className='item-actions'>
                                            <div className='quantity-controls'>
                                                <button 
                                                    className='qty-btn decrease' 
                                                    onClick={() => decqty(item)}
                                                    disabled={item.qty <= 1}
                                                >
                                                    <AiOutlineMinus />
                                                </button>
                                                <span className='quantity'>{item.qty}</span>
                                                <button 
                                                    className='qty-btn increase' 
                                                    onClick={() => incqty(item)}
                                                >
                                                    <AiOutlinePlus />
                                                </button>
                                            </div>
                                            
                                            <div className='item-total'>
                                                <span className='total-price'>${(item.Price * item.qty).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className='item-options'>
                                            <button 
                                                className='save-later-btn'
                                                onClick={() => saveForLater(item)}
                                            >
                                                <AiOutlineHeart /> Simpan Nanti
                                            </button>
                                            <button 
                                                className='remove-btn'
                                                onClick={() => removeproduct(item)}
                                            >
                                                <AiOutlineClose /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className='order-summary'>
                            <div className='summary-header'>
                                <h3>Ringkasan Pesanan</h3>
                            </div>
                            
                            <div className='summary-details'>
                                <div className='summary-row'>
                                    <span>Subtotal ({cart.length} item)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                
                                {discount > 0 && (
                                    <div className='summary-row discount'>
                                        <span>💰 Diskon (10%)</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className='summary-row'>
                                    <span>Ongkos Kirim</span>
                                    <span className={shipping === 0 ? 'free' : ''}>
                                        {shipping === 0 ? 'GRATIS' : `$${shipping}`}
                                    </span>
                                </div>
                                
                                <div className='summary-divider'></div>
                                
                                <div className='summary-row total'>
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className='promo-section'>
                                <input 
                                    type='text' 
                                    placeholder='Kode promo'
                                    className='promo-input'
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <button className='apply-promo-btn' onClick={applyPromoCode}>Terapkan</button>
                            </div>
                            
                            <Link to="/payment" className="checkout-link">
                                <button className='checkout-btn'>
                                    <span>Lanjut Pembayaran</span>
                                    <BsArrowRight />
                                </button>
                            </Link>
                            
                            <div className='continue-shopping'>
                                <Link to='/product'>← Lanjut Belanja</Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Saved Items */}
                {savedItems.length > 0 && (
                    <div className='saved-items'>
                        <h3>Disimpan untuk Nanti ({savedItems.length})</h3>
                        <div className='saved-items-grid'>
                            {savedItems.map((item) => (
                                <div key={item.id} className='saved-item'>
                                    <img src={item.Img} alt={item.Title} />
                                    <div className='saved-item-info'>
                                        <h5>{item.Title}</h5>
                                        <p>${item.Price}</p>
                                        <button 
                                            className='move-to-cart-btn'
                                            onClick={() => moveToCart(item)}
                                        >
                                            Pindah ke Keranjang
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Cart
