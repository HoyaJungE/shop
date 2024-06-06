// src/pages/login/SignUp.js
import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api'; // 서버 API URL

async function signUpUser(user) {
    const response = await axios.post(`${API_URL}/auth/signup`, user);
    return response.data;
}

function SignUp() {
    const [user, setUser] = useState({
        MEMBER_ID: '',
        MEMBER_PASSWD: '',
        MEMBER_NAME: '',
        MEMBER_BIRTH: '',
        MEMBER_EMAIL: '',
        MEMBER_PHONE: '',
        MEMBER_ZIPCODE: '',
        MEMBER_ADDR1: '',
        MEMBER_ADDR2: '',
        MEMBER_GRADE: 'basic', // default grade
        SMS_AGREE: 'N',
        EMAIL_AGREE: 'N'
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const mutation = useMutation(signUpUser, {
        onSuccess: (data) => {
            setMessage('Sign up successful! Redirecting to home...');
            login(data.user, data.token);
            setTimeout(() => {
                navigate('/');
            }, 2000); // Redirect after 2 seconds
        },
        onError: (error) => {
            setMessage('Sign up failed: ' + error.message);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(user);
    };

    return (
        <Container maxWidth="sm">
            <Box mt={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign Up
                </Typography>
                {message && <Alert severity="info">{message}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField name="MEMBER_ID" label="ID" value={user.MEMBER_ID} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_PASSWD" label="Password" type="password" value={user.MEMBER_PASSWD} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_NAME" label="Name" value={user.MEMBER_NAME} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_BIRTH" label="Birth Date" type="date" value={user.MEMBER_BIRTH} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_EMAIL" label="Email" type="email" value={user.MEMBER_EMAIL} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_PHONE" label="Phone" value={user.MEMBER_PHONE} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_ZIPCODE" label="Zip Code" value={user.MEMBER_ZIPCODE} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_ADDR1" label="Address 1" value={user.MEMBER_ADDR1} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="MEMBER_ADDR2" label="Address 2" value={user.MEMBER_ADDR2} onChange={handleChange} fullWidth margin="normal" required />
                    <TextField name="SMS_AGREE" label="SMS Agree" value={user.SMS_AGREE} onChange={handleChange} fullWidth margin="normal" />
                    <TextField name="EMAIL_AGREE" label="Email Agree" value={user.EMAIL_AGREE} onChange={handleChange} fullWidth margin="normal" />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default SignUp;
