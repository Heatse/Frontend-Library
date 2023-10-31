import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from './components/Login/Login';
import Signup from './components/Login/Signup';
import Home from './components/Home';
import BookDetail from './components/HomeAdmin/BookDetail';
import ViewBook from './components/HomeUser/ViewBook';
import Order from './components/OrderBook/Order';






function App() {
  return (
    <>


      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/bookDetail/:id' element={<BookDetail />} />
        <Route path='/book/:id' element={<ViewBook />} />
        <Route path='/ordered' element={<Order />} />
      </Routes>
    </>
  );
}

export default App;
