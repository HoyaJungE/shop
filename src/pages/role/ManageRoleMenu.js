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
    fetchMenus,
    fetchRoles
} from "../../api";

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
    /* 클릭한 롤에대한 메뉴를 트리 구조로 모달에서 보여준다. */
    const loadRoleMenus = async (roleNo) => {
        try {
            const menus = await fetchMenus(roleNo);

            // 재귀적으로 메뉴 트리를 렌더링하는 함수
            const renderTree = (nodes) => (
                <li key={nodes.MENU_ID} style={{ listStyle: 'none', margin: '5px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{nodes.MENU_NAME}</span>
                        <MinusIcon />
                    </div>
                    {Array.isArray(nodes.children) && nodes.children.length > 0 && (
                        <ul style={{ paddingLeft: 20 }}>
                            {nodes.children.map((child) => renderTree(child))}
                        </ul>
                    )}
                </li>
            );

            setModalContents(
                <div>
                    <h4>권한 보유자 메뉴</h4>
                    <ul style={{ padding: 0 }}>
                        {menus.map((menu) => renderTree(menu))}
                    </ul>
                </div>
            );
            setModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
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
