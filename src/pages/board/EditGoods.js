import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import {StyledTextField} from "../../components/styles";

function EditGoods() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [goods, setGoods] = useState({
        GOODS_CATEGORY: '',
        GOODS_NAME: '',
        GOODS_CONTENT: '',
        GOODS_ORIGIN_PRICE: '',
        GOODS_SELL_PRICE: '',
        GOODS_SALE_PRICE: '',
        GOODS_DATE: '',
        GOODS_KEYWORD: '',
        GOODS_THUMBNAIL: '',
    });
    const [goodsFiles, setGoodsFiles] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/api/goods/${id}`)
            .then(response => {
                const data = response.data;
                setGoods({
                    GOODS_CATEGORY: data.GOODS_CATEGORY || '',
                    GOODS_NAME: data.GOODS_NAME || '',
                    GOODS_CONTENT: data.GOODS_CONTENT || '',
                    GOODS_ORIGIN_PRICE: data.GOODS_ORIGIN_PRICE || '',
                    GOODS_SELL_PRICE: data.GOODS_SELL_PRICE || '',
                    GOODS_SALE_PRICE: data.GOODS_SALE_PRICE || '',
                    GOODS_DATE: data.GOODS_DATE ? data.GOODS_DATE.split('T')[0] : '',
                    GOODS_KEYWORD: data.GOODS_KEYWORD || '',
                    GOODS_THUMBNAIL: data.GOODS_THUMBNAIL || '',
                });
            })
            .catch(error => setError(error.message));
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGoods(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        setGoodsFiles(Array.from(event.target.files));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        Object.keys(goods).forEach(key => {
            formData.append(key, goods[key]);
        });
        goodsFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            await axios.put(`http://localhost:5000/api/goods/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate(`/goods/${id}`);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Edit Goods
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        name="GOODS_CATEGORY"
                        value={goods.GOODS_CATEGORY}
                        onChange={handleChange}
                    >
                        <MenuItem value="A">A</MenuItem>
                        <MenuItem value="B">B</MenuItem>
                        <MenuItem value="C">C</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="제목"
                    name="GOODS_NAME"
                    value={goods.GOODS_NAME}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <StyledTextField
                    label="내용"
                    name="GOODS_CONTENT"
                    value={goods.GOODS_CONTENT}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                {/*<TextField
                    label="원가"
                    name="GOODS_ORIGIN_PRICE"
                    value={goods.GOODS_ORIGIN_PRICE}
                    onChange={handleChange}
                    margin="normal"
                    type="number"
                />
                <TextField
                    label="판매가"
                    name="GOODS_SELL_PRICE"
                    value={goods.GOODS_SELL_PRICE}
                    onChange={handleChange}
                    margin="normal"
                    type="number"
                />
                <TextField
                    label="할인가"
                    name="GOODS_SALE_PRICE"
                    value={goods.GOODS_SALE_PRICE}
                    onChange={handleChange}
                    margin="normal"
                    type="number"
                />*/}
                <TextField
                    label="날짜"
                    name="GOODS_DATE"
                    value={goods.GOODS_DATE}
                    onChange={handleChange}
                    margin="normal"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="키워드"
                    name="GOODS_KEYWORD"
                    value={goods.GOODS_KEYWORD}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="썸네일"
                    name="GOODS_THUMBNAIL"
                    value={goods.GOODS_THUMBNAIL}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="첨부파일"
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ multiple: true }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Save Changes
                </Button>
            </form>
        </Container>
    );
}

export default EditGoods;
