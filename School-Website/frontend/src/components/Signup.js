import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({ onSignup }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        className: '',
        emprole: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/signup', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    className: formData.className,
                    emprole: formData.emprole
                }),
                credentials: 'include',
            });
            
            const data = await res.json();

            if (res.ok) {
                onSignup(data.user);
                setMessage('Registration successful! Welcome ' + formData.name);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                console.log('Signup user data:', data.user);
                console.log('User emprole:', data.user.emprole);
                
                // Route based on employee role
                if (data.user.emprole?.toLowerCase() === 'admin') {
                    console.log('Redirecting new admin to admin dashboard');
                    navigate('/admin', { replace: true });
                } else {
                    console.log('Redirecting new user to home');
                    navigate('/home', { replace: true }); 
                }
            } else {
                setMessage(data.error || 'Registration failed');
            }
        } catch (err) {
            console.log('Signup error:', err);
            setMessage("Server error. Please try again.");
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
            <div className="relative z-10 bg-white/95 p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={loading}
                    />
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={loading}
                    />
                    
                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={loading}
                        minLength="6"
                    />
                    
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={loading}
                    />

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Select Role</option>
                        <option value="student">Guardian/Student</option>
                        <option value="employee">Employee</option>
                    </select>

                    {formData.role === 'student' && (
                        <select
                            name="className"
                            value={formData.className}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Class</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Grade 1">Grade 1</option>
                            <option value="Grade 2">Grade 2</option>
                            <option value="Grade 3">Grade 3</option>
                            <option value="Grade 4">Grade 4</option>
                            <option value="Grade 5">Grade 5</option>
                            <option value="Middle School">Middle School</option>
                            <option value="High School">High School</option>
                        </select>
                    )}

                    {formData.role === 'employee' && (
                        <select
                            name="emprole"
                            value={formData.emprole}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={loading}
                        >
                            <option value="">Select Employee Role</option>
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                {message && (
                    <p className={`mt-3 text-sm ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
                
                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-blue-500 hover:underline text-sm"
                        disabled={loading}
                    >
                        Already have an account? Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;