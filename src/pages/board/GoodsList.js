import React, { useContext, useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box, Pagination } from '@mui/material';
import { useQuery } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
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
    const [fileCounts, setFileCounts] = useState({});

    const { data, error, isLoading } = useQuery(['goods', page, limit], () => fetchGoodsWithPagination(page, limit), { keepPreviousData: true });

    useEffect(() => {
        if (data && data.goods) {
            data.goods.forEach(async (good) => {
                if (good.FILE_NO) {
                    const countData = await fetchFileCount(good.FILE_NO);
                    setFileCounts(prev => ({ ...prev, [good.FILE_NO]: countData.count }));
                }
            });
        }
    }, [data]);

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
            <Typography variant="h3" component="h2" gutterBottom>
                Goods
            </Typography>
            {user && (
                <Box mb={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        component={RouterLink}
                        to="/add-goods"
                    >
                        Add Goods
                    </Button>
                </Box>
            )}
            <Grid container spacing={4}>
                {goods.map((good) => (
                    <Grid item key={good.GOODS_NO} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia component="img" alt={good.GOODS_NAME} height="270" image={good.GOODS_THUMBNAIL ? good.GOODS_THUMBNAIL :"/images/no-image.png"} />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {good.GOODS_NAME}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {good.GOODS_CONTENT}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Attached Files: {fileCounts[good.FILE_NO] || 0}
                                </Typography>
                            </CardContent>
                            <Button size="small" component={RouterLink} to={`/goods/${good.GOODS_NO}`}>
                                Learn More
                            </Button>
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

export default GoodsList;
