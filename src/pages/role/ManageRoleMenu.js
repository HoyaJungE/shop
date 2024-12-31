import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    CircularProgress,
    Paper,
    Typography,
    Box,
    Button,
} from '@mui/material';
import {
    Security as SecurityIcon
} from '@mui/icons-material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import CustomModal from "../../components/CustomModal";
import { fetchMenus, fetchRoles } from "../../api";

const prepareMenuTree = (menus) => {
    const menuMap = new Map();

    // 메뉴 데이터를 Map에 저장
    menus.forEach(menu => {
        menuMap.set(menu.MENU_NO, { ...menu, children: [] });
    });

    // 부모-자식 관계 설정
    menus.forEach(menu => {
        if (menu.UPPR_MENU_NO != null) {
            const parent = menuMap.get(menu.UPPR_MENU_NO);
            if (parent) {
                parent.children.push(menuMap.get(menu.MENU_NO));
            }
        }
    });

    // MUI_X_PRODUCTS 형식 변환
    const convertToMUIFormat = (node) => ({
        id: String(node.MENU_NO),
        label: node.MENU_NAME,
        children: node.children.length > 0
            ? node.children.map(convertToMUIFormat)
            : [],
    });

    // 루트 노드 설정 및 변환
    const rootNodes = Array.from(menuMap.values()).filter(menu => menu.UPPR_MENU_NO == null);
    return rootNodes.map(convertToMUIFormat);
};

function getItemDescendantsIds(item) {
    const ids = [];
    item.children?.forEach((child) => {
        ids.push(child.id);
        ids.push(...getItemDescendantsIds(child));
    });
    return ids;
}

const MenuTreeView = ({ menus, selectedItems, setSelectedItems }) => {
    const toggledItemRef = useRef({});
    const apiRef = useTreeViewApiRef();

    const getAllItemIds = () => {
        const ids = [];
        const registerItemId = (item) => {
            ids.push(item.id);
            item.children?.forEach(registerItemId);
        };
        menus.forEach(registerItemId);
        return ids;
    };

    const handleItemSelectionToggle = (event, itemId, isSelected) => {
        toggledItemRef.current[itemId] = isSelected;
    };

    const handleSelectedItemsChange = (event, newSelectedItems) => {
        setSelectedItems(newSelectedItems);

        // Select / unselect the children of the toggled item
        const itemsToSelect = [];
        const itemsToUnSelect = {};
        Object.entries(toggledItemRef.current).forEach(([itemId, isSelected]) => {
            const item = apiRef.current.getItem(itemId);
            if (isSelected) {
                itemsToSelect.push(...getItemDescendantsIds(item));
            } else {
                getItemDescendantsIds(item).forEach((descendantId) => {
                    itemsToUnSelect[descendantId] = true;
                });
            }
        });

        const newSelectedItemsWithChildren = Array.from(
            new Set(
                [...newSelectedItems, ...itemsToSelect].filter(
                    (itemId) => !itemsToUnSelect[itemId],
                ),
            ),
        );

        setSelectedItems(newSelectedItemsWithChildren);

        toggledItemRef.current = {};
    };

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedItems([])}
                >
                    전체 선택 해제
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedItems(getAllItemIds())}
                >
                    전체 선택
                </Button>
            </Box>
            {menus.length > 0 ? (
                <RichTreeView
                    items={menus}
                    selectedItems={selectedItems}
                    onSelectedItemsChange={handleSelectedItemsChange}
                    onItemSelectionToggle={handleItemSelectionToggle}
                    multiSelect
                    checkboxSelection
                    apiRef={apiRef}
                    sx={{ padding: 2, bgcolor: 'background.paper', borderRadius: 1 }}
                />
            ) : (
                <Typography>루트 메뉴가 없습니다. 데이터를 확인해주세요.</Typography>
            )}
        </Box>
    );
};

const ManageRoleMenu = () => {
    const [menus, setMenus] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // 선택된 메뉴 상태
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const response = await fetchRoles();
            if (response && Array.isArray(response)) {
                setRoles(response);
            } else {
                console.error("Roles API returned invalid data.");
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
            console.log('FetchMenus Response:', response);

            if (Array.isArray(response)) {
                const validMenus = response.filter(menu => menu && menu.MENU_NO);
                console.log('Valid Menus:', validMenus);

                setMenus(prepareMenuTree(validMenus));
                setSelectedItems([]); // 선택 상태 초기화

                setSelectedRole({
                    ROLE_NO: role.ROLE_NO,
                    ROLE_NAME: role.ROLE_NAME,
                });

                setModalOpen(true);
            } else {
                console.error("Menus API returned invalid data.");
            }
        } catch (error) {
            console.error('메뉴 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowSelectedMenus = () => {
        console.log("선택된 메뉴 번호:", selectedItems.join(","));
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
                {roles.map((role) => (
                    <Box
                        key={role.ROLE_NO}
                        onClick={() => handleRoleClick(role)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            p: 1,
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'action.selected',
                            },
                        }}
                    >
                        <SecurityIcon color="primary" sx={{ mr: 2 }} />
                        <Typography>{role.ROLE_NM}</Typography>
                    </Box>
                ))}
            </Paper>

            <CustomModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={selectedRole ? `${selectedRole.ROLE_NAME} 메뉴 구성` : '메뉴 구성'}
            >
                <Box sx={{ minHeight: '60vh', maxHeight: '70vh', overflow: 'auto' }}>
                    <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2 }}>
                        {menus.length > 0 ? (
                            <>
                                <MenuTreeView
                                    menus={menus}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleShowSelectedMenus}
                                    sx={{ mt: 2 }}
                                >
                                    선택된 메뉴 확인
                                </Button>
                            </>
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
