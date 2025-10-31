import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import postSignup from '../api/post-signup.js';
import { useAuth } from '../hooks/use-auth.js';
import './SignupForm.css';

function SignupForm() {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.id]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!form.username || !form.password || !form.first_name || !form.last_name)
            return setError('Please fill required fields');
        if (form.password !== form.confirmPassword)
            return setError('Passwords do not match');
        setLoading(true);
        try {
            const data = await postSignup({
                username: form.username,
                password: form.password,
                email: form.email,
                first_name: form.first_name,
                last_name: form.last_name
            });
            if (data.token) {
                localStorage.setItem('token', data.token);
                setAuth({ token: data.token });
                navigate('/create');
            } else {
                navigate('/login', { state: { signupSuccess: true } });
            }
        } catch (err) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <h1>Create account</h1>
            <p className="lead">Create an account to get started.</p>

            {error && <div className="form-error">{error}</div>}

            <div className="form-field">
                <label htmlFor="first_name">First Name</label>
                <input id="first_name" type="text" value={form.first_name} onChange={handleChange} placeholder="Your first name" />
            </div>

            <div className="form-field">
                <label htmlFor="last_name">Last Name</label>
                <input id="last_name" type="text" value={form.last_name} onChange={handleChange} placeholder="Your last name" />
            </div>

            <div className="form-field">
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={form.username} onChange={handleChange} placeholder="Choose a username" />
            </div>

            <div className="form-field">
                <label htmlFor="email">Email (optional)</label>
                <input id="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>

            <div className="form-field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a password" />
            </div>

            <div className="form-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
                <button type="button" className="btn btn--ghost" onClick={() => navigate('/login')}>Have an account?</button>
            </div>
        </form>
    );
}
export default SignupForm;