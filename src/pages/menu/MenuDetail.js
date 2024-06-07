// src/pages/menu/MenuDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchMenuById } from '../../api';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';

const MenuDetail = () => {
    const { id } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const data = await fetchMenuById(id);
                setMenu(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch menu:', error);
                setLoading(false);
            }
        };
        loadMenu();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!menu) {
        return <Typography>No menu found</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Menu Detail
            </Typography>
            <Box>
                <Typography variant="h6">Name: {menu.MENU_NAME}</Typography>
                <Typography variant="h6">URL: {menu.MENU_URL}</Typography>
                <Typography variant="h6">Created Date: {menu.CREATE_DT}</Typography>
                {/* 다른 필요한 메뉴 정보 추가 */}
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to={`/edit-menu/${menu.MENU_NO}`}
                    >
                        Edit Menu
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default MenuDetail;
