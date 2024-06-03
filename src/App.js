// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/login/SignUp';
import GoodsList from './pages/board/GoodsList';
import AddGoods from './pages/board/AddGoods';
import EditGoods from './pages/board/EditGoods';
import GoodDetail from './pages/board/GoodDetail';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="goods" element={<GoodsList />} />
                    <Route path="add-goods" element={<AddGoods />} />
                    <Route path="edit-goods/:id" element={<EditGoods />} />
                    <Route path="goods/:id" element={<GoodDetail />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
