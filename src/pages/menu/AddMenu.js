// src/pages/menu/AddMenu.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMenu } from '../../api';
import { Container, TextField, Button } from '@mui/material';

const AddMenu = () => {
    const [newMenu, setNewMenu] = useState({ UPPR_MENU_NO: '', MENU_URL: '', MENU_NAME: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setNewMenu({ ...newMenu, [e.target.name]: e.target.value });
    };

    const handleAddMenu = async () => {
        await addMenu(newMenu);
        navigate('/menus');
    };

    return (
        <Container>
            <h2>Add Menu</h2>
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
        </Container>
    );
};

export default AddMenu;
