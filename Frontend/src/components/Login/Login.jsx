import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaGoogle, FaFacebook, FaGithub, FaEye, FaEyeSlash, FaUser, FaLock, FaEnvelope, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import './Login.css'

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isSignUp, setIsSignUp] = useState(false)
  const [animationClass, setAnimationClass] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('login-modal-enter')
      document.body.style.overflow = 'hidden'
      setLoginError(null)
      setSuccessMessage(null)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'weak'
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'strong'
    return 'medium'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Check password strength for signup
    if (name === 'password' && isSignUp) {
      setPasswordStrength(checkPasswordStrength(value))
    }

    if (loginError) setLoginError(null)
    if (successMessage) setSuccessMessage(null)
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLoginError('Email dan password harus diisi')
      return false
    }

    if (isSignUp) {
      if (!formData.name || formData.name.trim().length < 2) {
        setLoginError('Nama harus minimal 2 karakter')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setLoginError('Password dan konfirmasi password tidak sama')
        return false
      }
      if (formData.password.length < 6) {
        setLoginError('Password minimal 6 karakter')
        return false
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLoginError('Format email tidak valid')
      return false
    }

    return true
  }

  const createUserProfile = (userData) => {
    const userProfile = {
      id: userData.id,
      name: userData.name,
      username: userData.name.toLowerCase().replace(/\s+/g, ''),
      email: userData.email,
      location: '',
      bio: '',
      website: '',
      phone: '',
      birthdate: '',
      gender: '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=667eea&color=fff&size=200`,
      theme: 'gradient',
      social: {
        instagram: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        youtube: ''
      },
      preferences: {
        language: 'id',
        timezone: 'Asia/Jakarta',
        currency: 'IDR'
      },
      stats: {
        orders: 0,
        reviews: 0,
        wishlist: 0,
        points: 100
      },
      createdAt: userData.createdAt || new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
    localStorage.setItem('isLoggedIn', 'true')
    
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true')
      localStorage.setItem('rememberedEmail', userData.email)
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('userLoggedIn', {
      detail: { user: userData, profile: userProfile }
    }))
    
    return userProfile
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setLoginError(null)
    setSuccessMessage(null)

    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000))

      if (isSignUp) {
        // Register logic
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const existingUser = users.find(user => user.email.toLowerCase() === formData.email.toLowerCase())
        
        if (existingUser) {
          setLoginError('Email sudah terdaftar. Silakan gunakan email lain atau masuk dengan akun yang ada.')
          setIsLoading(false)
          return
        }

        const newUser = {
          id: Date.now() + Math.random(),
          name: formData.name.trim(),
          email: formData.email.toLowerCase(),
          password: formData.password, // In real app, this should be hashed
          createdAt: new Date().toISOString(),
          isVerified: true
        }

        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        
        setSuccessMessage(`Akun berhasil dibuat! Selamat datang, ${newUser.name}`)
        
        // Auto login after successful registration
        setTimeout(() => {
          const userProfile = createUserProfile(newUser)
          const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
          onLoginSuccess(userData)
        }, 1500)
        
      } else {
        // Login logic
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const user = users.find(u => 
          u.email.toLowerCase() === formData.email.toLowerCase() && 
          u.password === formData.password
        )
        
        if (!user) {
          setLoginError('Email atau password salah. Periksa kembali kredensial Anda.')
          setIsLoading(false)
          return
        }

        // Update last login
        user.lastLogin = new Date().toISOString()
        const userIndex = users.findIndex(u => u.id === user.id)
        users[userIndex] = user
        localStorage.setItem('users', JSON.stringify(users))
        
        setSuccessMessage(`Selamat datang kembali, ${user.name}!`)
        
        // Login success
        setTimeout(() => {
          const userProfile = createUserProfile(user)
          const userData = { id: user.id, name: user.name, email: user.email }
          onLoginSuccess(userData)
        }, 1000)
      }

    } catch (error) {
      console.error('Login/Register error:', error)
      setLoginError('Terjadi kesalahan sistem. Silakan coba lagi dalam beberapa saat.')
    } finally {
      if (!successMessage) {
        setIsLoading(false)
      }
    }
  }

  const handleSocialLogin = (provider) => {
    setLoginError(null)
    setSuccessMessage(null)
    setIsLoading(true)
    
    // Simulate social login with more realistic flow
    setTimeout(() => {
      const userData = {
        id: Date.now() + Math.random(),
        name: `${provider} User`,
        email: `user.${Date.now()}@${provider.toLowerCase()}.com`,
        createdAt: new Date().toISOString(),
        provider: provider.toLowerCase(),
        isVerified: true
      }
      
      // Save to users list
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const existingUser = users.find(user => 
        user.email === userData.email || 
        (user.provider === userData.provider && user.name === userData.name)
      )
      
      if (!existingUser) {
        users.push(userData)
        localStorage.setItem('users', JSON.stringify(users))
        setSuccessMessage(`Berhasil masuk dengan ${provider}!`)
      } else {
        setSuccessMessage(`Selamat datang kembali!`)
        userData.id = existingUser.id
        userData.name = existingUser.name
      }
      
      setTimeout(() => {
        createUserProfile(userData)
        onLoginSuccess(userData)
        setIsLoading(false)
      }, 1000)
    }, 1200)
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setAnimationClass('form-flip')
    setLoginError(null)
    setSuccessMessage(null)
    setPasswordStrength('')
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setTimeout(() => setAnimationClass(''), 300)
  }

  const handleClose = () => {
    setAnimationClass('login-modal-exit')
    setTimeout(() => {
      onClose()
      // Reset form when closing
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      setLoginError(null)
      setSuccessMessage(null)
      setIsSignUp(false)
      setAnimationClass('')
    }, 300)
  }

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail')
    const shouldRemember = localStorage.getItem('rememberMe')
    if (rememberedEmail && shouldRemember === 'true') {
      setFormData(prev => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className={`login-overlay ${animationClass}`}>
      <div className="login-modal">
        <button 
          className="login-close-btn" 
          onClick={handleClose}
          aria-label="Tutup modal login"
        >
          <AiOutlineClose />
        </button>
        
        <div className="login-container">
          {/* Left Side - Branding */}
          <div className="login-branding">
            <div className="brand-content">
              <h1 className="brand-title">ZonaHPF</h1>
              <p className="brand-subtitle">
                {isSignUp 
                  ? 'Bergabunglah dengan komunitas belanja terbaik dan nikmati pengalaman berbelanja yang tak terlupakan' 
                  : 'Selamat datang kembali! Lanjutkan perjalanan belanja Anda bersama kami'
                }
              </p>
              <div className="brand-features">
                <div className="feature-item" style={{'--delay': '0s'}}>
                  <span className="feature-icon">🛍️</span>
                  <span>Belanja Mudah & Cepat</span>
                </div>
                <div className="feature-item" style={{'--delay': '0.5s'}}>
                  <span className="feature-icon">🚚</span>
                  <span>Pengiriman Gratis</span>
                </div>
                <div className="feature-item" style={{'--delay': '1s'}}>
                  <span className="feature-icon">🔒</span>
                  <span>Pembayaran Aman</span>
                </div>
              </div>
            </div>
            <div className="brand-animation">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section">
            <div className={`login-form ${animationClass} ${isSignUp ? 'form-mode-register' : ''}`}>
              <div className="form-header">
                <h2>{isSignUp ? 'Buat Akun Baru' : 'Masuk ke Akun'}</h2>
                <p>
                  {isSignUp 
                    ? 'Daftar sekarang untuk mendapatkan akses ke ribuan produk pilihan dan penawaran eksklusif' 
                    : 'Masuk untuk melanjutkan belanja dan mengakses wishlist Anda'
                  }
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="success-message">
                  <FaCheckCircle />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Display */}
              {loginError && (
                <div className="error-message">
                  <FaExclamationTriangle />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="social-login">
                <button 
                  className="social-btn google-btn" 
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <FaGoogle />
                  <span>{isSignUp ? 'Daftar' : 'Masuk'} dengan Google</span>
                </button>
                
                <button 
                  className="social-btn facebook-btn" 
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={isLoading}
                >
                  <FaFacebook />
                  <span>{isSignUp ? 'Daftar' : 'Masuk'} dengan Facebook</span>
                </button>
                
                <button 
                  className="social-btn github-btn" 
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={isLoading}
                >
                  <FaGithub />
                  <span>{isSignUp ? 'Daftar' : 'Masuk'} dengan GitHub</span>
                </button>
              </div>

              <div className="divider">
                <span>atau {isSignUp ? 'daftar' : 'masuk'} dengan email</span>
              </div>

              {/* Email Form */}
              <form className="email-form" onSubmit={handleSubmit}>
                {isSignUp && (
                  <div className="input-group">
                    <div className="input-wrapper">
                      <FaUser className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Nama Lengkap"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={isSignUp}
                        autoComplete="name"
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Alamat Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {isSignUp && formData.password && (
                    <div className={`password-strength ${passwordStrength}`}>
                      <small>
                        Kekuatan password: {
                          passwordStrength === 'weak' ? '❌ Lemah' :
                          passwordStrength === 'medium' ? '⚠️ Sedang' : '✅ Kuat'
                        }
                      </small>
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="input-group">
                    <div className="input-wrapper">
                      <FaLock className="input-icon" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Konfirmasi Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={isSignUp}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                )}

                {!isSignUp && (
                  <div className="form-options">
                    <label className="remember-me">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Ingat saya</span>
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                      Lupa password?
                    </Link>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <span>{isSignUp ? 'Buat Akun Sekarang' : 'Masuk ke Akun'}</span>
                  )}
                </button>
              </form>

              <div className="form-footer">
                <p>
                  {isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'}
                  <button 
                    className="toggle-mode-btn" 
                    onClick={toggleMode}
                    disabled={isLoading}
                  >
                    {isSignUp ? 'Masuk di sini' : 'Daftar sekarang'}
                  </button>
                </p>
              </div>

              <div className="terms">
                <p>
                  Dengan {isSignUp ? 'mendaftar' : 'masuk'}, Anda menyetujui{' '}
                  <Link to="/terms">Syarat & Ketentuan</Link> dan{' '}
                  <Link to="/privacy">Kebijakan Privasi</Link> kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login