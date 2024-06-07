// src/pages/menu/AddMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMenus, addMenu } from '../../api';
import {
    Container, TextField, Button, Box, MenuItem, Typography
} from '@mui/material';

const AddMenu = () => {
    const [menuData, setMenuData] = useState({
        UPPR_MENU_NO: '',
        MENU_URL: '',
        MENU_NAME: '',
        ORDR: '',
        MENU_TYPE: ''
    });
    const [menus, setMenus] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const loadMenus = async () => {
        const data = await fetchMenus();
        setMenus(data);
    };

    useEffect(() => {
        loadMenus();
    }, []);

    const handleChange = (e) => {
        setMenuData({ ...menuData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.MENU_NAME = menuData.MENU_NAME ? '' : 'Menu name is required.';
        tempErrors.MENU_URL = menuData.MENU_TYPE === '1' && !menuData.MENU_URL ? 'Menu URL is required for type 1.' : '';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            await addMenu(menuData);
            loadMenus();
            navigate('/menus');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add Menu
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Upper Menu"
                    name="UPPR_MENU_NO"
                    value={menuData.UPPR_MENU_NO}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {menus.map(menu => (
                        <MenuItem key={menu.MENU_NO} value={menu.MENU_NO}>
                            {menu.MENU_NAME}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Menu Name"
                    name="MENU_NAME"
                    value={menuData.MENU_NAME}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.MENU_NAME}
                    helperText={errors.MENU_NAME}
                />
                <TextField
                    select
                    fullWidth
                    label="Menu Type"
                    name="MENU_TYPE"
                    value={menuData.MENU_TYPE}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="0">DIV</MenuItem>
                    <MenuItem value="1">링크</MenuItem>
                </TextField>
                {menuData.MENU_TYPE === '1' && (
                    <TextField
                        fullWidth
                        label="Menu URL"
                        name="MENU_URL"
                        value={menuData.MENU_URL}
                        onChange={handleChange}
                        margin="normal"
                        error={!!errors.MENU_URL}
                        helperText={errors.MENU_URL}
                    />
                )}
                <TextField
                    fullWidth
                    label="Order"
                    name="ORDR"
                    type="number"
                    value={menuData.ORDR}
                    onChange={handleChange}
                    margin="normal"
                />
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Add Menu
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddMenu;
