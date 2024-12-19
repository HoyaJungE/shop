// src/pages/Role/ManageRoleMenu.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    CircularProgress,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    alpha,
    Button,
} from '@mui/material';
import {
    FolderOutlined,
    DescriptionOutlined,
    ChevronRight,
    ExpandMore,
    Security as SecurityIcon,
    Article,
    Folder,
    FolderOpen
} from '@mui/icons-material';
import CustomModal from "../../components/CustomModal";
import { fetchMenus, fetchRoles } from "../../api";
import TreeMenu from 'react-simple-tree-menu';

const MenuTreeView = ({ menus }) => {
    const [checkedItems, setCheckedItems] = useState({});
    const [expandedItems, setExpandedItems] = useState({});
    const [treeData, setTreeData] = useState(() => convertToTreeData(menus));
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        console.log('Current expanded items:', expandedItems);
        setRenderKey(prev => prev + 1);
    }, [expandedItems]);

    function convertToTreeData(menuItems) {
        const menuMap = {};
        const result = {};

        menuItems.forEach(menu => {
            menuMap[String(menu.MENU_NO)] = {
                key: String(menu.MENU_NO),
                label: menu.MENU_NAME,
                url: menu.MENU_URL,
                nodes: {}
            };
        });

        menuItems.forEach(menu => {
            const menuId = String(menu.MENU_NO);
            const parentId = menu.UPPR_MENU_NO ? String(menu.UPPR_MENU_NO) : null;

            if (!parentId) {
                result[menuId] = menuMap[menuId];
            } else if (menuMap[parentId]) {
                menuMap[parentId].nodes[menuId] = menuMap[menuId];
            }
        });

        return result;
    }

    const handleExpandAll = (expand) => {
        const newExpandedItems = {};
        
        const collectNodes = (nodes) => {
            Object.keys(nodes).forEach(key => {
                newExpandedItems[key] = expand;
                if (nodes[key].nodes && Object.keys(nodes[key].nodes).length > 0) {
                    collectNodes(nodes[key].nodes);
                }
            });
        };

        collectNodes(treeData);
        
        Promise.resolve().then(() => {
            setExpandedItems(newExpandedItems);
            setRenderKey(prev => prev + 1);
        });
    };

    const getMenuIcon = (hasChildren, isOpen) => {
        if (!hasChildren) {
            return <Article fontSize="small" sx={{ color: 'text.secondary' }} />;
        }
        return isOpen ? 
            <FolderOpen fontSize="small" sx={{ color: 'text.secondary' }} /> : 
            <Folder fontSize="small" sx={{ color: 'text.secondary' }} />;
    };

    return (
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
                <Button
                    size="small"
                    startIcon={<ExpandMore />}
                    onClick={() => {
                        console.log('Expand all clicked');
                        handleExpandAll(true);
                    }}
                    variant="outlined"
                >
                    전체 펼치기
                </Button>
                <Button
                    size="small"
                    startIcon={<ChevronRight />}
                    onClick={() => {
                        console.log('Collapse all clicked');
                        handleExpandAll(false);
                    }}
                    variant="outlined"
                >
                    전체 접기
                </Button>
            </Box>

            <TreeMenu
                key={renderKey}
                data={treeData}
                hasSearch={false}
                expanded={expandedItems}
                resetOpenNodesOnDataUpdate={false}
                onClickItem={({ key, isOpen }) => {
                    console.log('Node clicked:', key, 'current isOpen:', isOpen);
                    setExpandedItems(prev => ({
                        ...prev,
                        [key]: !isOpen
                    }));
                }}
            >
                {({ items }) => (
                    <List>
                        {items.map(({ key, level, isOpen, label, nodes, toggleNode }) => {
                            const hasChildren = nodes && Object.keys(nodes).length > 0;

                            return (
                                <ListItem
                                    key={key}
                                    sx={{
                                        pl: level * 3,
                                        py: 0.5,
                                        '&:hover': {
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                                            borderRadius: 1,
                                        },
                                        transition: 'all 0.2s',
                                        borderRadius: 1,
                                        mb: 0.5,
                                    }}
                                >
                                    <Box 
                                        onClick={toggleNode}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            minWidth: 32,
                                            color: 'text.secondary',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {hasChildren && (
                                            isOpen ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />
                                        )}
                                    </Box>
                                    <ListItemIcon 
                                        onClick={toggleNode}
                                        sx={{ 
                                            minWidth: 36,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {getMenuIcon(hasChildren, isOpen)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox
                                                    size="small"
                                                    checked={checkedItems[key] || false}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setCheckedItems(prev => ({
                                                            ...prev,
                                                            [key]: e.target.checked
                                                        }));
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    sx={{ 
                                                        mr: 1,
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 20
                                                        }
                                                    }}
                                                />
                                                <Typography
                                                    onClick={toggleNode}
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: hasChildren ? 500 : 400,
                                                        color: hasChildren ? 'text.primary' : 'text.secondary',
                                                        fontSize: '0.875rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {label}
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{ m: 0 }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </TreeMenu>
        </Box>
    );
};

const ManageRoleMenu = () => {
    const [menus, setMenus] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const response = await fetchRoles();
            if (response && Array.isArray(response)) {
                setRoles(response);
            }
        } catch (error) {
            console.error('권한 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleClick = async (role) => {
        try {
            setLoading(true);
            console.log('선택된 권한:', role);

            const response = await fetchMenus();
            console.log('메뉴 응답:', response);
            
            if (Array.isArray(response)) {
                // 유효한 메뉴 데이터만 필터링
                const validMenus = response.filter(menu => menu && menu.MENU_NO);
                console.log('유효한 메뉴:', validMenus);
                
                setMenus(validMenus);
                setSelectedRole({
                    ROLE_NO: role.ROLE_NO,
                    ROLE_NAME: role.ROLE_NAME
                });
                setModalOpen(true);
            }
        } catch (error) {
            console.error('메뉴 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    권한별 메뉴 관리
                </Typography>
                <List>
                    {roles.map((role) => (
                        <ListItem
                            key={role.ROLE_NO}
                            component="button"
                            onClick={() => handleRoleClick(role)}
                            sx={{
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <ListItemIcon>
                                <SecurityIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                                primary={role.ROLE_NAME}
                                secondary={role.ROLE_DESC || '설명 없음'}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            <CustomModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedRole ? `${selectedRole.ROLE_NAME} 메뉴 구성` : '메뉴 구성'}
            >
                <Box sx={{ minHeight: '60vh', maxHeight: '70vh', overflow: 'auto' }}>
                    <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2 }}>
                        {loading ? (
                            <Box display="flex" justifyContent="center">
                                <CircularProgress />
                            </Box>
                        ) : menus && menus.length > 0 ? (
                            <MenuTreeView menus={menus} />
                        ) : (
                            <Typography>메뉴 데이터가 없습니다.</Typography>
                        )}
                    </Paper>
                </Box>
            </CustomModal>
        </Container>
    );
};

export default ManageRoleMenu;
