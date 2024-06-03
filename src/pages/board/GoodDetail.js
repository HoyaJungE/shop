// src/pages/board/GoodDetail.js
import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Container, Typography, CircularProgress, Box, Card, CardContent, CardMedia, Button } from '@mui/material';
import { fetchGoodById } from '../../api';
import AuthContext from '../../context/AuthContext';

function GoodDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, error, isLoading } = useQuery(['good', id], () => fetchGoodById(id));
    const { user } = useContext(AuthContext);

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography>Error fetching good details</Typography>;

    const handleEditClick = () => {
        navigate(`/edit-goods/${id}`);
    };

    const handleBackClick = () => {
        navigate('/goods');
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Card>
                    <CardMedia
                        component="img"
                        alt={data.GOODS_NAME}
                        height="400"
                        image={data.GOODS_THUMBNAIL}
                        title={data.GOODS_NAME}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h2" gutterBottom>
                            {data.GOODS_NAME}
                        </Typography>
                        <Typography variant="h6" component="h4" gutterBottom>
                            {data.GOODS_CATEGORY}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {data.GOODS_CONTENT}
                        </Typography>
                        <Typography variant="h5" component="h3" color="textSecondary" gutterBottom>
                            Original Price: ${data.GOODS_ORIGIN_PRICE}
                        </Typography>
                        <Typography variant="h5" component="h3" color="textSecondary" gutterBottom>
                            Sell Price: ${data.GOODS_SELL_PRICE}
                        </Typography>
                        {data.GOODS_SALE_PRICE && (
                            <Typography variant="h5" component="h3" color="textSecondary" gutterBottom>
                                Sale Price: ${data.GOODS_SALE_PRICE}
                            </Typography>
                        )}
                        <Box mt={2}>
                            {user && (
                                <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                                    Edit
                                </Button>
                            )}
                            <Button variant="outlined" color="secondary" onClick={handleBackClick}>
                                Back to Goods List
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default GoodDetail;
