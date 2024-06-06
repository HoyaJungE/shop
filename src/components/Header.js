// src/components/Header.js
import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchMenus, buildMenuTree } from '../api';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Link, Box } from '@mui/material';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const [menus, setMenus] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        const loadMenus = async () => {
            try {
                const data = await fetchMenus();
                const menuTree = buildMenuTree(data);
                setMenus(menuTree);
            } catch (error) {
                console.error('Failed to fetch menus:', error);
                setMenus([]);
            }
        };
        loadMenus();
    }, []);

    const handleMenuOpen = (event, menu) => {
        setMenuAnchor(event.currentTarget);
        setSelectedMenu(menu);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setSelectedMenu(null);
    };

    const renderMenu = (menu) => (
        <MenuItem key={menu.MENU_NO} component={RouterLink} to={menu.MENU_URL} onClick={handleMenuClose}>
            {menu.MENU_NAME}
            {menu.children.length > 0 && (
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor && selectedMenu === menu)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                    {menu.children.map(child => renderMenu(child))}
                </Menu>
            )}
        </MenuItem>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link component={RouterLink} to="/" color="inherit" underline="none">
                        Shopping
                    </Link>
                </Typography>
                {menus.map(menu => (
                    <Box key={menu.MENU_NO} sx={{ ml: 2 }}>
                        <Button
                            color="inherit"
                            onClick={(e) => handleMenuOpen(e, menu)}
                        >
                            {menu.MENU_NAME}
                        </Button>
                        {menu.children.length > 0 && (
                            <Menu
                                anchorEl={menuAnchor}
                                open={Boolean(menuAnchor && selectedMenu === menu)}
                                onClose={handleMenuClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                                {menu.children.map(child => renderMenu(child))}
                            </Menu>
                        )}
                    </Box>
                ))}
                {user && (
                    <>
                        <Button color="inherit" component={RouterLink} to="/add-menu">
                            Add Menu
                        </Button>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </>
                )}
                {!user && (
                    <>
                        <Button color="inherit" component={RouterLink} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/signup">
                            Sign Up
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
