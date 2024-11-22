// src/pages/login/Login.js
import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api'; // 서버 API URL

async function loginUser(credentials) {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
}

function Login() {
    const [credentials, setCredentials] = useState({
        MEMBER_ID: '',
        MEMBER_PASSWD: '',
    });
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const mutation = useMutation(loginUser, {
        onSuccess: (data) => {
            setMessage('로그인성공! 페이지이동중입니다..');
            login(data.user, data.token);
            setTimeout(() => {
                navigate('/');
            }, 2000); // Redirect after 2 seconds
        },
        onError: (error) => {
            setMessage('로그인실패: ' + error.message);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(credentials);
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                {message && <Alert severity="info">{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="MEMBER_ID" label="ID" value={credentials.MEMBER_ID} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_PASSWD" label="Password" type="password" value={credentials.MEMBER_PASSWD} onChange={handleChange} fullWidth margin="normal" required />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
