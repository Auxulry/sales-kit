"use client";

import React, { useState, useEffect, useLayoutEffect } from 'react';
import MainLayout from "@/components/atomics/internal/MainLayout";
import { Box, Snackbar, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid } from '@mui/material';
import { useZustandStore } from "@/provider/ZustandContextProvider";
import TeamForm from "@/components/molecules/internal/team/TeamForm";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

function EnhancedTableHead(props) {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Total Closing</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function Dashboard() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');

  const { getTeams, getSummary, summary, items, totalItems, error, errorMessage } = useZustandStore().summary;

  useEffect(() => {
    getTeams({ page, itemPerPage: rowsPerPage });
  }, [page, rowsPerPage]);

  useEffect(() => {
    getSummary()
  }, []);

  const { isAuthenticated } = useZustandStore().admin;
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/internal/auth/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      setMessage(errorMessage);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  }, [error, errorMessage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <MainLayout>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
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
            <Typography variant='h4'>{summary?.totalTeam}</Typography>
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
            <Typography variant='h4'>{summary?.totalDomain}</Typography>
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
            <Typography variant='h4'>{summary?.totalAds}</Typography>
            <Typography variant='h5'>Total Ads</Typography>
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
            <Typography variant='h4'>{summary?.totalCustomer}</Typography>
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
            <Typography variant='h4'>{summary?.totalApproach}</Typography>
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
            <Typography variant='h4'>{summary?.totalNegotiation}</Typography>
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
            <Typography variant='h4'>{summary?.totalWon}</Typography>
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
            <Typography variant='h4'>{summary?.totalLost}</Typography>
            <Typography variant='h5'>Total Closed Lost</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
                <EnhancedTableHead order={order} orderBy={orderBy} />
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow hover tabIndex={-1} key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.customer_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
}
