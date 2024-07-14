"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid, Box, Typography,
} from '@mui/material';

const GreetingDialog = ({ open, handleClose, name }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Selamat Datang, {name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mb: 3, p: 2 }}>
          <Grid item xs={12}>
            <Box
              component='div'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3
              }}
            >
              <Typography variant='title'>Halo, {name}</Typography>
              <Button color='info' variant='contained' onClick={handleClose}>Masuk Website</Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GreetingDialog;
