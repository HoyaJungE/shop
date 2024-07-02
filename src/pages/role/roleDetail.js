// src/pages/Role/RoleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchRoleById } from '../../api';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';

const RoleDetail = () => {
    const { id } = useParams();
    const [Role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRole = async () => {
            try {
                const data = await fetchRoleById(id);
                setRole(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch Role:', error);
                setLoading(false);
            }
        };
        loadRole();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!Role) {
        return <Typography>No Role found</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Role Detail
            </Typography>
            <Box>
                <Typography variant="h6">Name: {Role.ROLE_NM}</Typography>
                {/* 다른 필요한 메뉴 정보 추가 */}
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to={`/edit-Role/${Role.ROLE_NO}`}
                    >
                        Edit Role
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RoleDetail;
