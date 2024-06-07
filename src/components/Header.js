import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { fetchMenus, buildMenuTree } from '../api';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Link, Box } from '@mui/material';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const [menus, setMenus] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const navigate = useNavigate();

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

    const handleMenuClick = (menu) => {
        handleMenuClose();
        console.log(menu.MENU_TYPE);
        navigate(menu.MENU_URL);
        if (menu.MENU_TYPE === 1) {
            navigate(menu.MENU_URL);
        }
    };

    const renderMenu = (menu) => (
        <MenuItem
            key={menu.MENU_NO}
            onClick={() => handleMenuClick(menu)}
            component={menu.MENU_TYPE === 1 ? RouterLink : 'div'}
            to={menu.MENU_TYPE === 1 ? menu.MENU_URL : ''}
        >
            {menu.MENU_NAME}
            {menu.children && menu.children.length > 0 && (
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
                {menus.length > 0 && (
                    <Box>
                        {menus.map(menu => (
                            <Button
                                key={menu.MENU_NO}
                                color="inherit"
                                onClick={(e) => handleMenuOpen(e, menu)}
                            >
                                {menu.MENU_NAME}
                            </Button>
                        ))}
                        <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuAnchor)}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            {selectedMenu && selectedMenu.children.map(child => renderMenu(child))}
                        </Menu>
                    </Box>
                )}
                {user && (
                    <>
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
