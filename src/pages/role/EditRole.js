import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {fetchRoleById, updateRole} from '../../api';
import {
    Container, TextField, Button, Box, Typography, CircularProgress, Alert
} from '@mui/material';

const EditRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState({
        ROLE_NO:0,
        UPPR_ROLE_NO:null,
        ROLE_NM:'',
        ROLE_CN:''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRole = async () => {
            try {
                const data = await fetchRoleById(id);
                setRoleData(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch role data');
                setLoading(false);
            }
        };
        loadRole();
    }, [id]);

    const handleChange = (e) => {
        setRoleData({ ...roleData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRole(roleData);
            navigate('/roles');
        } catch (error) {
            setError('Failed to update role');
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
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Edit Role
                </Typography>
                <TextField
                    select
                    fullWidth
                    label="Role No"
                    name="ROLE_NO"
                    value={roleData.ROLE_NO}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    select
                    fullWidth
                    label="Upper Role"
                    name="UPPR_ROLE_NO"
                    value={roleData.UPPR_ROLE_NO}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Role Name"
                    name="ROLE_NM"
                    value={roleData.ROLE_NM}
                    onChange={handleChange}
                    margin="normal"
                    error={!!error.ROLE_NM}
                    helperText={error.ROLE_NM}
                />
                <TextField
                    fullWidth
                    label="Role Description"
                    name="ROLE_CN"
                    value={roleData.ROLE_CN}
                    onChange={handleChange}
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Update Role
                </Button>
            </Box>
        </Container>
    );
};

export default EditRole;
