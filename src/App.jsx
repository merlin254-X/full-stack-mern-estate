import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import Signup from './pages/Signup';
import Signin from './pages/Signin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}