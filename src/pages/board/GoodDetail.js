import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Container, Typography, CircularProgress, Box, Card, CardContent, CardMedia, Button, List, ListItem, ListItemText } from '@mui/material';
import { fetchGoodById, fetchFilesByGoodsNo } from '../../api';
import AuthContext from '../../context/AuthContext';

function GoodDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: goodData, error: goodError, isLoading: goodLoading } = useQuery(['good', id], () => fetchGoodById(id));
    const { data: filesData, error: filesError, isLoading: filesLoading } = useQuery(['files', id], () => fetchFilesByGoodsNo(id));
    const { user } = useContext(AuthContext);

    if (goodLoading || filesLoading) return <CircularProgress />;
    if (goodError) return <Typography>Error fetching good details</Typography>;
    if (filesError) return <Typography>Error fetching files</Typography>;

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
                        alt={goodData.GOODS_NAME}
                        height="400"
                        image={goodData.GOODS_THUMBNAIL}
                        title={goodData.GOODS_NAME}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h2" gutterBottom>
                            {goodData.GOODS_NAME}
                        </Typography>
                        <Typography variant="h6" component="h4" gutterBottom>
                            {goodData.GOODS_CATEGORY}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {goodData.GOODS_CONTENT}
                        </Typography>
                        <Typography variant="h5" component="h3" color="textSecondary" gutterBottom>
                            Original Price: ${goodData.GOODS_ORIGIN_PRICE}
                        </Typography>
                        <Typography variant="h5" component="h3" color="textSecondary" gutterBottom>
                            Sell Price: ${goodData.GOODS_SELL_PRICE}
                        </Typography>
                        {goodData.GOODS_SALE_PRICE && (
                            <Typography variant="h5" component="h3" color="textSecondary" gutterBottom>
                                Sale Price: ${goodData.GOODS_SALE_PRICE}
                            </Typography>
                        )}
                        {filesData.length > 0 && (
                            <Box mt={4}>
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Attached Files:
                                </Typography>
                                <List>
                                    {filesData.map((file) => (
                                        <ListItem key={file.FILE_NO}>
                                            <ListItemText
                                                primary={file.FILE_NAME}
                                                secondary={
                                                    <Button href={`/uploads/${file.FILE_NAME}`} target="_blank" rel="noopener noreferrer">
                                                        Download
                                                    </Button>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
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
