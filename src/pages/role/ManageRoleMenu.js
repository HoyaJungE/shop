// src/pages/Role/ManageRoleMenu.js
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
    fetchMenus,
    fetchRoleMembers,
    fetchRoles
} from "../../api";
import { Link as RouterLink } from "react-router-dom";

const ManageRoleMenu = () => {
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
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleMenus, setRoleMenus] = useState([]);

    /* 클릭한 롤에대한 인원배정모달팝업을 띄운다. */
    const loadRoleMenus = async (roleNo) => {
        try {
            const menus = await fetchMenus(roleNo);

            setModalContents(
                <>
                    <div>
                        <h4>권한보유자</h4>
                        <List>
                            {menus.map(menu => (
                                <ListItem key={menu.MENU_ID} button>
                                    <ListItemText primary={menu.MENU_NAME} />
                                    <MinusIcon  />
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
            <h2>권한메뉴설정</h2>
            <List>
                {roles.map(role => (
                    <ListItem key={role.ROLE_NO} button>
                        <ListItemText primary={role.ROLE_NO} secondary={role.ROLE_NM} />
                        <PlusIcon onClick={() => loadRoleMenus(role.ROLE_NO)} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ManageRoleMenu;
