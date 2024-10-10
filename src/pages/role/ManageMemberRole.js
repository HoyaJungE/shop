// src/pages/Role/ManageMemberRole.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    CircularProgress,
    ListItem,
    ListItemText,
    List,
    createSvgIcon
} from '@mui/material';
import CustomModal from "../../components/CustomModal";
import {
    addMemberRole,
    deleteMemberRole,
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

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContents, setModalContents] = useState(<></>);
    const [roleMembers, setRoleMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);

    // roleMembers에 포함된 멤버를 제외한 members 리스트를 반환하는 함수
    const filterOutRoleMembers = (members, roleMembers) => {
        const roleMemberNos = new Set(roleMembers.map(roleMember => roleMember.MEMBER_NO));
        return members.filter(member => !roleMemberNos.has(member.MEMBER_NO));
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

    /* 클릭한 롤에대한 인원배정모달팝업을 띄운다. */
    const loadRoleMembers = async (roleNo) => {
        try {
            const members = await fetchMemberAll();
            const roleMembers = await fetchRoleMembers(roleNo);

            // 중복되는 멤버를 제외한 members 리스트 생성
            const filteredMembers = filterOutRoleMembers(members, roleMembers);

            setMembers(filteredMembers);
            setRoleMembers(roleMembers);
            setModalContents(
                <>
                    <div>
                        <h4>권한보유자</h4>
                        <List>
                            {roleMembers.map(roleMember => (
                                <ListItem key={roleMember.MEMBER_NO} button>
                                    <ListItemText primary={roleMember.MEMBER_ID} />
                                    <MinusIcon onClick={() => handleDeleteMemberRole({ MEMBER_NO: roleMember.MEMBER_NO, ROLE_NO: roleNo })} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div>
                        <h4>권한미보유자</h4>
                        <List>
                            {filteredMembers.map(member => (
                                <ListItem key={member.MEMBER_NO} button>
                                    <ListItemText primary={member.MEMBER_ID} />
                                    <PlusIcon onClick={() => handleAddMemberRole({ MEMBER_NO: member.MEMBER_NO, ROLE_NO: roleNo })} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </>
            );
            setModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch Roles:', error);
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
                    <ListItem key={role.ROLE_NO} button>
                        <ListItemText primary={role.ROLE_NO} secondary={role.ROLE_NM} />
                        <PlusIcon onClick={() => loadRoleMembers(role.ROLE_NO)} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ManageMemberRole;
