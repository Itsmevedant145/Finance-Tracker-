import React from 'react';
import './AuthLayout.css';
import image1 from '../../assets/images/image1.jpg';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      {/* Left side - Content */}
      <div className="content-side">
        <div className="content-wrapper">
          <h2 className="app-title">Expense Tracker</h2>
          
          {/* Children content (login/signup forms) */}
          <div className="form-container">
            {children}
          </div>
        </div>
      </div>
      
      {/* Right side - Image with decorative elements */}
      <div className="visual-side">
        {/* Call-to-action box in top right corner */}
        <div className="cta-box">
          <span className="money-sign">$</span>
          <span className="cta-text">Track Your Expenses</span>
        </div>
        
        {/* Simple decorative elements */}
        <div className="decorative-circle"></div>
        <div className="decorative-square"></div>
        
        {/* Image container with your existing image */}
        <div className="image-container">
          <img src={image1} alt="Expense Tracker" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;