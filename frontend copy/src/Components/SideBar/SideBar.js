import React from 'react';
import { BookOpenText, ChefHat, PieChart, Utensils, LogOut, Home } from 'lucide-react';
import styles from './SideBar.module.css';
import NavBar from '../NavBar/NavBar';

function SideBar() {
    const currentPath = window.location.pathname;

    const handleLogout = () => {
        localStorage.removeItem('userID');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };

    return (
        <div className={styles.sideBarContainerNav}>
            <div className={styles.sideBarNavbarWrapper}>
                <NavBar />
            </div>
            <div className={styles.sideBarNav}>
                {/* TastyNest Logo */}
                <div className={styles.sideBarLogo}>
                    <Home size={24} className={styles.sideBarLogoIcon} />
                    <span className={styles.sideBarLogoText}>TastyNest</span>
                </div>
                
                <div className={styles.sideBarNavItems}>
                    <div 
                        className={`${styles.sideBarNavItem} ${currentPath === '/learningSystem/allLearningPost' ? styles.sideBarNavItemActive : ''}`}
                        onClick={() => (window.location.href = '/learningSystem/allLearningPost')}
                    >
                        <BookOpenText size={20} className={styles.sideBarNavIcon} />
                        <span>Recipe Book 📖</span>
                    </div>
                    
                    <div 
                        className={`${styles.sideBarNavItem} ${currentPath === '/allPost' ? styles.sideBarNavItemActive : ''}`}
                        onClick={() => (window.location.href = '/allPost')}
                    >
                        <ChefHat size={20} className={styles.sideBarNavIcon} />
                        <span>Community Kitchen 👨‍🍳</span>
                    </div>
                    
                    <div 
                        className={`${styles.sideBarNavItem} ${currentPath === '/allLearningProgress' ? styles.sideBarNavItemActive : ''}`}
                        onClick={() => (window.location.href = '/allLearningProgress')}
                    >
                        <PieChart size={20} className={styles.sideBarNavIcon} />
                        <span>Baking Progress 🥧</span>
                    </div>
                    
                    {localStorage.getItem('userType') !== 'googale' && (
                        <div 
                            className={`${styles.sideBarNavItem} ${currentPath === '/learningSystem/recommendPost' ? styles.sideBarNavItemActive : ''}`}
                            onClick={() => (window.location.href = '/learningSystem/recommendPost')}
                        >
                            <Utensils size={20} className={styles.sideBarNavIcon} />
                            <span>Skill Mixer 🥄</span>
                        </div>
                    )}
                    
                    <div 
                        className={`${styles.sideBarNavItem} ${styles.sideBarNavItemLogout}`}
                        onClick={handleLogout}
                    >
                        <LogOut size={20} className={styles.sideBarNavIcon} />
                        <span>Leave Kitchen 🚪</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;