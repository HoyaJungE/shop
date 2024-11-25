import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenus, buildMenuTree } from '../api';
import { Box, Button, Collapse, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const LeftMenu = () => {
    const [menus, setMenus] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
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

    const handleMenuToggle = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    };

    const handleMenuClick = (menu) => {
        if (menu.MENU_TYPE === '1') {
            navigate(menu.MENU_URL);
        }
    };

    const renderMenu = (menu) => (
        <Box key={menu.MENU_NO} sx={{ mb: 1 }}>
            <Button
                onClick={() => handleMenuToggle(menu)}
                sx={{
                    justifyContent: 'space-between',
                    fontWeight: 'bold',
                    color: openMenu === menu ? '#ffffff' : '#37474f',
                    backgroundColor: openMenu === menu ? '#1976d2' : 'transparent',
                    '&:hover': {
                        backgroundColor: '#1976d2',
                        color: '#ffffff',
                    },
                    display: 'flex',
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s, color 0.3s',
                }}
                endIcon={menu.children?.length > 0 && (openMenu === menu ? <ExpandMoreIcon /> : <ChevronRightIcon />)}
            >
                {menu.MENU_NAME}
            </Button>
            {menu.children && (
                <Collapse in={openMenu === menu} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 3, mt: 1 }}>
                        {menu.children.map((child) => (
                            <Button
                                key={child.MENU_NO}
                                onClick={() => handleMenuClick(child)}
                                sx={{
                                    display: 'block',
                                    fontWeight: 'normal',
                                    textAlign: 'left',
                                    color: '#37474f',
                                    width: '100%',
                                    padding: '8px 15px',
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                        color: '#1976d2',
                                    },
                                    transition: 'background-color 0.3s, color 0.3s',
                                }}
                            >
                                {child.MENU_NAME}
                            </Button>
                        ))}
                    </Box>
                </Collapse>
            )}
        </Box>
    );

    return (
        <Box
            sx={{
                width: '250px',
                backgroundColor: '#f5f5f5',
                padding: 2,
                height: '100vh',
                overflowY: 'auto',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
            }}
        >
            {menus.map((menu) => renderMenu(menu))}
        </Box>
    );
};

export default LeftMenu;
