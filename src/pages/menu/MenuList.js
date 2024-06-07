// src/pages/menu/MenuList.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchMenus, addMenu, deleteMenu } from '../../api';
import {
    Container, TextField, Button, List, ListItem, ListItemText, IconButton, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [newMenu, setNewMenu] = useState({ UPPR_MENU_NO: '', MENU_URL: '', MENU_NAME: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMenus = async () => {
            try {
                const data = await fetchMenus();
                setMenus(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch menus:', error);
                setLoading(false);
            }
        };
        loadMenus();
    }, []);

    const handleChange = (e) => {
        setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
    };

    const handleAddMenu = async () => {
        try {
            const addedMenu = await addMenu(newMenu);
            setMenus([...menus, addedMenu]);
            setNewMenu({ UPPR_MENU_NO: '', MENU_URL: '', MENU_NAME: '' });
        } catch (error) {
            console.error('Failed to add menu:', error);
        }
    };

    const handleDeleteMenu = async (id) => {
        try {
            await deleteMenu(id);
            setMenus(menus.filter(menu => menu.MENU_NO !== id));
        } catch (error) {
            console.error('Failed to delete menu:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <h2>메뉴관리</h2>
            <List>
                {menus.map(menu => (
                    <ListItem
                        key={menu.MENU_NO}
                        button
                        component={RouterLink}
                        to={`/menu/${menu.MENU_NO}`}
                    >
                        <ListItemText
                            primary={menu.MENU_NAME}
                            secondary={menu.MENU_URL}
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteMenu(menu.MENU_NO)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default MenuList;
