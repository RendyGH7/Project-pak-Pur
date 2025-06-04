import "./Navbar.css";
import React, { useState, useEffect } from 'react'
import { FaTruckMoving, FaSearch } from 'react-icons/fa';
import { BsBagCheck } from 'react-icons/bs';
import { FaClipboardList } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/images/logoatas.png'; 
import Login from '../Login/Login';

const Nav = ({searchbtn}) => {
    const [search, setSearch] = useState('')
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        // Check if user is logged in from localStorage
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
            setIsAuthenticated(true)
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = () => {
        if (search.trim()) {
            searchbtn(search)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleCloseLogin = () => {
        setIsLoginModalOpen(false);
    };

    const handleLoginSuccess = (userData) => {
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(userData))
        setIsLoginModalOpen(false)
    }

    const handleLogout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
    }

    return (
        <>
            {/* Promo Banner */}
            <div className='promo-banner'>
                <div className='promo-content'>
                    <div className='promo-icon'>
                        <FaTruckMoving /> 
                    </div>
                    <p>FREE Shipping when shopping up to $1000</p>
                </div>
            </div>

            {/* Main Header */}
            <div className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className='header-container'>
                    {/* Logo */}
                    <div className='logo-section'>
                        <img className='logo' src={logoImage} alt='ZonaHPF Logo' />
                    </div>

                    {/* Search Box */}
                    <div className='search-section'>
                        <div className='search-box'>
                            <input 
                                type='text' 
                                value={search} 
                                placeholder='Search your product...' 
                                autoComplete='off' 
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button onClick={handleSearch} className='search-btn'>
                                <FaSearch />
                            </button>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className='user-actions'>
                        {isAuthenticated && (
                            <div className='user-profile'>
                                <Link to="/profil" className='profile-link'>
                                    <div className='user-avatar'>
                                        <AiOutlineUser />
                                    </div>
                                    <span className='user-greeting'>Hello, {user.name}</span>
                                </Link>
                            </div>
                        )}
                        
                        <Link to="/cart" className='cart-link'>
                            <div className='cart-icon'>
                                <BsBagCheck />
                                <span className='cart-badge'></span>
                            </div>
                        </Link>

                        <Link to="/orders" className='cart-link'>
                            <div className='cart-icon'>
                                <FaClipboardList />
                                <span className='cart-badge'></span>
                            </div>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className='mobile-menu-toggle'
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className={`navigation ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className='nav-container'>
                    <ul className='nav-menu'>
                        <li><Link to='/' className='nav-link'>Home</Link></li>
                        <li><Link to='/product' className='nav-link'>Products</Link></li>
                        <li><Link to='/about' className='nav-link'>About</Link></li>
                        <li><Link to='/contact' className='nav-link'>Contact</Link></li>
                    </ul>
                    
                    <div className='auth-section'>
                        {isAuthenticated ? (
                            <button 
                                className="logout-btn" 
                                onClick={handleLogout}
                            >
                                <CiLogout />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <button 
                                className="login-btn" 
                                onClick={handleLoginClick}
                            >
                                <AiOutlineUser />
                                <span>Login</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className='mobile-overlay'
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}
            
            <Login 
                isOpen={isLoginModalOpen} 
                onClose={handleCloseLogin}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    )
}

export default Nav


