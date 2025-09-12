import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            
            const data = await res.json();
            
            if (res.ok) {
                onLogin(data.user);
                setMessage('Login successful! Welcome ' + data.user.name);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                console.log('User data:', data.user);
                console.log('User emprole:', data.user.emprole);
                console.log('User role:', data.user.role);
                
                // Check admin status using emprole field
                if (data.user.emprole?.toLowerCase() === 'admin') {
                    console.log('Redirecting to admin dashboard');
                    navigate('/admin', { replace: true });
                } else {
                    console.log('Redirecting to user page');
                    navigate('/home', { replace: true }); // Changed from /user to /home
                }
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (err) {
            console.log('Login error:', err);
            setMessage('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
            <img
                src="/Images/School-Image.jpg"
                className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                alt="School background"
            />
            <div className="relative z-10 bg-white/95 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={loading}
                    />
                    <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && (
                    <p className={`mt-3 ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-blue-500 hover:underline text-sm"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;