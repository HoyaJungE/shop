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
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                    <CardContent sx={{ padding: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                {data.GOODS_CATEGORY}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                작성자: {data.WRTER_NM}
                            </Typography>
                        </Box>

                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                            {data.GOODS_NAME}
                        </Typography>

                        <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 1, mb: 4 }}>
                            <Typography 
                                variant="body1" 
                                sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}
                                dangerouslySetInnerHTML={{ __html: data.GOODS_CONTENT }}
                            />
                        </Box>

                        {filesData && filesData.length > 0 && (
                            <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 1, mb: 4 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    첨부파일
                                </Typography>
                                <List>
                                    {filesData.map(file => (
                                        <ListItem 
                                            key={file.FILE_NO + '-' + file.FILE_SN}
                                            sx={{ 
                                                bgcolor: 'white', 
                                                mb: 1, 
                                                borderRadius: 1,
                                                '&:last-child': { mb: 0 }
                                            }}
                                        >
                                            <ListItemText 
                                                primary={file.FILE_LOGIC_NM}
                                                sx={{ color: 'text.primary' }}
                                            />
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleDownload(file.FILE_NO, file.FILE_SN)}
                                                sx={{ minWidth: '100px' }}
                                            >
                                                다운로드
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            {user && (
                                <Button 
                                    variant="contained" 
                                    onClick={handleEditClick}
                                    sx={{ minWidth: '100px' }}
                                >
                                    수정
                                </Button>
                            )}
                            <Button 
                                variant="outlined"
                                onClick={handleBackClick}
                                sx={{ minWidth: '100px' }}
                            >
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
