// src/pages/menu/EditMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMenus, updateMenu } from '../../api';
import { Container, TextField, Button } from '@mui/material';

const EditMenu = () => {
    const [menu, setMenu] = useState({ UPPR_MENU_NO: '', MENU_URL: '', MENU_NAME: '' });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadMenu = async () => {
            const menus = await fetchMenus();
            const currentMenu = menus.find(menu => menu.MENU_NO === parseInt(id));
            setMenu(currentMenu);
        };
        loadMenu();
    }, [id]);

    const handleChange = (e) => {
        setMenu({ ...menu, [e.target.name]: e.target.value });
    };

    const handleUpdateMenu = async () => {
        await updateMenu(menu);
        navigate('/menus');
    };

    return (
        <Container>
            <h2>Edit Menu</h2>
            <div>
                <TextField
                    label="Upper Menu No"
                    name="UPPR_MENU_NO"
                    value={menu.UPPR_MENU_NO}
                    onChange={handleChange}
                />
                <TextField
                    label="Menu URL"
                    name="MENU_URL"
                    value={menu.MENU_URL}
                    onChange={handleChange}
                />
                <TextField
                    label="Menu Name"
                    name="MENU_NAME"
                    value={menu.MENU_NAME}
                    onChange={handleChange}
                />
                <Button onClick={handleUpdateMenu} variant="contained" color="primary">
                    Update Menu
                </Button>
            </div>
        </Container>
    );
};

export default EditMenu;
