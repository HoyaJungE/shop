// src/pages/Role/ManageMemberRole.js
import React, { useState, useEffect } from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {fetchRoles, addRole, fetchMembers, addMemberRole, fetchRoleMembers} from '../../api';
import {
    Container,
    TextField,
    Button,
    Box,
    MenuItem,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    ListItem,
    ListItemText,
    IconButton, Modal
} from '@mui/material';
import CustomModal from "../../components/CustomModal";
import {  } from '@mui/material/styles';

const ManageMemberRole = () => {
    const [RoleData, setRoleData] = useState({
        UPPR_ROLE_NO: '',
        ROLE_NO: '',
        ROLE_NM:'',
        ROLE_CN:''
    });

    const [memberData, setMemberData] = useState({
        MEMBER_NO: '',
        MEMBER_ID: '',
        MEMBER_PASSWD: '',
        MEMBER_NAME: '',
        MEMBER_BIRTH: '',
        MEMBER_EMAIL: '',
        MEMBER_PHONE: '',
        MEMBER_ZIPCODE: '',
        MEMBER_ADDR1: '',
        MEMBER_ADDR2: '',
        MEMBER_DATE: '',
        MEMBER_GRADE: '',
        MEMBER_TOTAL: '',
        MEMBER_LOG: '',
        MEMBER_DELETE: '',
        SMS_AGREE: '',
        EMAIL_AGREE: ''
    });

    const [memberRole, setMemberRole] = useState({
        ROLE_NO: '',
        MEMBER_ID: ''
    });

    const [Roles, setRoles] = useState([]);
    const [members, setMembers] = useState([]);
    const [roleMembers, setRoleMembers] = useState([]);
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const loadRoles = async () => {
        const data = await fetchRoles();
        setRoles(data);
    };

    const loadMembers = async () => {
        const data = await fetchMembers();
        setMembers(data);
    };

    const loadRoleMembers = async () => {
        const data = await fetchRoleMembers(1);
        console.log(data);
        setRoleMembers(data);
    };

    useEffect(() => {
        loadRoles();
        loadMembers();
    }, []);

    const handleChange = (e) => {
        setRoleData({ ...RoleData, [e.target.name]: e.target.value });
    };

    const handleMemberChange = (e) => {
        setMemberData({ ...memberData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.ROLE_NM = RoleData.ROLE_NM ? '' : 'Role name is required.';
        setError(tempErrors);
        return Object.values(tempErrors).every(x => x === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addMemberRole(memberRole);
            navigate('/memberRole');
        } catch (error) {
            setError('Failed to update menu');
        }
    };

    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModaClose = () => {
        setModalOpen(false);
    };

    return (
        <Container>
            <Button variant="contained" color="primary" onClick={loadRoleMembers}>
                Open Modal
            </Button>

            <Typography variant="h4" gutterBottom>
                ManageMemberRole
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Typography variant="h4" gutterBottom>
                    RoleList
                </Typography>
                <Grid container spacing={4}>
                    {Roles.map(Role => (
                        <>
                            <ListItem
                                key={Role.ROLE_NO}
                                button
                                component={RouterLink}
                                onClick={()=>{ memberRole.ROLE_NO = Role.ROLE_NO; console.log(memberRole); }}
                            >
                                <ListItemText
                                    primary={Role.ROLE_NO}
                                    secondary={Role.ROLE_NM}
                                />
                            </ListItem>
                            <Button variant="contained" color="primary" onClick={handleModalOpen}>
                            Open Modal
                            </Button>
                            <CustomModal open={modalOpen} onClose={handleModaClose} title="Modal Title">
                                <p>This is the modal content.</p>
                                <Grid container spacing={4}>
                                    {Roles.map(Role => (
                                        <ListItem
                                        key={Role.ROLE_NO}
                                        button
                                        component={RouterLink}
                                        >
                                        <ListItemText
                                        primary={Role.ROLE_NO}
                                        secondary={Role.ROLE_NM}
                                        />
                                        </ListItem>
                                    ))}
                                </Grid>
                            </CustomModal>
                        </>
                    ))}
                </Grid>

                <Typography variant="h4" gutterBottom>
                    MemberList
                </Typography>
                <Grid container spacing={2}>
                    {members.map(member => (
                        <ListItem
                            key={member.MEMBER_NO}
                            button
                            component={RouterLink}
                        >
                            <ListItemText
                                primary={member.MEMBER_NO}
                            />
                            <ListItemText
                                primary={member.MEMBER_ID}
                            />
                        </ListItem>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default ManageMemberRole;
