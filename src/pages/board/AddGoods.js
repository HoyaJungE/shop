import React, {useState, useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import editorConfig from "../../components/editorConfig";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {ClassicEditor} from "ckeditor5";
import 'ckeditor5/ckeditor5.css';
import AuthContext from "../../context/AuthContext";


function AddGoods() {
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (user && user.MEMBER_NO) {
            setGoods(prevState => ({
                ...prevState,
                WRTER_NO: user.MEMBER_NO,
            }));
        }
    }, [user]);
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
        WRTER_NO: '',
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

    const handleBackClick = () => {
        navigate('/goods');
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
                <CKEditor
                    label="내용"
                    editor={ClassicEditor}
                    config={editorConfig}
                    data={goods.GOODS_CONTENT}
                    onChange={(event, editor) => {
                        setGoods(prevState => ({
                            ...prevState,
                            GOODS_CONTENT: editor.getData(),
                        }));
                    }}
                />
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
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ multiple: true }}
                    sx={{

                    }}
                />
                <Button type="submit" variant="contained" color="primary">
                    작성
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleBackClick}>
                    취소
                </Button>
            </form>
        </Container>
    );
}

export default AddGoods;
