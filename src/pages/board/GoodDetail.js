import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Container, Typography, CircularProgress, Box, Card, CardContent, CardMedia, Button, List, ListItem, ListItemText } from '@mui/material';
import { fetchGoodById, fetchFilesByGoodsNo } from '../../api';
import AuthContext from '../../context/AuthContext';
import 'ckeditor5/ckeditor5.css';

function GoodDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, error, isLoading } = useQuery(['good', id], () => fetchGoodById(id));
    const { data: filesData, error: filesError, isLoading: filesLoading } = useQuery(['files', id], () => fetchFilesByGoodsNo(id));
    const { user } = useContext(AuthContext);

    if (isLoading || filesLoading) return <CircularProgress />;
    if (error) return <Typography>Error fetching good details</Typography>;
    if (filesError) return <Typography>Error fetching files</Typography>;

    const handleEditClick = () => {
        navigate(`/edit-goods/${id}`);
    };

    const handleBackClick = () => {
        navigate('/goods');
    };

    const handleDownload = (fileNo, fileSn) => {
        window.location.href = `http://localhost:5000/api/file/download/${fileNo}/${fileSn}`;
    };

    return (
        <Container maxWidth="md">
            <Box mt={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h7" component="h6" cx={{ color: 'rgb(105,105,105)' }} gutterBottom>
                            {data.GOODS_CATEGORY}
                        </Typography>
                        <Typography variant="h4" component="h2" gutterBottom>
                            {data.GOODS_NAME}
                        </Typography>
                        <Typography variant="body1" gutterBottom cx={{ whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{ __html: data.GOODS_CONTENT }}></Typography>

                        {filesData && filesData.length > 0 && (
                            <Box mt={4}>
                                <Typography variant="h6" component="h4" gutterBottom>
                                    Attached Files
                                </Typography>
                                <List>
                                    {filesData.map(file => (
                                        <ListItem key={file.FILE_NO + '-' + file.FILE_SN}>
                                            <ListItemText primary={file.FILE_LOGIC_NM} />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleDownload(file.FILE_NO, file.FILE_SN)}
                                            >
                                                Download
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        <Box mt={2}>
                            {user && (
                                <Button variant="contained" color="primary" onClick={handleEditClick} style={{ marginRight: '10px' }}>
                                    수정
                                </Button>
                            )}
                            <Button variant="outlined" color="secondary" onClick={handleBackClick}>
                                목록
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}

export default GoodDetail;
