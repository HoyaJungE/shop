// src/pages/Role/ManageMemberRole.js
import React, { useState, useEffect } from 'react';
import {Container, TextField, Button} from '@mui/material';
import CustomModal from "../../components/CustomModal";
import {  } from '@mui/material/styles';

const ManageMemberRole = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <Container>
            <Button variant="contained" color="primary" onClick={openModal}>
                Load Member Data
            </Button>
            <CustomModal
                title='Manage Member Role'
                open={modalOpen}
                onClose={closeModal}
            >
                <TextField label="Member Role" variant="outlined" fullWidth />
                <Button
                    onClick={closeModal}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 16 }}
                >
                    Save
                </Button>
            </CustomModal>
        </Container>
    );
};

export default ManageMemberRole;
