// src/components/CustomModal.js
import React, {useEffect, useState} from 'react';
import {StyledDialog, StyledDialogTitle} from "./styles";
import {DialogContent, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({ open = false, onClose, title, children, maxWidth = false }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () =>{
        setModalVisible(false);
        onClose();
    }

    useEffect(() =>{
        setModalVisible(open);
    }, [open])

    return (
        <StyledDialog 
            open={modalVisible} 
            onClose={closeModal}
            maxWidth={maxWidth}
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    width: '80vw',
                    maxWidth: '1200px',
                }
            }}
        >
            <StyledDialogTitle>
                {title}
                <IconButton onClick={closeModal}>
                    <CloseIcon />
                </IconButton>
            </StyledDialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </StyledDialog>
    );
};

export default CustomModal;
