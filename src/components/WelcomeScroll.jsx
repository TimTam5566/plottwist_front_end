/**
 * WelcomeScroll.jsx
 * A literary-themed parchment scroll component for the homepage
 */

import React from 'react';
import './WelcomeScroll.css';

function WelcomeScroll() {
    return (
        <div className="scroll-container">
            <div className="scroll">
                <div className="scroll-top"></div>
                <div className="scroll-content">
                    <p className="scroll-greeting">Welcome, Storyteller</p>
                    <p className="scroll-message">
                        Plot Twist is where your imagination takes the lead. 
                        Create branching narratives, explore alternate endings, 
                        and discover where your choices take you.
                    </p>
                    <p className="scroll-cta">Your story awaits...</p>
                </div>
                <div className="scroll-bottom"></div>
            </div>
        </div>
    );
}

export default WelcomeScroll;