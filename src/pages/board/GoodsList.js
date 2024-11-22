import React, { useContext, useState } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box, Pagination } from '@mui/material';
import { useQuery } from 'react-query';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import { fetchGoods, fetchFileCount } from '../../api';
import AuthContext from '../../context/AuthContext';

const fetchGoodsWithPagination = async (page, limit) => {
    const response = await fetchGoods(page, limit);
    return response;
};

function GoodsList() {
    const { user } = useContext(AuthContext);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const navigate = useNavigate();

    const { data, error, isLoading } = useQuery(['goods', page, limit], () => fetchGoodsWithPagination(page, limit), { keepPreviousData: true });

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography>Error fetching goods</Typography>;
    }

    const { goods, total } = data;
    const pageCount = Math.ceil(total / limit);

    return (
        <Container maxWidth="lg">
            <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                    color: '#4a4a4a', // 회색 톤 텍스트 색상
                    fontWeight: 600, // 굵은 폰트
                    fontSize: '2rem', // 적당히 큰 글자 크기
                    letterSpacing: '0.1em', // 글자 간격 조정으로 세련된 느낌
                    fontFamily: 'Roboto, sans-serif', // 세련된 폰트
                    marginBottom: '16px', // 아래 여백 추가
                    marginTop: '20px'
                }}
            >
                📋 게시판
            </Typography>
            {user && (
                <Box mb={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/add-goods"
                    >
                        게시글작성
                    </Button>
                </Box>
            )}
            <Grid container spacing={4}>
                {goods.map((good) => (
                    <Grid item key={good.GOODS_NO} xs={12} sm={6} md={4}>
                        <Card sx={{height:400, padding: 2, cursor: 'pointer'}} onClick={() => navigate(`/goods/${good.GOODS_NO}`)}>
                            <CardMedia component="img" alt={good.GOODS_NAME} sx={{width:280, height:280, objectFit:'cover', margin:'0 auto'}} image={good.GOODS_THUMBNAIL ? good.GOODS_THUMBNAIL :"/images/no-image.png"} />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {good.GOODS_NAME}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    작성자: {good.WRTER_NM}  첨부파일: <FileCount goodsNo={good.GOODS_NO} /> 개
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                />
            </Box>
        </Container>
    );
}

const FileCount = ({ goodsNo }) => {
    const { data, error, isLoading } = useQuery(['fileCount', goodsNo], () => fetchFileCount(goodsNo));

    if (isLoading) return <CircularProgress size={20} />;
    if (error) return <Typography>Error fetching file count</Typography>;

    return <span>{data.count}</span>;
};

export default GoodsList;
