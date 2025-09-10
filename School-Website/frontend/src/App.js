import './App.css';
import Academics from './components/Academics';
import Aboutus from './components/Aboutus';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserPage from './components/UserPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import { AnimatePresence } from 'framer-motion';
import PageWrapper from './components/Pagewrapper';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><Aboutus /></PageWrapper>} />
        <Route path="/academics" element={<PageWrapper><Academics /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><UserPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
} 

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
