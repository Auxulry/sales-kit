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
              <Typography>Halo, {name}</Typography>
              <Box
                component='div'
                sx={{
                  background: 'linear-gradient(to bottom, #147C3B 0%, #66B030 100%)',
                  color: '#fff',
                  padding: '1rem',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
                onClick={handleClose}
              >
                Lihat Brosur
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GreetingDialog;
