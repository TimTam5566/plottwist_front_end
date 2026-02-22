/**
 * ErrorBoundary.jsx
 *
 * Catches unhandled JavaScript errors in child components
 * and displays a user-friendly fallback instead of crashing the whole app.
 *
 * Must be a class component because React error boundaries
 * require getDerivedStateFromError and componentDidCatch.
 */

import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <main id="main-content" className="page-wrap" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
                        A Page Has Gone Missing
                    </h1>
                    <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)', marginBottom: '2rem' }}>
                        Something unexpected happened in our library. The scribes are investigating.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="btn btn--primary"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn btn--secondary"
                        style={{ marginLeft: '1rem' }}
                    >
                        Return Home
                    </button>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
