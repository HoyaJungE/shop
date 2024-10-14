import React, { useContext, useState } from 'react';
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
                                <Typography variant="body2" color="text.secondary" style={{ whiteSpace: 'pre-line'}}>
                                    {good.GOODS_CONTENT}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Files: <FileCount goodsNo={good.GOODS_NO} />
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

const FileCount = ({ goodsNo }) => {
    const { data, error, isLoading } = useQuery(['fileCount', goodsNo], () => fetchFileCount(goodsNo));

    if (isLoading) return <CircularProgress size={20} />;
    if (error) return <Typography>Error fetching file count</Typography>;

    return <span>{data.count}</span>;
};

export default GoodsList;
