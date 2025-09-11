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
import SummerCamp from './components/SummerCamp';
import Gallery from './components/Gallery';
import ContactPage from './components/Contact'
import ProfilePage from './components/Profile';
import ManageEventsPage from './components/ManageEventsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';

function AnimatedRoutes({ handleLogin, handleRegister, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const AdminRoute = ({ user, children }) => {
    if (!user || user.role !== 'admin') {
      return <Navigate to='/home' replace />
    }
    return children;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><Aboutus /></PageWrapper>} />
        <Route path="/academics" element={<PageWrapper><Academics /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login onLogin={handleLogin} /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup onSignup={handleLogin} /></PageWrapper>} />
        <Route path="/user" element={<PageWrapper><UserPage /></PageWrapper>} />
        <Route path="/admission" element={<PageWrapper><AdmissionsPage /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
        <Route path="/summercamp" element={<PageWrapper><SummerCamp /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProfilePage handleLogin={handleLogin} handleRegister={handleRegister} /></PageWrapper>} />
        {/* <Route path='/admin/events' element={<PageWrapper><ManageEventsPage /></PageWrapper>} /> */}
        <Route path="/admin/events" element={<AdminRoute user={user}><PageWrapper><ManageEventsPage /></PageWrapper></AdminRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>}/>
        <Route path="/admin/events" element={<ProtectedRoute adminOnly={true}><EventsPage adminView={true} /></ProtectedRoute>}/>
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute adminOnly={true}>
              <Gallery adminView={true} />
            </ProtectedRoute>
          }
        />
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
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    const checkSession = async () => {
      try {
        const res = await fetch('http://localhost:5000/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch (err) {
        console.log('No active sessions');
      }
    };
    checkSession();
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData))
  };

  const handleRegister = (formData) => {
    const newUser = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      className: formData.className,
      emprole: formData.emprole
    };

    setIsLoggedIn(true);
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };


  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.log('Logout error', err);
    }
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    navigate("/home", { replace: true });
  };

  const AdminRoute = ({ user, children }) => {
    if (!user || user.role !== 'admin') {
      return <Navigate to='/home' replace />
    }
    return children;
  }

  return (
    <>
      <Navigation isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <AnimatedRoutes handleLogin={handleLogin} handleRegister={handleRegister} user={user} />
      <Footer />
    </>
  );
}

export default App;
