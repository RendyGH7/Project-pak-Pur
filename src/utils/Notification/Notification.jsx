import React, { useState, useEffect } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai';
import './Notification.css';

const Notification = ({ type = 'success', message, isVisible, onClose, duration = 4000 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <AiOutlineCheckCircle />;
      case 'error': return <AiOutlineCloseCircle />;
      case 'warning': return <AiOutlineWarning />;
      case 'info': return <AiOutlineInfoCircle />;
      default: return <AiOutlineCheckCircle />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`modern-notification ${type} ${show ? 'show' : 'hide'}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {getIcon()}
        </div>
        <div className="notification-message">
          {message}
        </div>
        <button className="notification-close" onClick={() => setShow(false)}>
          <AiOutlineCloseCircle />
        </button>
      </div>
      <div className="notification-progress"></div>
    </div>
  );
};

export default Notification;