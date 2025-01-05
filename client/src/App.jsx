import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Header from './component/Header';
import PrivateRoute from './component/privateRoute';


export default function App() {
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />

        <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}