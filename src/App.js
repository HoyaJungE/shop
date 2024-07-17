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
import MenuList from './pages/menu/MenuList';
import MenuDetail from './pages/menu/MenuDetail';
import EditMenu from './pages/menu/EditMenu'; // Update import
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import AddMenu from "./pages/menu/AddMenu";
import AddRole from "./pages/role/AddRole";
import RoleList from "./pages/role/RoleList";
import RoleDetail from "./pages/role/RoleDetail";

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
                    <Route path="menus" element={<MenuList />} />
                    <Route path="add-menu" element={<AddMenu />} />
                    <Route path="menu/:id" element={<MenuDetail />} />
                    <Route path="edit-menu/:id" element={<EditMenu />} />
                    <Route path="add-role" element={<AddRole />} />
                    <Route path="roles" element={<RoleList />} />
                    <Route path="role/:id" element={<RoleDetail />} />
                    <Route path="edit-role/:id" element={<EditMenu />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
