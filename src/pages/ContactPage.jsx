/**
 * ContactPage.jsx - Literary Theme
 * 
 * A beautifully styled contact page matching the Plot Twist theme
 */

import './ContactPage.css';

function ContactPage() {
    return (
        <main id="main-content" className="contact-page">
            <div className="page-wrap">
                <div className="contact-card">
                    <div className="contact-header">
                        <span className="contact-icon" aria-hidden="true">✉</span>
                        <h1>Send Word</h1>
                        <p className="contact-tagline">We'd love to hear from you, dear author</p>
                    </div>

                    <div className="contact-content">
                        <div className="contact-method">
                            <h2>📜 General Inquiries</h2>
                            <p>
                                For questions, feedback, or tales of your Plot Twist adventures, 
                                send a raven (or an email) to:
                            </p>
                            <a href="mailto:support@example.com" className="contact-email">
                                support@example.com
                            </a>
                        </div>

                        <div className="contact-divider" aria-hidden="true">
                            <span>❧</span>
                        </div>

                        <div className="contact-method">
                            <h2>🪶 Collaboration & Partnerships</h2>
                            <p>
                                Interested in collaborating or partnering with Plot Twist? 
                                We're always looking for fellow storytellers.
                            </p>
                            <a href="mailto:partnerships@example.com" className="contact-email">
                                partnerships@example.com
                            </a>
                        </div>

                        <div className="contact-divider" aria-hidden="true">
                            <span>❧</span>
                        </div>

                        <div className="contact-method">
                            <h2>🐛 Report an Issue</h2>
                            <p>
                                Found a bug in the manuscript? Let us know and we'll 
                                send our best scribes to fix it.
                            </p>
                            <a href="mailto:bugs@example.com" className="contact-email">
                                bugs@example.com
                            </a>
                        </div>
                    </div>

                    <div className="contact-footer">
                        <p className="muted">
                            This is a demo site — messages may take a while to reach the castle.
                        </p>
                        <p className="contact-quote">
                            "The best stories begin with a conversation."
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ContactPage;