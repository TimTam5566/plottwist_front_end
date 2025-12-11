/**
 * NavBar.jsx - Literary Theme
 * 
 * Features:
 * - Logo on left
 * - Navigation links
 * - Hamburger menu for mobile
 * - Matches literary burgundy/cream theme
 */

import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import './NavBar.css';

function NavBar() {
    const { auth, setAuth } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        setAuth({ token: null });
        setIsMenuOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo" onClick={closeMenu}>
                        <span className="logo-icon">✒</span>
                        <span className="logo-text">Plot Twist</span>
                    </Link>

                    {/* Hamburger Menu Button (mobile) */}
                    <button 
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    {/* Navigation Links */}
                    <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/about" onClick={closeMenu}>About</Link>
                        <Link to="/contact" onClick={closeMenu}>Contact</Link>
                        
                        {auth.token && (
                            <Link to="/create-project" onClick={closeMenu} className="nav-create">
                                Create Story
                            </Link>
                        )}
                        
                        <div className="nav-divider"></div>
                        
                        {auth.token ? (
                            <Link to="/" onClick={handleLogout} className="nav-auth">
                                Log Out
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="nav-auth">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={closeMenu} className="nav-signup">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Overlay for mobile menu */}
                    {isMenuOpen && (
                        <div className="nav-overlay" onClick={closeMenu}></div>
                    )}
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default NavBar;