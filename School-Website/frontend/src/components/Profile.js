import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ handleLogin, handleRegister }) => {
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        className: '',
        emprole: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (authMode === 'login') {
                const res = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                    credentials: 'include',
                });
                if (!res.ok) {
                    const errData = await res.json();
                    alert(errData.error || 'Login failed');
                    return;
                }
                const data = await res.json();


                handleLogin(data.user);
                const checkrole = data.user.emprole?.toLowerCase();
                if (checkrole === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/user', { replace: true });
                }


            } else {

                if (formData.password !== formData.confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                const res = await fetch('http://localhost:5000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                        className: formData.className,
                        emprole: formData.emprole,
                    }),
                    credentials: 'include',
                });

                if (!res.ok) {
                    const errData = await res.json();
                    alert(errData.error || 'Login failed');
                    return;
                }
                const data = await res.json();
                handleRegister(data.user);
                console.log(data.user.emprole);
                const checkrole = data.user.emprole?.toLowerCase();
                if (checkrole === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/user', { replace: true });
                }


            }
        } catch (err) {
            console.log('Server error', err);
        }

    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">{authMode === 'login' ? 'Login' : 'Register'}</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {authMode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {authMode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    )}

                    {authMode === 'register' && (
                        <div>
                            <label className='block text-sm font-medium mb-2'>Role</label>
                            <select
                                name='role'
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="student">Guardian/Student</option>
                                <option value="employee">Employee</option>

                            </select>

                        </div>
                    )}
                    {authMode === 'register' && formData.role === 'student' && (
                        <div>
                            <label className='block text-sm font-medium mb-2'>Class Name</label>
                            <select
                                name="className"
                                value={formData.className}
                                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                required
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
                        </div>
                    )}

                    {authMode === 'register' && formData.role === 'employee' && (
                        <div>
                            <label className='block text-sm font-medium mb-2'>Employee Role</label>
                            <select
                                name="emprole"
                                value={formData.emprole}
                                onChange={(e) => setFormData({ ...formData, emprole: e.target.value })}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {authMode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                        className="text-blue-600 hover:underline"
                    >
                        {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;