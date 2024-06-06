// src/pages/menu/MenuList.js
import React, { useState, useEffect } from 'react';
import { fetchMenus, addMenu, updateMenu, deleteMenu } from '../../api';
import {
    Container, TextField, Button, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MenuList = () => {
    const [menus, setMenus] = useState([]);
    const [newMenu, setNewMenu] = useState({ UPPR_MENU_NO: '', MENU_URL: '', MENU_NAME: '' });

    useEffect(() => {
        const loadMenus = async () => {
            const data = await fetchMenus();
            setMenus(data);
        };
        loadMenus();
    }, []);

    const handleChange = (e) => {
        setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
    };

    const handleAddMenu = async () => {
        const addedMenu = await addMenu(newMenu);
        setMenus([...menus, addedMenu]);
        setNewMenu({ UPPR_MENU_NO: '', MENU_URL: '', MENU_NAME: '' });
    };

    const handleDeleteMenu = async (id) => {
        await deleteMenu(id);
        setMenus(menus.filter(menu => menu.MENU_NO !== id));
    };

    return (
        <Container>
            <h2>Menu Management</h2>
            <div>
                <TextField
                    label="Upper Menu No"
                    name="UPPR_MENU_NO"
                    value={newMenu.UPPR_MENU_NO}
                    onChange={handleChange}
                />
                <TextField
                    label="Menu URL"
                    name="MENU_URL"
                    value={newMenu.MENU_URL}
                    onChange={handleChange}
                />
                <TextField
                    label="Menu Name"
                    name="MENU_NAME"
                    value={newMenu.MENU_NAME}
                    onChange={handleChange}
                />
                <Button onClick={handleAddMenu} variant="contained" color="primary">
                    Add Menu
                </Button>
            </div>
            <List>
                {menus.map(menu => (
                    <ListItem key={menu.MENU_NO}>
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
