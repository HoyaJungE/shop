import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Link, Box, Collapse } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2D9CDB',
        },
        secondary: {
            main: '#56CCF2',
        },
    },
    typography: {
        h6: {
            fontWeight: 700,
            fontSize: '1.25rem',
        },
        button: {
            textTransform: 'none',
        },
    },
});

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Link
                            component={RouterLink}
                            to="/"
                            color="inherit"
                            underline="none"
                            sx={{
                                color: 'white',
                                '&:hover': { color: '#56CCF2' },
                            }}
                        >
                            Shopping
                        </Link>
                    </Typography>
                    {user ? (
                        <Button color="inherit" onClick={logout} sx={{ marginLeft: 2 }}>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                                sx={{ marginLeft: 2 }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/signup"
                                sx={{ marginLeft: 2 }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Header;
