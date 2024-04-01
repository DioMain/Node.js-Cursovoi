import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function RegisterDialog({ open }) {


    return (
        <Dialog
        open={open}>
            <DialogTitle>Set backup account</DialogTitle>
        </Dialog>
    )
}

export default RegisterDialog;