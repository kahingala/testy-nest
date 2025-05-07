import React, { useState, useEffect } from 'react';
import { BookOpenText, ChefHat, PieChart, Utensils, LogOut, Home, Menu } from 'lucide-react';
import styles from './SideBar.module.css';
import NavBar from '../NavBar/NavBar';

function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const currentPath = window.location.pathname;

    const handleLogout = () => {
        localStorage.removeItem('userID');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


    return (
        <>
        
        

        <div className={styles.sideBarContainerNav}>
            <div className={styles.sideBarNavbarWrapper}>
                <NavBar />
            </div>
            {isMobile && (
            <button className={styles.menuButton} onClick={toggleSidebar}>
                <Menu size={28} />
            </button>
        )}
            {(!isMobile || isSidebarOpen) && (
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
            )}
        </div>
        
        </>
    );
}

export default SideBar;