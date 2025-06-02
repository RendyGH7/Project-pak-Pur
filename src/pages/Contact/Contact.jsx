import React, { useState, useEffect } from 'react'
import './contact.css'
import { useAuth0 } from "@auth0/auth0-react";
import { FaUser, FaEnvelope, FaTag, FaCommentDots, FaPaperPlane, FaMapMarkerAlt, FaPhone, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { BsShieldCheck, BsHeadset, BsChatDots } from 'react-icons/bs';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Contact = () => {
    const { loginWithRedirect, logout, user, isAuthenticated} = useAuth0();
    const [users, setUser] = useState({
        Name: '', Email: '', Subject: '', Message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [formErrors, setFormErrors] = useState({});
    
    let name, value;
    
    const data = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({...users, [name]: value});
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors({...formErrors, [name]: ''});
        }
    }
    
    const validateForm = () => {
        const errors = {};
        if (!users.Name.trim()) errors.Name = 'Nama wajib diisi';
        if (!users.Email.trim()) errors.Email = 'Email wajib diisi';
        else if (!/\S+@\S+\.\S+/.test(users.Email)) errors.Email = 'Format email tidak valid';
        if (!users.Subject.trim()) errors.Subject = 'Subject wajib diisi';
        if (!users.Message.trim()) errors.Message = 'Pesan wajib diisi';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }
    
    const senddata = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        const{ Name, Email, Subject, Message} = users;
        
        try {
            // Simpan ke localStorage untuk admin dashboard
            const existingMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
            const newMessage = {
                id: Date.now(),
                name: Name,
                email: Email,
                subject: Subject,
                message: Message,
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                status: 'unread',
                priority: Subject.toLowerCase().includes('urgent') || Subject.toLowerCase().includes('penting') ? 'high' : 'normal'
            };
            
            localStorage.setItem('adminMessages', JSON.stringify([newMessage, ...existingMessages]));
            
            // Juga kirim ke Firebase (opsional)
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMessage)
            }
            
            // Simulasi pengiriman ke server
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setShowSuccess(true);
            setUser({ Name: '', Email: '', Subject: '', Message: '' });
            setFocusedField(''); // Reset focused field
            
            // Auto hide success message
            setTimeout(() => setShowSuccess(false), 5000);
            
        } catch (error) {
            console.error('Error:', error);
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setIsLoading(false);
        }
    }
    
    const contactInfo = [
        { icon: FaMapMarkerAlt, title: 'Alamat', info: 'Jl. Teknologi No. 123, Jakarta Selatan' },
        { icon: FaPhone, title: 'Telepon', info: '+62 896 6955 7444' },
        { icon: FaEnvelope, title: 'Email', info: 'renfertz@ecommerce.com' },
        { icon: FaClock, title: 'Jam Operasional', info: 'Senin - Jumat: 09:00 - 18:00' }
    ];
    
    const features = [
        { icon: BsShieldCheck, title: 'Respon Cepat', desc: 'Balasan dalam 24 jam' },
        { icon: BsHeadset, title: 'Support 24/7', desc: 'Tim siap membantu Anda' },
        { icon: BsChatDots, title: 'Live Chat', desc: 'Chat langsung dengan tim' }
    ];

    return (
        <>
            <div className='contact-container'>
                {/* Hero Section */}
                <div className='contact-hero'>
                    <div className='hero-content'>
                        <h1>Hubungi Kami</h1>
                        <p>Kami siap membantu Anda dengan pertanyaan, saran, atau keluhan. Tim customer service kami akan merespon dengan cepat.</p>
                    </div>
                    <div className='hero-decoration'>
                        <div className='floating-icon'>
                            <FaCommentDots />
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className='features-section'>
                    {features.map((feature, index) => (
                        <div key={index} className='feature-card'>
                            <div className='feature-icon'>
                                <feature.icon />
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className='contact-content'>
                    {/* Contact Form */}
                    <div className='form-section'>
                        <div className='form-header'>
                            <h2>Kirim Pesan</h2>
                            <p>Isi formulir di bawah ini dan kami akan segera menghubungi Anda</p>
                        </div>
                        
                        {/* Success/Error Messages */}
                        {showSuccess && (
                            <div className='alert alert-success'>
                                <FaCheckCircle />
                                <span>Pesan berhasil dikirim! Kami akan segera menghubungi Anda.</span>
                            </div>
                        )}
                        
                        {showError && (
                            <div className='alert alert-error'>
                                <FaExclamationTriangle />
                                <span>Terjadi kesalahan. Silakan coba lagi.</span>
                            </div>
                        )}
                        
                        <form className='modern-form' onSubmit={senddata}>
                            <div className='form-row'>
                                <div className='input-group'>
                                    <div className={`input-wrapper ${focusedField === 'Name' || users.Name ? 'focused' : ''} ${formErrors.Name ? 'error' : ''}`}>
                                        <FaUser className='input-icon' />
                                        <input 
                                            type='text' 
                                            name='Name' 
                                            value={users.Name} 
                                            onChange={data}
                                            onFocus={() => setFocusedField('Name')}
                                            onBlur={() => setFocusedField('')}
                                            required 
                                        />
                                        <label>Nama Lengkap</label>
                                    </div>
                                    {formErrors.Name && <span className='error-text'>{formErrors.Name}</span>}
                                </div>
                                
                                <div className='input-group'>
                                    <div className={`input-wrapper ${focusedField === 'Email' || users.Email ? 'focused' : ''} ${formErrors.Email ? 'error' : ''}`}>
                                        <FaEnvelope className='input-icon' />
                                        <input 
                                            type='email' 
                                            name='Email' 
                                            value={users.Email} 
                                            onChange={data}
                                            onFocus={() => setFocusedField('Email')}
                                            onBlur={() => setFocusedField('')}
                                            required 
                                        />
                                        <label>Email Address</label>
                                    </div>
                                    {formErrors.Email && <span className='error-text'>{formErrors.Email}</span>}
                                </div>
                            </div>
                            
                            <div className='input-group'>
                                <div className={`input-wrapper ${focusedField === 'Subject' || users.Subject ? 'focused' : ''} ${formErrors.Subject ? 'error' : ''}`}>
                                    <FaTag className='input-icon' />
                                    <input 
                                        type='text' 
                                        name='Subject' 
                                        value={users.Subject} 
                                        onChange={data}
                                        onFocus={() => setFocusedField('Subject')}
                                        onBlur={() => setFocusedField('')}
                                        required 
                                    />
                                    <label>Subject</label>
                                </div>
                                {formErrors.Subject && <span className='error-text'>{formErrors.Subject}</span>}
                            </div>
                            
                            <div className='input-group'>
                                <div className={`input-wrapper textarea-wrapper ${focusedField === 'Message' || users.Message ? 'focused' : ''} ${formErrors.Message ? 'error' : ''}`}>
                                    <FaCommentDots className='input-icon' />
                                    <textarea 
                                        name='Message' 
                                        value={users.Message} 
                                        onChange={data}
                                        onFocus={() => setFocusedField('Message')}
                                        onBlur={() => setFocusedField('')}
                                        rows='5'
                                        required
                                    ></textarea>
                                    <label>Pesan Anda</label>
                                </div>
                                {formErrors.Message && <span className='error-text'>{formErrors.Message}</span>}
                            </div>
                            
                            <div className='submit-section'>
                                {isAuthenticated ? (
                                    <button 
                                        type='submit' 
                                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <AiOutlineLoading3Quarters className='loading-icon' />
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Kirim Pesan
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button 
                                        type='button' 
                                        className='login-btn'
                                        onClick={() => loginWithRedirect()}
                                    >
                                        Login untuk Mengirim Pesan
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className='info-section'>
                        <div className='info-header'>
                            <h2>Informasi Kontak</h2>
                            <p>Atau hubungi kami langsung melalui:</p>
                        </div>
                        
                        <div className='contact-cards'>
                            {contactInfo.map((item, index) => (
                                <div key={index} className='contact-card'>
                                    <div className='card-icon'>
                                        <item.icon />
                                    </div>
                                    <div className='card-content'>
                                        <h4>{item.title}</h4>
                                        <p>{item.info}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Map Placeholder */}
                        <div className='map-section'>
                            <h3>Lokasi Kami</h3>
                            <div className='map-placeholder'>
                                <FaMapMarkerAlt />
                                <p>Interactive Map Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact