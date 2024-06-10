// src/pages/home/Home.js
import React from 'react';
import {Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress} from '@mui/material';
import { Banner } from '../../components/styles';
import {fetchLatestGoods} from "../../api";
import {useQuery} from "react-query";
import {Link as RouterLink} from "react-router-dom";

function Home() {
    const { data, error, isLoading } = useQuery(['goods'], () => fetchLatestGoods(),{ keepPreviousData: true });

    return (
        <Container maxWidth="lg">
            {/* 배너 섹션 */}
            <Banner>
                <Typography variant="h2" component="h1">
                    WELCOME
                </Typography>
            </Banner>

            <Typography variant="h3" component="h2" gutterBottom>
                최근게시물
            </Typography>

            <Grid container spacing={4}>
                {   isLoading
                    ?
                    <CircularProgress />
                    : ( error
                        ?
                            <Typography> 게시물을 불러오지못하였습니다. </Typography>
                        :
                            data.goods.map((good) => (
                                <Grid item key={good.GOODS_NO} xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardMedia component="img" alt={good.GOODS_NAME} height="140" image={good.GOODS_THUMBNAIL} />
                                        <CardContent>
                                            <Typography variant="h5" component="div">
                                                {good.GOODS_NAME}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {good.GOODS_CONTENT}
                                            </Typography>
                                        </CardContent>
                                        <Button size="small" component={RouterLink} to={`/goods/${good.GOODS_NO}`}>
                                            Learn More
                                        </Button>
                                    </Card>
                                </Grid>
                            ))
                        )
                }

            </Grid>
        </Container>
    );
}

export default Home;
