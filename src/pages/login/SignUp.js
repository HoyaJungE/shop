// src/pages/login/SignUp.js
import React, { useState, useContext } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Grid,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

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
        MEMBER_GRADE: 'basic',
        SMS_AGREE: 'N',
        EMAIL_AGREE: 'N',
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
            }, 2000);
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

    const handleAgreeChange = (e) => {
        const { name, checked } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: checked ? 'Y' : 'N',
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(user);
    };

    return (
        <Container maxWidth="sm" style={{ backgroundColor: '#f7f7f7', borderRadius: 8, padding: 20 }}>
            <Box textAlign="center" mb={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    회원가입
                </Typography>
                {message && <Alert severity="info">{message}</Alert>}
            </Box>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_ID"
                            label="아이디"
                            value={user.MEMBER_ID}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_PASSWD"
                            label="비밀번호"
                            type="password"
                            value={user.MEMBER_PASSWD}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_NAME"
                            label="이름"
                            value={user.MEMBER_NAME}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_BIRTH"
                            label="생년월일"
                            type="date"
                            value={user.MEMBER_BIRTH}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_EMAIL"
                            label="이메일"
                            type="email"
                            value={user.MEMBER_EMAIL}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_PHONE"
                            label="휴대폰 번호"
                            value={user.MEMBER_PHONE}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_ZIPCODE"
                            label="우편번호"
                            value={user.MEMBER_ZIPCODE}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_ADDR1"
                            label="주소"
                            value={user.MEMBER_ADDR1}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="MEMBER_ADDR2"
                            label="상세주소"
                            value={user.MEMBER_ADDR2}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="SMS_AGREE"
                                    checked={user.SMS_AGREE === 'Y'}
                                    onChange={handleAgreeChange}
                                />
                            }
                            label="SMS 수신 동의"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="EMAIL_AGREE"
                                    checked={user.EMAIL_AGREE === 'Y'}
                                    onChange={handleAgreeChange}
                                />
                            }
                            label="이메일 수신 동의"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            회원가입
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default SignUp;
