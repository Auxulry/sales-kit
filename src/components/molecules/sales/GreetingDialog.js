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
import Image from "next/image";

const GreetingDialog = ({ open, handleClose, name }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <div
          style={{
            width: '100%',
            position: 'relative',
            cursor: 'pointer',
            display: 'flex', // Ensures the div takes up the full space
            justifyContent: 'center', // Centers the content
            alignItems: 'center' // Centers the content
          }}
        >
          <div
            style={{
              width: '256px',
              height: '75px',
              position: 'relative',
              cursor: 'pointer',
              display: 'flex', // Ensures the div takes up the full space
              justifyContent: 'center', // Centers the content
              alignItems: 'center' // Centers the content
            }}
          >
            <Image
              src='/images/logo_pesona.webp'
              alt='Pesona Kahuripan'
              fill
              priority
              style={{
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{mb: 3, p: 2}}>
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
