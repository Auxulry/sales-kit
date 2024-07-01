"use client";

import React, {useLayoutEffect} from 'react';
import MainLayout from "@/components/atomics/internal/MainLayout";
import {Grid, Paper, Typography} from "@mui/material";
import {useZustandStore} from "@/provider/ZustandContextProvider";
import {useRouter} from "next/navigation";

export default function Dashboard() {
  const { isAuthenticated } = useZustandStore().auth;
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/internal/auth/login');
    }
  }, [isAuthenticated]);
  return (
    <MainLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Team</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Domain</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Adds</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Customer</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Approach</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Negotiation</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Closed Won</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Paper
            elevation={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 3
            }}
          >
            <Typography variant='h4'>0</Typography>
            <Typography variant='h5'>Total Closed Lost</Typography>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
