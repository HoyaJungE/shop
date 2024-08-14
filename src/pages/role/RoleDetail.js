// src/pages/Role/RoleDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchRoleById } from '../../api';
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material';

const RoleDetail = () => {
    const { id } = useParams();
    const [role, setRole] = useState(null);
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

    if (!role) {
        return <Typography>No Role found</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Role Detail
            </Typography>
            <Box>
                <Typography variant="h6">upperRoleNo: {role.UPPR_ROLE_NO}</Typography>
                <Typography variant="h6">roleNo: {role.ROLE_NO}</Typography>
                <Typography variant="h6">Name: {role.ROLE_NM}</Typography>
                {/* 다른 필요한 메뉴 정보 추가 */}
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to={`/edit-role/${role.ROLE_NO}`}
                    >
                        Edit Role
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default RoleDetail;
