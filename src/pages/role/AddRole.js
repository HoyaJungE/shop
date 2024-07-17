// src/pages/Role/AddRole.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRoles, addRole } from '../../api';
import {
    Container, TextField, Button, Box, MenuItem, Typography
} from '@mui/material';

const AddRole = () => {
    const [RoleData, setRoleData] = useState({
        UPPR_ROLE_NO: '',
        ROLE_NM:'',
        ROLE_CN:''
    });
    const [Roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const loadRoles = async () => {
        const data = await fetchRoles();
        setRoles(data);
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const handleChange = (e) => {
        setRoleData({ ...RoleData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.ROLE_NM = RoleData.ROLE_NM ? '' : 'Role name is required.';
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            await addRole(RoleData);
            loadRoles();
            navigate('/Roles');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Add Role
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                    select
                    fullWidth
                    label="Upper Role"
                    name="UPPR_Role_NO"
                    value={RoleData.UPPR_ROLE_NO}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {Roles.map(Role => (
                        <MenuItem key={Role.ROLE_NO} value={Role.ROLE_NO}>
                            {Role.ROLE_NM}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Role Name"
                    name="ROLE_NM"
                    value={RoleData.ROLE_NM}
                    onChange={handleChange}
                    margin="normal"
                    error={!!errors.ROLE_NM}
                    helperText={errors.ROLE_NM}
                />
                <TextField
                    fullWidth
                    label="Role Cn"
                    name="ROLE_CN"
                    value={RoleData.ROLE_CN}
                    onChange={handleChange}
                    margin="normal"
                />
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Add Role
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddRole;
