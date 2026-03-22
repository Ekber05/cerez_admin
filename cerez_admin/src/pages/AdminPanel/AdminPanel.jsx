import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminPanel.css';
import AllOrders from './components/AllOrders';
import ProfileContent from './components/ProfileContent';
import ProductList from './components/ProductList';
import ProductUpload from './components/ProductUpload';
import Dashboard from './components/Dashboard';
import MessageSection from './components/MessageSection/MessageSection';
import { useOrders } from '../../hooks/useOrders';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationsPage from './components/notifications/NotificationsPage';
import Campaigns from './components/Campaigns';
import Blog from './components/Blog'; // Blog komponentini import et
import { 
  FiSearch, FiBell, FiMail, FiUser, FiMenu, 
  FiHome, FiUsers, FiShoppingBag, FiFileText, 
  FiShoppingCart, FiMessageSquare, FiBell as FiBellIcon,
  FiSettings, FiFile, FiLogOut, FiUserCheck, FiPackage,
  FiShoppingCart as FiCartIcon, FiXCircle, FiChevronDown,
  FiList, FiUpload, FiBarChart2, FiTrendingUp, FiEdit
} from 'react-icons/fi';

// Placeholder komponenti silindi - artıq real Blog komponentimiz var

const AdminPanel = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeProductSubPage, setActiveProductSubPage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    todayOrders, 
    loading: ordersLoading, 
    error: ordersError,
    refreshOrders,
    todayStr
  } = useOrders();

  const { 
    notifications,           
    unreadCount,             
    loading: notificationsLoading, 
    error: notificationsError,
    markAsRead,              
    markAllAsRead            
  } = useNotifications();

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const sidebarRef = useRef(null);
  const menuBtnRef = useRef(null);
  const searchInputRef = useRef(null);
  const productsDropdownRef = useRef(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActivePage('dashboard');
    else if (path.includes('/orders')) setActivePage('orders');
    else if (path.includes('/products/list')) {
      setActivePage('products');
      setActiveProductSubPage('list');
    }
    else if (path.includes('/products/upload')) {
      setActivePage('products');
      setActiveProductSubPage('upload');
    }
    else if (path.includes('/profile')) setActivePage('profile');
    else if (path.includes('/messages')) setActivePage('messages');
    else if (path.includes('/notifications')) setActivePage('notifications');
    else if (path.includes('/authentication')) setActivePage('authentication');
    else if (path.includes('/users')) setActivePage('users');
    else if (path.includes('/invoices')) setActivePage('invoices');
    else if (path.includes('/campaigns')) setActivePage('campaigns');
    else if (path.includes('/blog')) setActivePage('blog');
    else setActivePage('dashboard');
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNavbarVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      
      if (width > 768 && width <= 1024) {
        setSidebarOpen(false);
        setProductsDropdownOpen(false);
      }
      
      if (width > 1024) {
        setSidebarOpen(true);
      }
      
      if (width <= 768) {
        setSidebarOpen(false);
        setProductsDropdownOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
      
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setProductsDropdownOpen(false);
      }
      
      if (isMobile || isTablet) {
        if (sidebarOpen && 
            menuBtnRef.current && !menuBtnRef.current.contains(event.target) &&
            sidebarRef.current && !sidebarRef.current.contains(event.target)) {
          setSidebarOpen(false);
          setProductsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isTablet, sidebarOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.search.value;
    console.log('Axtarış:', searchTerm);
    setSearchOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    setProductsDropdownOpen(false);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
    setProductsDropdownOpen(false);
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    setProductsDropdownOpen(false);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  const handleCartClick = () => {
    setCartOpen(!cartOpen);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setProductsDropdownOpen(false);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  const handleRemoveOrder = (orderId) => {
    console.log(`Sifariş silindi: ${orderId}`);
    refreshOrders();
  };

  const handleClearAllOrders = () => {
    console.log('Bütün sifarişlər təmizləndi (mock)');
    refreshOrders();
  };

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    setProductsDropdownOpen(false);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setCartOpen(false);
    setProductsDropdownOpen(false);
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  const handleProductsClick = () => {
    setProductsDropdownOpen(!productsDropdownOpen);
  };

  const handleProductSubPageChange = (subPage) => {
    setActivePage('products');
    setActiveProductSubPage(subPage);
    setProductsDropdownOpen(false);
    
    if (subPage === 'list') {
      navigate('/admin/products/list');
    } else if (subPage === 'upload') {
      navigate('/admin/products/upload');
    }
    
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setActiveProductSubPage(null);
    setProductsDropdownOpen(false);
    
    switch(page) {
      case 'dashboard':
        navigate('/admin/dashboard');
        break;
      case 'orders':
        navigate('/admin/orders');
        refreshOrders();
        break;
      case 'profile':
        navigate('/admin/profile');
        break;
      case 'messages':
        navigate('/admin/messages');
        break;
      case 'notifications':
        navigate('/admin/notifications');
        break;
      case 'authentication':
        navigate('/admin/authentication');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'invoices':
        navigate('/admin/invoices');
        break;
      case 'campaigns':
        navigate('/admin/campaigns');
        break;
      case 'blog':
        navigate('/admin/blog');
        break;
      default:
        navigate('/admin/dashboard');
    }
    
    setNotificationsOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setCartOpen(false);
    
    if (isMobile || isTablet) {
      setSidebarOpen(false);
    }
  };

  const goToAllOrders = () => {
    setCartOpen(false);
    handlePageChange('orders');
  };

  const handleLogout = () => {
    console.log('Çıxış edilir...');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'order': return <FiShoppingCart />;
      case 'user': return <FiUser />;
      case 'message': return <FiMail />;
      default: return <FiBell />;
    }
  };

  // Blog səhifəsi üçün render - artıq real Blog komponenti göstərilir
  const renderContent = () => {
    if (activePage === 'blog') {
      return <Blog />; // Placeholder əvəzinə real Blog komponenti
    }
    return <Outlet />;
  };

  return (
    <div className="admin-panel">
      {/* Navbar */}
      <nav className={`admin-navbar ${navbarVisible ? 'navbar-visible' : ''}`}>
        <div className="navbar-left">
          <button 
            type="button"
            className="menu-btn" 
            onClick={handleMenuClick}
            ref={menuBtnRef}
          >
            <FiMenu />
          </button>
          
          <div className={`search-container ${searchOpen ? 'active' : ''}`} ref={searchRef}>
            <button 
              type="button"
              className="search-toggle" 
              onClick={handleSearchToggle}
            >
              <FiSearch />
            </button>
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                name="search"
                placeholder="Axtarış..."
                className="search-input"
                ref={searchInputRef}
              />
            </form>
          </div>
        </div>

        <div className="navbar-right">
          <div className="cart-wrapper" ref={cartRef}>
            <button 
              type="button"
              className="cart-btn"
              onClick={handleCartClick}
            >
              <FiCartIcon />
              {todayOrders.length > 0 && (
                <span className="cart-badge">{todayOrders.length}</span>
              )}
            </button>
            {cartOpen && (
              <div className="dropdown cart-dropdown">
                <div className="dropdown-header">
                  <h3>Bugünkü Sifarişlər</h3>
                  <span className="order-date">{todayStr}</span>
                  {todayOrders.length > 0 && (
                    <span className="clear-all" onClick={handleClearAllOrders}>Hamısını təmizlə</span>
                  )}
                </div>
                <div className="dropdown-body">
                  {ordersLoading ? (
                    <div className="loading-state">Yüklənir...</div>
                  ) : ordersError ? (
                    <div className="error-state">{ordersError}</div>
                  ) : todayOrders.length > 0 ? (
                    todayOrders.map((order) => (
                      <div className="cart-item" key={order.id}>
                        <div className="cart-item-info">
                          <span className="cart-item-id">{order.id}</span>
                          <span className="cart-item-customer">{order.customer}</span>
                        </div>
                        <div className="cart-item-details">
                          <span className="cart-item-time">{order.time}</span>
                          <span className="cart-item-amount">₼{order.amount.toFixed(2)}</span>
                        </div>
                        <button 
                          type="button"
                          className="cart-item-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOrder(order.id);
                          }}
                        >
                          <FiXCircle />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state cart-empty">Bugün heç bir sifariş yoxdur</div>
                  )}
                </div>
                <div className="dropdown-footer">
                  <button type="button" className="view-all-orders" onClick={goToAllOrders}>
                    Bütün Sifarişlər
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="notification-wrapper" ref={notificationsRef}>
            <button 
              type="button"
              className="notification-btn"
              onClick={handleNotificationsClick}
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {notificationsOpen && (
              <div className="dropdown notification-dropdown">
                <div className="dropdown-header">
                  <h3>Bildirişlər</h3>
                  {unreadCount > 0 && (
                    <span className="mark-read" onClick={markAllAsRead}>Hamısını oxundu işarələ</span>
                  )}
                </div>
                <div className="dropdown-body">
                  {notificationsLoading ? (
                    <div className="loading-state">Yüklənir...</div>
                  ) : notificationsError ? (
                    <div className="error-state">{notificationsError}</div>
                  ) : notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <div 
                        className={`notification-item ${!notification.read ? 'unread' : ''}`} 
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="notification-icon">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        {!notification.read && <div className="notification-dot"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state notification-empty">Yeni bildiriş yoxdur</div>
                  )}
                </div>
                <div className="dropdown-footer">
                  <button type="button" className="view-all" onClick={() => handlePageChange('notifications')}>
                    Bütün Bildirişlər
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-wrapper" ref={profileRef}>
            <button 
              type="button"
              className="profile-btn"
              onClick={handleProfileClick}
            >
              <div className="profile-info">
                <span className="profile-name">Admin User</span>
                <span className="profile-role">Super Admin</span>
              </div>
              <div className="profile-avatar">
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Profile" 
                />
              </div>
            </button>
            {profileOpen && (
              <div className="dropdown profile-dropdown">
                <div className="profile-header">
                  <div className="profile-header-avatar">
                    <img src="https://via.placeholder.com/50" alt="Profile" />
                  </div>
                  <div className="profile-header-info">
                    <h4>Admin User</h4>
                    <p>admin@example.com</p>
                  </div>
                </div>
                <div className="dropdown-body">
                  <button 
                    type="button" 
                    className={`dropdown-item ${activePage === 'profile' ? 'active-profile-item' : ''}`}
                    onClick={() => handlePageChange('profile')}
                  >
                    <FiUser /> Profilim
                  </button>
                  <button 
                    type="button" 
                    className={`dropdown-item ${activePage === 'messages' ? 'active-profile-item' : ''}`}
                    onClick={() => handlePageChange('messages')}
                  >
                    <FiMail /> Mesajlar
                  </button>
                  <button 
                    type="button" 
                    className={`dropdown-item ${activePage === 'notifications' ? 'active-profile-item' : ''}`}
                    onClick={() => handlePageChange('notifications')}
                  >
                    <FiBell /> Bildirişlər
                  </button>
                  <button 
                    type="button" 
                    className={`dropdown-item ${activePage === 'campaigns' ? 'active-profile-item' : ''}`}
                    onClick={() => handlePageChange('campaigns')}
                  >
                    <FiTrendingUp /> Kampaniyalar
                  </button>
                </div>
                <div className="dropdown-footer">
                  <button type="button" className="logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Çıxış
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {(isMobile || isTablet) && (
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
          onClick={handleOverlayClick}
        ></div>
      )}
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">ASGAROV</h2>
          <p className="sidebar-subtitle">Əsas səhifələr</p>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => handlePageChange('dashboard')}
              >
                <FiBarChart2 /> Dashboard
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'authentication' ? 'active' : ''}`}
                onClick={() => handlePageChange('authentication')}
              >
                <FiUserCheck /> Authentication
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'users' ? 'active' : ''}`}
                onClick={() => handlePageChange('users')}
              >
                <FiUsers /> Users
              </button>
            </li>
            <li className="sidebar-dropdown-container" ref={productsDropdownRef}>
              <button 
                type="button"
                className={`sidebar-link dropdown-toggle ${activePage === 'products' ? 'active' : ''}`}
                onClick={handleProductsClick}
              >
                <FiPackage /> Məhsullar
                <FiChevronDown className={`dropdown-arrow ${productsDropdownOpen ? 'open' : ''}`} />
              </button>
              {productsDropdownOpen && (
                <ul className="sidebar-dropdown-menu">
                  <li>
                    <button
                      type="button"
                      className={`sidebar-dropdown-item ${activeProductSubPage === 'list' ? 'active' : ''}`}
                      onClick={() => handleProductSubPageChange('list')}
                    >
                      <FiList /> Məhsul siyahısı
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={`sidebar-dropdown-item ${activeProductSubPage === 'upload' ? 'active' : ''}`}
                      onClick={() => handleProductSubPageChange('upload')}
                    >
                      <FiUpload /> Məhsul yüklə
                    </button>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'invoices' ? 'active' : ''}`}
                onClick={() => handlePageChange('invoices')}
              >
                <FiFileText /> Invoices
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'orders' ? 'active' : ''}`}
                onClick={() => handlePageChange('orders')}
              >
                <FiShoppingCart /> Bütün Sifarişlər
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'messages' ? 'active' : ''}`}
                onClick={() => handlePageChange('messages')}
              >
                <FiMessageSquare /> Mesajlar
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'notifications' ? 'active' : ''}`}
                onClick={() => handlePageChange('notifications')}
              >
                <FiBellIcon /> Bildirişlər
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'campaigns' ? 'active' : ''}`}
                onClick={() => handlePageChange('campaigns')}
              >
                <FiTrendingUp /> Kampaniyalar
              </button>
            </li>
            <li>
              <button 
                type="button"
                className={`sidebar-link ${activePage === 'blog' ? 'active' : ''}`}
                onClick={() => handlePageChange('blog')}
              >
                <FiEdit /> Bloq
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className={`main-content ${sidebarOpen && !isMobile && !isTablet ? 'sidebar-open' : ''}`}>
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;