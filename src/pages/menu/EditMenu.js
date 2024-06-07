import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMenuById, updateMenu } from '../../api';
import {
    Container, TextField, Button, Box, Typography, CircularProgress, Alert
} from '@mui/material';

const EditMenu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState({
        UPPR_MENU_NO: '',
        MENU_URL: '',
        MENU_NAME: '',
        ORDR: '',
        MENU_TYPE: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const data = await fetchMenuById(id);
                setMenu(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch menu data');
                setLoading(false);
            }
        };
        loadMenu();
    }, [id]);

    const handleChange = (e) => {
        setMenu({ ...menu, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMenu(menu);
            navigate('/menus');
        } catch (error) {
            setError('Failed to update menu');
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Edit Menu
                </Typography>
                <TextField
                    label="Upper Menu No"
                    name="UPPR_MENU_NO"
                    value={menu.UPPR_MENU_NO}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Menu URL"
                    name="MENU_URL"
                    value={menu.MENU_URL}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Menu Name"
                    name="MENU_NAME"
                    value={menu.MENU_NAME}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Order"
                    name="ORDR"
                    value={menu.ORDR}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Menu Type"
                    name="MENU_TYPE"
                    value={menu.MENU_TYPE}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Update Menu
                </Button>
            </Box>
        </Container>
    );
};

export default EditMenu;
