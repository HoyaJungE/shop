import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchLatestGoods = async () => {
    const response = await axios.get(`${API_URL}/goods/latest`);
    return response.data;
};

export const fetchGoods = async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_URL}/goods`, {
        params: {
            page,
            limit,
        },
    });
    return response.data;
};

export const fetchGoodById = async (id) => {
    const response = await axios.get(`${API_URL}/goods/${id}`);
    return response.data;
};

export const addGoods = async (goods) => {
    const response = await axios.post(`${API_URL}/goods`, goods);
    return response.data;
};

export const updateGoods = async (goods) => {
    const response = await axios.put(`${API_URL}/goods/${goods.GOODS_NO}`, goods);
    return response.data;
};

export const fetchMenus = async () => {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data;
};

export const fetchMenuById = async (id) => {
    const response = await axios.get(`${API_URL}/menu/${id}`);
    return response.data;
};

export const addMenu = async (menu) => {
    const response = await axios.post(`${API_URL}/menu`, menu);
    return response.data;
};

export const updateMenu = async (menu) => {
    const response = await axios.put(`${API_URL}/menu/${menu.MENU_NO}`, menu);
    return response.data;
};

export const deleteMenu = async (id) => {
    const response = await axios.delete(`${API_URL}/menu/${id}`);
    return response.data;
};

export const buildMenuTree = (menus) => {
    const map = new Map();
    const roots = [];

    menus.forEach(menu => {
        map.set(menu.MENU_NO, { ...menu, children: [] });
    });

    menus.forEach(menu => {
        if (menu.UPPR_MENU_NO) {
            map.get(menu.UPPR_MENU_NO).children.push(map.get(menu.MENU_NO));
        } else {
            roots.push(map.get(menu.MENU_NO));
        }
    });

    return roots;
};
