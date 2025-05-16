import React, { useEffect, useState } from 'react';
import { Bell, BellRing, ChefHat, Utensils, Cake, User } from 'lucide-react';
import axios from 'axios';
import './NavBar.css';

function NavBar() {
    const [allRead, setAllRead] = useState(true);
    const [showCard, setShowCard] = useState(false); 
    const [userData, setUserData] = useState(null); 
    const userId = localStorage.getItem('userID');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
                const unreadNotifications = response.data.some(notification => !notification.read);
                setAllRead(!unreadNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            fetchNotifications();
            fetchUserData();
        }
    }, [userId]);

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:8080/user/${userId}`);
                alert('Profile deleted successfully!');
                localStorage.removeItem('userID');
                window.location.href = '/';
            } catch (error) {
                console.error('Error deleting profile:', error);
                alert('Failed to delete profile. Please try again.');
            }
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || 'U';
    };

    const currentPath = window.location.pathname;

    return (
        <nav className="navbar-component">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <div className="navbar-logo-content">
                        <ChefHat size={28} className="navbar-logo-icon" />
                        <span className="navbar-logo-text">TastyNest</span>
                    </div>
                </div>
                
                <div className="navbar-items">
                    <div className="navbar-icon-container">
                        {allRead ? (
                            <Bell
                                className={`navbar-icon ${currentPath === '/notifications' ? 'active' : ''}`}
                                onClick={() => (window.location.href = '/notifications')}
                                size={24}
                            />
                        ) : (
                            <BellRing 
                                className="navbar-icon active"
                                onClick={() => (window.location.href = '/notifications')}
                                size={24}
                            />
                        )}
                    </div>
                    
                    <div className="navbar-icon-container">
                        <User
                            className="navbar-icon"
                            style={{ display: localStorage.getItem('userType') === 'googale' ? 'none' : 'block' }}
                            onClick={() => setShowCard(!showCard)}
                            size={24}
                        />
                    </div>
                </div>
            </div>

            {showCard && userData && (
                <div className="navbar-user-card">
                    <div className="navbar-card-header-wrapper">
                        <div className="navbar-card-header">
                            <div className="navbar-card-avatar">
                                {getInitials(userData.fullname)}
                            </div>
                            <div className="navbar-card-titles">
                                <h3>{userData.fullname}</h3>
                                <p>Master Chef 👨‍🍳</p>
                            </div>
                        </div>
                        <div className="navbar-card-banner"></div>
                    </div>
                    
                    <div className="navbar-card-content">
                        <div className="navbar-card-info">
                            <div className="navbar-card-field">
 |                               <ChefHat size={18} />
                                <div className="navbar-card-field-content">
                                    <div className="navbar-card-field-label">Email</div>
                                    <div className="navbar-card-field-value">
                                        {userData.email.includes('@gmail.com') ? 
                                            userData.email.split('@')[0] + '@...' : 
                                            userData.email}
                                    </div>
                                </div>
                            </div>

                            <div className="navbar-card-field">
                                <Utensils size={18} />
                                <div className="navbar-card-field-content">
                                    <div className="navbar-card-field-label">Phone</div>
                                    <div className="navbar-card-field-value">{userData.phone}</div>
                                </div>
                            </div>

                            <div className="navbar-card-field">
                                <Cake size={18} />
                                <div className="navbar-card-field-content">
                                    <div className="navbar-card-field-label">Specialties</div>
                                    <div className="navbar-card-field-value skills-list">
                                        {userData.skills.join(', ')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="navbar-card-actions">
                            <button 
                                className="navbar-action-btn primary"
                                onClick={() => (window.location.href = `/updateUserProfile/${userId}`)}
                            >
                                Edit Profile
                            </button>
                            <button
                                className="navbar-action-btn danger"
                                onClick={handleDeleteProfile}
                            >
                                Delete Profile
                            </button>
                            <button
                                className="navbar-action-btn secondary"
                                onClick={() => setShowCard(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;