// src/components/styles.js
import { styled } from '@mui/system';
import { Box } from '@mui/material';

export const Banner = styled(Box)(({ theme }) => ({
    height: '300px',
    backgroundImage: 'url("https://via.placeholder.com/1200x300")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    marginBottom: theme.spacing(4),
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
}));

export const Footer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(3, 2),
    backgroundColor: theme.palette.grey[200],
    textAlign: 'center',
    width: '100%',
    position: 'relative',
    left: 0,
    right: 0,
}));
