// src/pages/Role/ManageMemberRole.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    CircularProgress,
    ListItem,
    ListItemText,
    List,
    createSvgIcon,
    Paper,
    Button,
    Grid,
    ListItemIcon,
    Checkbox
} from '@mui/material';
import CustomModal from "../../components/CustomModal";
import {
    addMemberRole,
    deleteMemberRole,
    addMemberRoleList,
    deleteMemberRoleList,
    fetchMemberAll,
    fetchRoleMembers,
    fetchRoles
} from "../../api";
import { Link as RouterLink } from "react-router-dom";

const ManageMemberRole = () => {
    const PlusIcon = createSvgIcon(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>plus-circle</title>
            <path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>,
        'Plus',
    );

    const MinusIcon = createSvgIcon(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <title>minus-circle</title>
            <path d="M17,13H7V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
        </svg>,
        'Minus'
    );

    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContents, setModalContents] = useState(<></>);
    const [currentRoleNo, setCurrentRoleNo] = useState(null);
    
    const [roles, setRoles] = useState([]);
    const [roleMembers, setRoleMembers] = useState([]);
    const [members, setMembers] = useState([]);

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    function not(a, b) {
        return a.filter((value) => !b.some(item => item.MEMBER_NO === value.MEMBER_NO));
    }

    function intersection(a, b) {
        return a.filter((value) => b.some(item => item.MEMBER_NO === value.MEMBER_NO));
    }

    const filterOutRoleMembers = (members, roleMembers) => {
        const roleMemberNos = new Set(roleMembers.map(roleMember => roleMember.MEMBER_NO));
        return members.filter(member => !roleMemberNos.has(member.MEMBER_NO));
    };

    const handleToggle = (value) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const currentIndex = checked.findIndex(item => item.MEMBER_NO === value.MEMBER_NO);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            console.log(newChecked);
        } else {
            newChecked.splice(currentIndex, 1);
            console.log(newChecked);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const handleAddMemberRole = async (memberRole) => {
        try {
            await addMemberRole(memberRole);
            loadRoleMembers(memberRole.ROLE_NO);
        } catch (error) {
            console.error('Failed to add Role:', error);
        }
    };

    const handleDeleteMemberRole = async (memberRole) => {
        try {
            await deleteMemberRole(memberRole);
            loadRoleMembers(memberRole.ROLE_NO);
        } catch (error) {
            console.error('Failed to delete Role:', error);
        }
    };

    const handleSave = async () => {
        try {
            const originalMembers = await fetchRoleMembers(currentRoleNo);
            const newMembers = right;

            const membersToAdd = newMembers.filter(
                member => !originalMembers.find(
                    original => original.MEMBER_NO === member.MEMBER_NO
                )
            ).map(member => ({
                MEMBER_NO: member.MEMBER_NO,
                ROLE_NO: currentRoleNo
            }));

            const membersToDelete = originalMembers.filter(
                original => !newMembers.find(
                    member => member.MEMBER_NO === original.MEMBER_NO
                )
            ).map(member => ({
                MEMBER_NO: member.MEMBER_NO,
                ROLE_NO: currentRoleNo
            }));

            if (membersToAdd.length > 0) {
                await addMemberRoleList(membersToAdd);
            }
            if (membersToDelete.length > 0) {
                await deleteMemberRoleList(membersToDelete);
            }

            const updatedRoleMembers = await fetchRoleMembers(currentRoleNo);
            const updatedMembers = await fetchMemberAll();
            const updatedAvailableMembers = filterOutRoleMembers(updatedMembers, updatedRoleMembers);

            setLeft(updatedAvailableMembers);
            setRight(updatedRoleMembers);
            setChecked([]);

            setModalOpen(false);
        } catch (error) {
            console.error('Failed to save changes:', error);
        }
    };

    const customList = (items) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value.MEMBER_NO}-label`;
                    
                    const isChecked = checked.some(item => item.MEMBER_NO === value.MEMBER_NO);

                    return (
                        <ListItem
                            key={value.MEMBER_NO}
                            role="listitem"
                            onClick={handleToggle(value)}
                            component="button"
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={isChecked}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.MEMBER_ID} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    const updateModalContents = () => {
        setModalContents(
            <div>
                <h4>권한 보유자 관리</h4>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item>{customList(left)}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllRight}
                                disabled={left.length === 0}
                                aria-label="move all right"
                            >
                                ≫
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                                &gt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                &lt;
                            </Button>
                            <Button
                                sx={{ my: 0.5 }}
                                variant="outlined"
                                size="small"
                                onClick={handleAllLeft}
                                disabled={right.length === 0}
                                aria-label="move all left"
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(right)}</Grid>
                </Grid>
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleSave}
                        sx={{ mr: 1 }}
                    >
                        저장
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => setModalOpen(false)}
                    >
                        취소
                    </Button>
                </Grid>
            </div>
        );
    };

    const loadRoleMembers = async (roleNo) => {
        try {
            const roleMembers = await fetchRoleMembers(roleNo);
            const members = await fetchMemberAll();
            const availableMembers = filterOutRoleMembers(members, roleMembers);

            setLeft(availableMembers);
            setRight(roleMembers);
            setRoleMembers(roleMembers);
            setChecked([]);
            setCurrentRoleNo(roleNo);
            
            updateModalContents();
            setModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch role members:', error);
        }
    };

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const data = await fetchRoles();
                setRoles(data);
            } catch (error) {
                console.error('Failed to fetch Roles:', error);
            } finally {
                setLoading(false);
            }
        };
        loadRoles();
    }, []);

    useEffect(() => {
        if (modalOpen) {
            updateModalContents();
        }
    }, [left, right, checked]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Container>
            <CustomModal title='Manage Member Role' open={modalOpen} onClose={() => setModalOpen(false)}>
                {modalContents}
            </CustomModal>
            <h2>권한목록</h2>
            <List>
                {roles.map(role => (
                    <ListItem key={role.ROLE_NO} component="button">
                        <ListItemText primary={role.ROLE_NO} secondary={role.ROLE_NM} />
                        <PlusIcon onClick={() => loadRoleMembers(role.ROLE_NO)} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ManageMemberRole;
