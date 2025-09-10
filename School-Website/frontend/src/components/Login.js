import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await res.json();

            if (res.ok) {
                setMessage('Login successful! Welcome' + data.user.name);
                //redirect to home page if login is successfull
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home', { replace: true });
            } else {
                setMessage(data.error);
            }
        } catch (err) {
            console.log(err);
            setMessage('Server error')
        }
    }


    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
            <img
                src="/Images/School-Image.jpg"
                className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                alt="School background"
            />
            {/*login card*/}
            {/* <div className="flex justify-center items-center min-h-screen bg-gray-100"> */}
            <div className="relative z-10 bg-white/95 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-3 px-3 py-2 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-3 px-3 py-2 border rounded"
                    />
                    <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">
                        Login
                    </button>
                </form>
                <p className="mt-3 text-red-500">{message}</p>
            </div>
        </div>
        // </div>
    )

}

export default Login;