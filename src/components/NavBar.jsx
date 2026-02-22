/**
 * NavBar.jsx - Literary Theme
 *
 * Features:
 * - Skip link for keyboard navigation (WCAG 2.4.1)
 * - Logo on left
 * - Navigation links
 * - Username display when logged in
 * - Hamburger menu for mobile with focus management
 * - Matches literary burgundy/cream theme
 */

import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import './NavBar.css';

function NavBar() {
    const { auth, setAuth } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const hamburgerRef = useRef(null);
    const firstLinkRef = useRef(null);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("username");
        setAuth({ token: null, user_id: null, username: null });
        setIsMenuOpen(false);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        hamburgerRef.current?.focus();
    };

    const toggleMenu = () => {
        const opening = !isMenuOpen;
        setIsMenuOpen(opening);

        if (opening) {
            // Focus first link when menu opens
            setTimeout(() => {
                firstLinkRef.current?.focus();
            }, 100);
        }
    };

    // Close menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        };

        if (isMenuOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isMenuOpen]);

    return (
        <div>
            {/* Skip link — visible only on keyboard focus (WCAG 2.4.1) */}
            <a href="#main-content" className="skip-link">
                Skip to main content
            </a>

            <nav className="navbar" aria-label="Main navigation">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
                        <span className="logo-icon" aria-hidden="true">✒</span>
                        <span className="logo-text">Plot Twist</span>
                    </Link>

                    {/* Hamburger Menu Button (mobile) */}
                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        ref={hamburgerRef}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="nav-links"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    {/* Navigation Links */}
                    <div
                        id="nav-links"
                        className={`nav-links ${isMenuOpen ? 'active' : ''}`}
                        role="menubar"
                    >
                        <Link to="/" onClick={() => setIsMenuOpen(false)} ref={firstLinkRef} role="menuitem">Home</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} role="menuitem">About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} role="menuitem">Contact</Link>

                        {auth.token && (
                            <Link to="/create-project" onClick={() => setIsMenuOpen(false)} className="nav-create" role="menuitem">
                                Create Story
                            </Link>
                        )}

                        <div className="nav-divider" aria-hidden="true"></div>

                        {auth.token ? (
                            <>
                                {/* Username display */}
                                <span className="nav-username" aria-label={`Logged in as ${auth.username || 'Author'}`}>
                                    <span className="username-icon" aria-hidden="true">🪶</span>
                                    {auth.username || 'Author'}
                                </span>
                                <Link to="/" onClick={handleLogout} className="nav-auth nav-logout" role="menuitem">
                                    Log Out
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="nav-auth" role="menuitem">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="nav-signup" role="menuitem">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Overlay for mobile menu */}
                    {isMenuOpen && (
                        <div
                            className="nav-overlay"
                            onClick={closeMenu}
                            aria-hidden="true"
                        ></div>
                    )}
                </div>
            </nav>
            <Outlet />
        </div>
    );
}

export default NavBar;
