import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Header from './component/Header';
import PrivateRoute from './component/privateRoute';
import CreateListing from './pages/createListing';
import UpdateListing from './pages/UpdateListing';


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
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/update-listing' element={<UpdateListing />} />
        <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}