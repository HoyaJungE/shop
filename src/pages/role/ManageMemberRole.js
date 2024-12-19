// src/pages/Role/ManageMemberRole.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    CircularProgress,
    ListItem,
    ListItemText,
    List,
    Paper,
    Button,
    Grid,
    ListItemIcon,
    Checkbox,
    Typography,
    Card,
    CardContent,
    Divider,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    PersonRemove as PersonRemoveIcon,
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
    KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    ManageAccounts as ManageAccountsIcon,
    Assignment as AssignmentIcon,
    AccountTree as AccountTreeIcon
} from '@mui/icons-material';
import CustomModal from "../../components/CustomModal";
import {
    addMemberRoleList,
    deleteMemberRoleList,
    fetchMemberAll,
    fetchRoleMembers,
    fetchRoles,
    addMemberRole,
    deleteMemberRole
} from "../../api";

const ManageMemberRole = () => {
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

            let addResult, deleteResult;

            if (membersToAdd.length > 0) {
                addResult = await addMemberRoleList(membersToAdd);
            }
            if (membersToDelete.length > 0) {
                deleteResult = await deleteMemberRoleList(membersToDelete);
            }

            let message = [];
            if (addResult) {
                message.push(`${addResult.totalInserted}명 추가됨`);
            }
            if (deleteResult) {
                message.push(`${deleteResult.totalDeleted}명 삭제됨`);
            }

            alert(message.join(', ') || '변경사항이 없습니다.');

            setModalOpen(false);
            setLeft([]);
            setRight([]);
            setChecked([]);

        } catch (error) {
            console.error('Failed to save changes:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    const customList = (items, title) => (
        <Card sx={{ width: 350, height: 500, bgcolor: 'background.paper' }}>
            <CardContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                        {title === '미배정 사용자' ? 
                            <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} /> : 
                            <AdminPanelSettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        }
                        {title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        총 {items.length}명
                    </Typography>
                </Box>
                <Divider />
                <Paper sx={{ 
                    height: 380, 
                    overflow: 'auto', 
                    mt: 2,
                    bgcolor: 'background.default'
                }}>
                    <List dense component="div" role="list">
                        {items.map((value) => {
                            const labelId = `transfer-list-item-${value.MEMBER_NO}-label`;
                            const isChecked = checked.some(item => item.MEMBER_NO === value.MEMBER_NO);

                            return (
                                <ListItem
                                    key={value.MEMBER_NO}
                                    role="listitem"
                                    onClick={handleToggle(value)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                        },
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            checked={isChecked}
                                            tabIndex={-1}
                                            disableRipple
                                            color="primary"
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        id={labelId}
                                        primary={
                                            <Typography variant="subtitle1">
                                                {value.MEMBER_ID}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {value.MEMBER_NAME || '이름 없음'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </CardContent>
        </Card>
    );

    const updateModalContents = () => {
        setModalContents(
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                    권한 보유자 관리
                </Typography>
                <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    <Grid item>{customList(left, '미배정 사용자')}</Grid>
                    <Grid item>
                        <Grid container direction="row" spacing={2}>
                            <Grid item>
                                <Tooltip title="모두 추가">
                                    <IconButton
                                        onClick={handleAllRight}
                                        disabled={left.length === 0}
                                        aria-label="move all right"
                                    >
                                        <KeyboardDoubleArrowRightIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="선택 추가">
                                    <IconButton
                                        onClick={handleCheckedRight}
                                        disabled={leftChecked.length === 0}
                                        aria-label="move selected right"
                                    >
                                        <KeyboardArrowRightIcon color="primary" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="선택 제거">
                                    <IconButton
                                        onClick={handleCheckedLeft}
                                        disabled={rightChecked.length === 0}
                                        aria-label="move selected left"
                                    >
                                        <KeyboardArrowLeftIcon color="error" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="모두 제거">
                                    <IconButton
                                        onClick={handleAllLeft}
                                        disabled={right.length === 0}
                                        aria-label="move all left"
                                    >
                                        <KeyboardDoubleArrowLeftIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(right, '권한 보유자')}</Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                        variant="contained" 
                        onClick={handleSave}
                        sx={{ mr: 1 }}
                        color="primary"
                    >
                        저장
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => setModalOpen(false)}
                    >
                        취소
                    </Button>
                </Box>
            </Box>
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
            <CustomModal 
                open={modalOpen} 
                onClose={() => setModalOpen(false)}
                maxWidth={false}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '90vw',
                        maxWidth: '1400px',
                        margin: '24px'
                    }
                }}
            >
                <Box sx={{ p: 3, width: '100%' }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 3 
                    }}>
                        <AdminPanelSettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        권한 보유자 관리
                    </Typography>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        gap: 2 
                    }}>
                        {customList(left, '미배정 사용자')}
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'row',
                            gap: 1 
                        }}>
                            <Tooltip title="모두 추가">
                                <span>
                                    <IconButton
                                        onClick={handleAllRight}
                                        disabled={left.length === 0}
                                        color="primary"
                                        sx={{ border: 1, borderColor: 'divider' }}
                                    >
                                        <KeyboardDoubleArrowRightIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="선택 추가">
                                <span>
                                    <IconButton
                                        onClick={handleCheckedRight}
                                        disabled={leftChecked.length === 0}
                                        color="primary"
                                        sx={{ border: 1, borderColor: 'divider' }}
                                    >
                                        <KeyboardArrowRightIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="선택 제거">
                                <span>
                                    <IconButton
                                        onClick={handleCheckedLeft}
                                        disabled={rightChecked.length === 0}
                                        color="error"
                                        sx={{ border: 1, borderColor: 'divider' }}
                                    >
                                        <KeyboardArrowLeftIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="모두 제거">
                                <span>
                                    <IconButton
                                        onClick={handleAllLeft}
                                        disabled={right.length === 0}
                                        color="error"
                                        sx={{ border: 1, borderColor: 'divider' }}
                                    >
                                        <KeyboardDoubleArrowLeftIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Box>
                        {customList(right, '권한 보유자')}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
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
                    </Box>
                </Box>
            </CustomModal>
            
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettingsIcon sx={{ mr: 2, fontSize: 30, color: 'primary.main' }} />
                <Typography variant="h4">권한 관리</Typography>
            </Box>
            
            <Paper elevation={3} sx={{ p: 2 }}>
                <List>
                    {roles.map(role => (
                        <ListItem
                            key={role.ROLE_NO}
                            sx={{
                                mb: 1,
                                border: 1,
                                borderColor: 'divider',
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <ListItemIcon>
                                <ManageAccountsIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        {role.ROLE_NM}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                        {role.ROLE_CN || '권한 설명 없음'}
                                    </Typography>
                                }
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PersonAddIcon />}
                                onClick={() => loadRoleMembers(role.ROLE_NO)}
                                sx={{ minWidth: 120 }}
                            >
                                권한 관리
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default ManageMemberRole;
