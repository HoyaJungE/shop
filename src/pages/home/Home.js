// src/pages/home/Home.js
import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Banner } from '../../components/styles';

function Home() {
    const products = [
        { id: 1, name: 'Product 1', image: 'https://via.placeholder.com/150', description: 'This is product 1.' },
        { id: 2, name: 'Product 2', image: 'https://via.placeholder.com/150', description: 'This is product 2.' },
        { id: 3, name: 'Product 3', image: 'https://via.placeholder.com/150', description: 'This is product 3.' },
    ];

    return (
        <Container maxWidth="lg">
            {/* 배너 섹션 */}
            <Banner>
                <Typography variant="h2" component="h1">
                    Welcome to Our Shopping Mall
                </Typography>
            </Banner>

            <Typography variant="h3" component="h2" gutterBottom>
                Latest Trends
            </Typography>

            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia component="img" alt={product.name} height="140" image={product.image} />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                            </CardContent>
                            <Button size="small">Learn More</Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
