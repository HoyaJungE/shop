import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    TextField,
    Button,
    Container,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    List, ListItem, ListItemText
} from '@mui/material';
import editorConfig from "../../components/editorConfig";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import {ClassicEditor} from "ckeditor5";
import 'ckeditor5/ckeditor5.css';
import {useQuery} from "react-query";
import {fetchFilesByGoodsNo} from "../../api";
import AuthContext from "../../context/AuthContext";

function EditGoods() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [goods, setGoods] = useState({
        GOODS_NO: '',
        GOODS_CATEGORY: '',
        GOODS_NAME: '',
        GOODS_CONTENT: '',
        GOODS_ORIGIN_PRICE: '',
        GOODS_SELL_PRICE: '',
        GOODS_SALE_PRICE: '',
        GOODS_DATE: '',
        GOODS_KEYWORD: '',
        GOODS_THUMBNAIL: '',
        WRTER_NO:'',
    });
    const [goodsFiles, setGoodsFiles] = useState([]);
    const [error, setError] = useState('');
    const { data: filesData, refetch, isLoading: filesLoading } = useQuery(['files', id], () => fetchFilesByGoodsNo(id));

    useEffect(() => {
        axios.get(`http://localhost:5000/api/goods/${id}`)
            .then(response => {
                const data = response.data;
                setGoods({
                    GOODS_NO: data.GOODS_NO || '',
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

    useEffect(() => {
        if (filesData) {
            setGoodsFiles(filesData);
        }
    }, [filesData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setGoods(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleDownload = (fileNo, fileSn) => {
        window.location.href = `http://localhost:5000/api/file/download/${fileNo}/${fileSn}`;
    };

    const handleDelete = async (fileNo, fileSn) => {
        try {
            if(window.confirm("바로 삭제됩니다. 삭제하시겠습니까?")){
                await axios.delete(`http://localhost:5000/api/file/delete/${fileNo}/${fileSn}`);
                setGoodsFiles(prevFiles => prevFiles.filter(file => file.FILE_NO !== fileNo || file.FILE_SN !== fileSn));
                refetch();
            }
        } catch (error) {
            setError(error.message);
        }
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

    const handleBackClick = () => {
        navigate(`/goods/${goods.GOODS_NO}`);
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
                    type="hidden"
                    name="WRTER_NO"
                    value={user.MEMBER_ID}
                />
                {/* 기존 첨부파일 목록 */}
                {filesData && filesData.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6" component="h4" gutterBottom>
                            기존 첨부파일
                        </Typography>
                        <List>
                            {filesData.map((file, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={file.FILE_LOGIC_NM} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDownload(file.FILE_NO, file.FILE_SN)}
                                    >
                                        다운로드
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(file.FILE_NO, file.FILE_SN)}
                                    >
                                        삭제
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
                <TextField
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ multiple: true }}
                />

                <Button type="submit" variant="contained" color="primary">
                    수정
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleBackClick}>
                    취소
                </Button>
            </form>
        </Container>
    );
}

export default EditGoods;
