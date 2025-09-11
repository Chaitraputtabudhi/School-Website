import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup({onSignup}) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        
        onSignup(data.user)
        setMessage('Registered Successfully! Welcome' + name);
        setName('');
        setEmail('');
        setPassword('');
        localStorage.setItem('user',JSON.stringify(data.user));
        navigate('/user',{replace:true});
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.log(err);
      setMessage("Server error")
    }
  }


  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
            <img
                src="/Images/School-Image.jpg"
                className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                alt="School background"
            />
      {/* Signup card */}
      <div className="relative z-10 bg-white/95 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded"
          />
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
          <button className="w-full bg-green-500 text-white px-4 py-2 rounded">
            Sign Up
          </button>
        </form>
        <p className="mt-3 text-red-500">{message}</p>
      </div>
    </div>

  );
}

export default Signup;
