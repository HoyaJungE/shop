import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import editorConfig from "../../components/editorConfig";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {ClassicEditor} from "ckeditor5";
import 'ckeditor5/ckeditor5.css';

function AddGoods() {
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
            await axios.post('http://localhost:5000/api/goods', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/goods');
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Add Goods
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel>분류</InputLabel>
                    <Select
                        label="분류"
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
                {/*<TextField
                    label="내용"
                    name="GOODS_CONTENT"
                    value={goods.GOODS_CONTENT}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />*/}
                <CKEditor
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={goods.GOODS_CONTENT}
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
                    Add Goods
                </Button>
            </form>
        </Container>
    );
}

export default AddGoods;
