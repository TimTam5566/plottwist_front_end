/**
 * ============================================================
 * NAVBAR.JSX - Navigation & App Shell
 * ============================================================
 * 
 * WHAT THIS DOES:
 * 1. Displays the navigation bar on every page
 * 2. Handles mobile hamburger menu
 * 3. Shows different links based on login state
 * 4. Wraps all page content via <Outlet />
 * 
 * WHY IT'S SPECIAL:
 * In main.jsx, NavBar is the parent route element.
 * All other pages render INSIDE NavBar via <Outlet />.
 * This is why the nav appears on every page!
 */


import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/use-auth.js";
import './NavBar.css';

function NavBar() {
    // ============================================================
    // HOOKS
    // ============================================================
    
    // Get auth state from Context
    const { auth, setAuth } = useAuth();
    // Mobile menu open/closed state
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Get current URL path (e.g., "/project/5")
    const { pathname } = useLocation();

    // ============================================================
    // SCROLL TO TOP ON NAVIGATION
    // ============================================================
    /**
     * useEffect runs when pathname changes (user navigates).
     * Scrolls to top of page - better UX than staying scrolled down.
     */

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // Dependency array: re-run when pathname changes

    // ============================================================
    // HANDLERS
    // ============================================================
    
    /**
     * Logout: Clear storage, reset state, close menu
     */

    const handleLogout = () => {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user_id");
        window.localStorage.removeItem("username");
        setAuth({ token: null, user_id: null, username: null });
        setIsMenuOpen(false);
    };
    /**
     * Close mobile menu (when link clicked)
     */
    const closeMenu = () => {
        setIsMenuOpen(false);
    };
    /**
     * Toggle mobile menu open/closed
     */
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* ========== LOGO ========== */}
                    <Link to="/" className="navbar-logo" onClick={closeMenu}>
                        <span className="logo-icon">✒</span>
                        <span className="logo-text">Plot Twist</span>
                    </Link>

                    {/* ========== HAMBURGER MENU (Mobile) ========== */}
                    {/**
                     * Only visible on mobile (CSS handles this).
                     * Toggles the nav-links visibility.
                     * aria-* attributes for accessibility.
                     */}
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

                    {/* ========== NAVIGATION LINKS ========== */}
                    <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        {/* Public links - always visible */}
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/about" onClick={closeMenu}>About</Link>
                        <Link to="/contact" onClick={closeMenu}>Contact</Link>
                        {/* Conditional: Only show if logged in */}
                        {auth.token && (
                            <Link to="/create-project" onClick={closeMenu} className="nav-create">
                                Create Story
                            </Link>
                        )}
                        
                        <div className="nav-divider"></div>
                        
                        {/* ========== AUTH SECTION ========== */}
                        {/**
                         * CONDITIONAL RENDERING:
                         * - If logged in (auth.token exists): Show username + logout
                         * - If not logged in: Show login + signup links
                         */}
                        
                        {auth.token ? (
                            <>
                                {/* Logged in: Show username */}
                                <span className="nav-username">
                                    <span className="username-icon">🪶</span>
                                    {auth.username || 'Author'}
                                </span>
                                <Link to="/" onClick={handleLogout} className="nav-auth nav-logout">
                                    Log Out
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Not logged in: Show login/signup */}
                                <Link to="/login" onClick={closeMenu} className="nav-auth">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={closeMenu} className="nav-signup">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ========== MOBILE OVERLAY ========== */}
                    {/**
                     * Dark overlay behind mobile menu.
                     * Clicking it closes the menu.
                     */}
                    {isMenuOpen && (
                        <div className="nav-overlay" onClick={closeMenu}></div>
                    )}
                </div>
            </nav>
            {/* ========== PAGE CONTENT ========== */}
            {/**
             * OUTLET - This is where child routes render!
             * 
             * When user visits /project/5:
             * - NavBar renders (this component)
             * - <Outlet /> renders ProjectPage
             * 
             * This is how NavBar appears on EVERY page.
             */}
            <Outlet />
        </div>
    );
}

export default NavBar;