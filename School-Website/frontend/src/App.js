import './App.css';
import Academics from './components/Academics';
import Aboutus from './components/Aboutus';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserPage from './components/UserPage';
import { Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/Pagewrapper';
import { useState } from 'react';
import { useEffect } from 'react';
import Footer from './components/Footer';
import AdmissionsPage from './components/Admission';
import EventsPage from './components/Events';
import Gallery from './components/Gallery';
import ContactPage from './components/Contact'
import ProfilePage from './components/Profile';
import ManageEventsPage from './components/ManageEventsPage';
import AdminDashboard from './components/AdminDashboard';
import Settings from './components/Settings';
import Userboard from './components/Userboard';
import SummerCamp from './components/SummerCamp';
import ManageSummerCamp from './components/ManageSummerCamp';

// Protected Route Component for Admin
const AdminRoute = ({ user, children }) => {
  console.log('AdminRoute - checking user:', user);
  console.log('AdminRoute - user emprole:', user?.emprole);

  if (!user) {
    console.log('No user - redirecting to login');
    return <Navigate to='/login' replace />;
  }

  if (user.emprole?.toLowerCase() !== 'admin') {
    console.log('Not admin - redirecting to home');
    return <Navigate to='/home' replace />;
  }

  console.log('Admin access granted');
  return children;
};

// Protected Route Component for Authenticated Users
const AuthRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to='/login' replace />;
  }
  return children;
};

function AnimatedRoutes({ handleLogin, handleRegister, user }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><Aboutus /></PageWrapper>} />
        <Route path="/academics" element={<PageWrapper><Academics /></PageWrapper>} />
        <Route path="/admission" element={<PageWrapper><AdmissionsPage /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/login" element={user ? <Navigate to={user.emprole?.toLowerCase() === 'admin' ? '/admin' : '/home'} replace /> : <PageWrapper><Login onLogin={handleLogin} /></PageWrapper>} />
        <Route path="/signup" element={user ? <Navigate to={user.emprole?.toLowerCase() === 'admin' ? '/admin' : '/home'} replace /> : <PageWrapper><Signup onSignup={handleLogin} /></PageWrapper>} />
        <Route path="/profile" element={user ? <Navigate to={user.emprole?.toLowerCase() === 'admin' ? '/admin' : '/home'} replace /> : <PageWrapper><ProfilePage handleLogin={handleLogin} handleRegister={handleRegister} /></PageWrapper>} />
        <Route path="/user" element={<AuthRoute user={user}><PageWrapper><UserPage /></PageWrapper></AuthRoute>} />
        <Route path="/summercamp" element={<PageWrapper><SummerCamp /></PageWrapper>} />
        <Route path="/events" element={<AuthRoute user={user}><PageWrapper><EventsPage userView={true} /></PageWrapper></AuthRoute>} />
        {/* Auth Routes */}

        <Route path="/admin" element={<AdminRoute user={user}><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
        <Route path="/admin/events" element={<AdminRoute user={user}><PageWrapper><ManageEventsPage /></PageWrapper></AdminRoute>} />
        <Route path="/admin/gallery" element={<AdminRoute user={user}><PageWrapper><Gallery user={user} adminView={true} /></PageWrapper></AdminRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute user={user}><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
        <Route path="/admin/summercamp" element={<AdminRoute user={user}><PageWrapper><ManageSummerCamp user={user} adminView={true} /></PageWrapper></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute user={user}><PageWrapper><Userboard /></PageWrapper></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute user={user}><PageWrapper><Settings /></PageWrapper></AdminRoute>} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
        console.log('Loaded user from localStorage:', userData);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
      }
    }

    // Check server session
    const checkSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('Session user:', data.user);
        } else {
          // Session expired or invalid
          setUser(null);
          setIsLoggedIn(false);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.log('No active sessions');
      }
    };
    checkSession();
  }, []);

  const handleLogin = (userData) => {
    console.log('App handleLogin called with:', userData);
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleRegister = (userData) => {
    console.log('App handleRegister called with:', userData);
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.log('Logout error:', err);
    }

    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    navigate("/home", { replace: true });
  };

  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <AnimatedRoutes handleLogin={handleLogin} handleRegister={handleRegister} user={user} />
      <Footer />
    </>
  );
}

export default App;