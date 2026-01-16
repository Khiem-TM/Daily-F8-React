import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../stores/authStore';

//Yeu cau:
// - submit form
// - so sanh email (hashcode) va password (hashcode) voi du lieu luu tren localStorage
// neu dung --> chuyen trang users/dashboard
// neu sai --> hien thong bao loi

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const login = useAuth((state) => state.login);
    const loading = useAuth((state) => state.loading);
    const error = useAuth((state) => state.error);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            await login(formData.email, formData.password);
            const intendedUrl = localStorage.getItem("intended_url");
            localStorage.removeItem("intended_url");
            const continueParam = searchParams.get('continue');
            navigate(intendedUrl || continueParam || '/users', { replace: true });
        } catch (err) {
            setFormError(err.message || 'Login failed');
        }
    };

    return (
        <div className="login-page fade-in">
            <div className="login-container">
                <div className="login-header">
                    <h1>Login</h1>
                    <p>Welcome back! Please login to your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>


                    {(formError || error) && (
                        <p className="error-message" style={{ color: '#ef4444', marginTop: '0.5rem' }}>
                            {formError || error}
                        </p>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <a href="#">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}