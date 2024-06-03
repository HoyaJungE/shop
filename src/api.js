// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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
