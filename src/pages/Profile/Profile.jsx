import React, { useState, useEffect, createContext, useContext } from "react";
import "./Profile.css";
import { Link } from "react-router-dom";

// Context untuk sharing profile data dengan home page
export const ProfileContext = createContext();

const defaultAvatar = "https://randomuser.me/api/portraits/men/32.jpg";

const Profil = () => {
  // Remove Auth0 and use custom authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState('gradient');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    location: "",
    bio: "",
    website: "",
    phone: "",
    birthdate: "",
    gender: "",
    social: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: ""
    },
    preferences: {
      language: "id",
      timezone: "Asia/Jakarta",
      currency: "IDR"
    }
  });

  const [stats, setStats] = useState({
    orders: 0,
    reviews: 0,
    wishlist: 0,
    points: 100
  });

  // Load user data from localStorage
  useEffect(() => {
    const loadUserData = () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
        
        console.log('Loading user data:', { isLoggedIn, userData, userProfile }); // Debug log
        
        if (isLoggedIn && userData) {
          setIsAuthenticated(true);
          setCurrentUser(userData);
          
          if (userProfile) {
            setProfile({
              name: userProfile.name || userData.name || "",
              username: userProfile.username || userData.name?.toLowerCase().replace(/\s+/g, '') || "",
              email: userProfile.email || userData.email || "",
              password: "", // Never show password
              location: userProfile.location || "",
              bio: userProfile.bio || "",
              website: userProfile.website || "",
              phone: userProfile.phone || "",
              birthdate: userProfile.birthdate || "",
              gender: userProfile.gender || "",
              social: userProfile.social || {
                instagram: "",
                facebook: "",
                twitter: "",
                linkedin: "",
                youtube: ""
              },
              preferences: userProfile.preferences || {
                language: "id",
                timezone: "Asia/Jakarta",
                currency: "IDR"
              }
            });
            
            setAvatar(userProfile.avatar || defaultAvatar);
            setTheme(userProfile.theme || 'gradient');
            setStats(userProfile.stats || {
              orders: 0,
              reviews: 0,
              wishlist: 0,
              points: 100
            });
          } else {
            // If no profile exists, create one from user data
            const newProfile = {
              name: userData.name || "",
              username: userData.name?.toLowerCase().replace(/\s+/g, '') || "",
              email: userData.email || "",
              password: "",
              location: "",
              bio: "Welcome to ZonaHPF! 🛍️",
              website: "",
              phone: "",
              birthdate: "",
              gender: "",
              social: {
                instagram: "",
                facebook: "",
                twitter: "",
                linkedin: "",
                youtube: ""
              },
              preferences: {
                language: "id",
                timezone: "Asia/Jakarta",
                currency: "IDR"
              }
            };
            setProfile(newProfile);
          }
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };
    
    loadUserData();
    
    // Listen for login events
    const handleUserLogin = (event) => {
      console.log('User login event received:', event.detail); // Debug log
      loadUserData();
    };
    
    window.addEventListener('userLoggedIn', handleUserLogin);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin);
    };
  }, []);

  // Update localStorage dan trigger event untuk home page
  const updateProfileData = (newProfile) => {
    try {
      const updatedProfile = {
        ...newProfile,
        avatar,
        theme,
        stats,
        id: currentUser?.id,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Dispatch custom event untuk update home page
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { profile: newProfile, avatar, theme, stats }
      }));
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newProfile = { ...profile, [name]: value };
    setProfile(newProfile);
    updateProfileData(newProfile);
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    const newProfile = {
      ...profile,
      social: { ...profile.social, [name]: value }
    };
    setProfile(newProfile);
    updateProfileData(newProfile);
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    const newProfile = {
      ...profile,
      preferences: { ...profile.preferences, [name]: value }
    };
    setProfile(newProfile);
    updateProfileData(newProfile);
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const newAvatar = ev.target.result;
        setAvatar(newAvatar);
        updateProfileData(profile);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    setAvatar(defaultAvatar);
    updateProfileData(profile);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateProfileData(profile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileData(profile);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
    setCurrentUser(null);
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="login-prompt">
          <h2>Silakan Login</h2>
          <p>Anda perlu login untuk mengakses halaman profil.</p>
          <button 
            className="login-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))}
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`profil-side-container theme-${theme}`}>
      <div className="profil-card modern-card">
        {/* Header */}
        <div className="profil-header">
          <Link to="/" className="profil-back-btn">
            <span>←</span> Home
          </Link>
          <div className="theme-selector">
            <button 
              className={`theme-btn ${theme === 'gradient' ? 'active' : ''}`}
              onClick={() => handleThemeChange('gradient')}
              title="Gradient Theme"
            >
              🌈
            </button>
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
              title="Dark Theme"
            >
              🌙
            </button>
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
              title="Light Theme"
            >
              ☀️
            </button>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>

        {/* Profile Header */}
        <div className="profile-header-section">
          <div className="avatar-container">
            <img src={avatar} alt="Avatar" className="profil-avatar-large" />
            <div className="avatar-overlay">
              <label className="avatar-edit-btn">
                📷
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
              </label>
            </div>
            <div className="online-indicator"></div>
          </div>
          <div className="profile-info">
            <h1>{profile.name || 'User Name'}</h1>
            <p className="username">@{profile.username || 'username'}</p>
            <p className="bio">{profile.bio || 'No bio available'}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.orders}</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.reviews}</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.wishlist}</span>
                <span className="stat-label">Wishlist</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.points}</span>
                <span className="stat-label">Points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            🌐 Social
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Settings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
        </div>

        {/* Content */}
        <form className="profil-form" onSubmit={handleSubmit}>
          {activeTab === 'profile' && (
            <div className="tab-content profile-tab">
              <div className="form-section">
                <h3>📝 Personal Information</h3>
                <div className="profil-row">
                  <div className="profil-field">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      id="name" 
                      type="text" 
                      name="name" 
                      value={profile.name} 
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="profil-field">
                    <label htmlFor="username">Username</label>
                    <input 
                      id="username" 
                      type="text" 
                      name="username" 
                      value={profile.username} 
                      onChange={handleChange}
                      placeholder="Choose a username"
                    />
                  </div>
                </div>
                <div className="profil-row">
                  <div className="profil-field">
                    <label htmlFor="email">Email</label>
                    <input 
                      id="email" 
                      type="email" 
                      name="email" 
                      value={profile.email} 
                      onChange={handleChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="profil-field">
                    <label htmlFor="phone">Phone</label>
                    <input 
                      id="phone" 
                      type="tel" 
                      name="phone" 
                      value={profile.phone} 
                      onChange={handleChange}
                      placeholder="+62 xxx xxx xxx"
                    />
                  </div>
                </div>
                <div className="profil-row">
                  <div className="profil-field">
                    <label htmlFor="location">Location</label>
                    <input 
                      id="location" 
                      type="text" 
                      name="location" 
                      value={profile.location} 
                      onChange={handleChange}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="profil-field">
                    <label htmlFor="website">Website</label>
                    <input 
                      id="website" 
                      type="url" 
                      name="website" 
                      value={profile.website} 
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div className="profil-field">
                  <label htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    value={profile.bio} 
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="tab-content social-tab">
              <div className="form-section">
                <h3>🌐 Social Media Links</h3>
                <div className="social-grid">
                  <div className="profil-field social-field">
                    <label htmlFor="instagram">📷 Instagram</label>
                    <input 
                      id="instagram" 
                      type="text" 
                      name="instagram" 
                      value={profile.social.instagram} 
                      onChange={handleSocialChange}
                      placeholder="@username"
                    />
                  </div>
                  <div className="profil-field social-field">
                    <label htmlFor="facebook">📘 Facebook</label>
                    <input 
                      id="facebook" 
                      type="text" 
                      name="facebook" 
                      value={profile.social.facebook} 
                      onChange={handleSocialChange}
                      placeholder="facebook.com/username"
                    />
                  </div>
                  <div className="profil-field social-field">
                    <label htmlFor="twitter">🐦 Twitter</label>
                    <input 
                      id="twitter" 
                      type="text" 
                      name="twitter" 
                      value={profile.social.twitter} 
                      onChange={handleSocialChange}
                      placeholder="@username"
                    />
                  </div>
                  <div className="profil-field social-field">
                    <label htmlFor="linkedin">💼 LinkedIn</label>
                    <input 
                      id="linkedin" 
                      type="text" 
                      name="linkedin" 
                      value={profile.social.linkedin} 
                      onChange={handleSocialChange}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div className="profil-field social-field">
                    <label htmlFor="youtube">📺 YouTube</label>
                    <input 
                      id="youtube" 
                      type="text" 
                      name="youtube" 
                      value={profile.social.youtube} 
                      onChange={handleSocialChange}
                      placeholder="youtube.com/c/channel"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="tab-content preferences-tab">
              <div className="form-section">
                <h3>⚙️ Preferences</h3>
                <div className="profil-row">
                  <div className="profil-field">
                    <label htmlFor="language">Language</label>
                    <select 
                      id="language" 
                      name="language" 
                      value={profile.preferences.language} 
                      onChange={handlePreferenceChange}
                    >
                      <option value="id">🇮🇩 Bahasa Indonesia</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="zh">🇨🇳 中文</option>
                    </select>
                  </div>
                  <div className="profil-field">
                    <label htmlFor="timezone">Timezone</label>
                    <select 
                      id="timezone" 
                      name="timezone" 
                      value={profile.preferences.timezone} 
                      onChange={handlePreferenceChange}
                    >
                      <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                      <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                      <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                    </select>
                  </div>
                </div>
                <div className="profil-field">
                  <label htmlFor="currency">Currency</label>
                  <select 
                    id="currency" 
                    name="currency" 
                    value={profile.preferences.currency} 
                    onChange={handlePreferenceChange}
                  >
                    <option value="IDR">💰 Indonesian Rupiah (IDR)</option>
                    <option value="USD">💵 US Dollar (USD)</option>
                    <option value="EUR">💶 Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-content notifications-tab">
              <div className="form-section">
                <h3>🔔 Notification Settings</h3>
                <div className="notification-options">
                  <div className="notification-item">
                    <div className="notification-info">
                      <span className="notification-title">📧 Email Notifications</span>
                      <span className="notification-desc">Receive updates via email</span>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <span className="notification-title">📱 Push Notifications</span>
                      <span className="notification-desc">Receive push notifications</span>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <span className="notification-title">💬 SMS Notifications</span>
                      <span className="notification-desc">Receive SMS updates</span>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="profil-update-btn">
              <span>💾</span> Update Profile
            </button>
            <button type="button" className="profil-cancel-btn" onClick={() => setIsEditing(false)}>
              <span>❌</span> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profil;