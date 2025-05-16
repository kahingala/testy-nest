import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdMail, IoMdLock, IoMdRestaurant } from 'react-icons/io';
import { FaGoogle, FaSignInAlt, FaUtensils, FaCookieBite, FaBirthdayCake } from 'react-icons/fa';
import { GiCookingPot, GiChefToque } from 'react-icons/gi';
import styles from './UserLogin.module.css';
import GoogleLogo from './img/glogo.png';

function UserLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userID', data.id); 
        alert('Login successful!');
        navigate('/learningSystem/allLearningPost'); 
      } else if (response.status === 401) {
        alert('Invalid credentials!'); 
      } else {
        alert('Failed to login!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Floating food icons */}
      <GiCookingPot className={styles.floatingIcon} />
      <FaCookieBite className={styles.floatingIcon} />
      <FaBirthdayCake className={styles.floatingIcon} />
      
      <div className={styles.loginCard}>
        <div className={styles.loginHero}>
          <div className={styles.loginHeroImage}></div>
          <div className={styles.loginHeroContent}>
            <h1 className={styles.loginHeroTitle}>Welcome Back to TestyNest!</h1>
            <p className={styles.loginHeroSubtitle}>
              Your favorite recipes are waiting. Sign in to continue your culinary journey.
            </p>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <FaUtensils />
                </div>
                <span className={styles.featureText}>Access thousands of recipes</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <GiChefToque />
                </div>
                <span className={styles.featureText}>Save your favorite dishes</span>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>
                  <IoMdRestaurant />
                </div>
                <span className={styles.featureText}>Share your culinary creations</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginLogo}>
            <h1 className={styles.loginLogoText}>
              <GiChefToque className={styles.loginLogoIcon} />
              TestyNest
            </h1>
          </div>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>
              <FaSignInAlt className={styles.loginTitleIcon} />
              Sign In
            </h1>
            <p className={styles.loginSubtitle}>Welcome back! Please enter your details.</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <IoMdMail className={styles.formLabelIcon} />
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <IoMdMail className={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <IoMdLock className={styles.formLabelIcon} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <IoMdLock className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={styles.formInput}
                  
                />
                <span 
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <button type="submit" className={styles.loginButton}>
              <FaSignInAlt className={styles.loginButtonIcon} />
              Sign In
            </button>
            
            <div className={styles.socialLogin}>
              <div className={styles.divider}>or continue with</div>
              <button
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className={styles.googleButton}
              >
                <img src={GoogleLogo} alt="Google logo" className={styles.googleIcon} />
                Sign in with Google
              </button>
            </div>
            
            <p className={styles.loginFooter}>
              Don't have an account?{' '}
              <a href="/register" className={styles.loginLink}>
                <FaSignInAlt className={styles.loginLinkIcon} />
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;