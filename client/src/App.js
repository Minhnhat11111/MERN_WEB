import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Components/Header/Header.js';
import Footer from './Components/Footer/Footer.js';
import HomePage from './Pages/Home/Home.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Pages/Menu/Menu.js';  
import About from './Pages/About/About.js';
import Contact from './Pages/Contact/Contact.js';
import BookTable from './Pages/Reservation/Reservation.js';
import Login from './Pages/Login/Login.js';
import Singup from './Pages/Signup/Signup.js';
import ReservationHistory from './Pages/ReservationHistory/ReservationHistory.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
          <Router>
      <div className="App">
        <Header />
        <Routes>
        <Route path="/history" element={<ReservationHistory />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<BookTable />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Singup />} />
       
        </Routes>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
    </AuthProvider>
    
    
  );
}

export default App;