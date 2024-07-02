// src/pages/Role/RoleList.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchRoles, addRole, deleteRole } from '../../api';
import {
    Container, TextField, Button, List, ListItem, ListItemText, IconButton, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const RoleList = () => {
    const [Roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({ ROLE_NO: '', UPPR_ROLE_NO: '', ROLE_NM: '', ROLE_CN: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await fetchRoles();
                setRoles(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch Roles:', error);
                setLoading(false);
            }
        };
        loadRoles();
    }, []);

    const handleChange = (e) => {
        setNewRole({ ...newRole, [e.target.name]: e.target.value });
    };

    const handleAddRole = async () => {
        try {
            const addedRole = await addRole(newRole);
            setRoles([...Roles, addedRole]);
            setNewRole({ ROLE_NO: '', UPPR_ROLE_NO: '', ROLE_NM: '',  ROLE_CN:'' });
        } catch (error) {
            console.error('Failed to add Role:', error);
        }
    };

    const handleDeleteRole = async (id) => {
        try {
            await deleteRole(id);
            setRoles(Roles.filter(Role => Role.ROLE_NO !== id));
        } catch (error) {
            console.error('Failed to delete Role:', error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <h2>롤관리</h2>
            <List>
                {Roles.map(Role => (
                    <ListItem
                        key={Role.ROLE_NO}
                        button
                        component={RouterLink}
                        to={`/role/${Role.ROLE_NO}`}
                    >
                        <ListItemText
                            primary={Role.ROLE_NO}
                            secondary={Role.ROLE_NM}
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRole(Role.ROLE_NO)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default RoleList;
