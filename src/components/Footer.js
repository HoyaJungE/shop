// src/components/Footer.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import { Footer as FooterBox } from './styles';

function Footer() {
    return (
        <FooterBox component="footer">
            <Container maxWidth="lg">
                <Typography variant="h6" gutterBottom>
                    BASE
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="p">
                    Your one-stop shop for everything!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {'© '}
                    {new Date().getFullYear()}
                    {' hanho1312 All rights reserved.'}
                </Typography>
            </Container>
        </FooterBox>
    );
}

export default Footer;
