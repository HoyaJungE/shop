// src/components/CustomModal.js
import React from 'react';
import {StyledDialog, StyledDialogTitle} from "./styles";
import {DialogContent, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({ open, onClose, title, children }) => {
    return (
        <StyledDialog open={open} onClose={onClose}>
            <StyledDialogTitle>
                {title}
                <IconButton onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            </StyledDialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </StyledDialog>
    );
};

export default CustomModal;
