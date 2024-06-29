"use client";

import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "@/components/atomics/Footer";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import { useRouter } from "next/navigation";

const Row = (props) => {
  const { row, rowNumber } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {rowNumber}
        </TableCell>
        <TableCell>
          <Box component='div' sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{row?.name}</Typography>
            <Typography variant='caption'>{row?.phone}</Typography>
            <Typography variant='caption'>{row?.email}</Typography>
            <Typography variant='caption'>Status : {row?.status}</Typography>
            {row?.statusNumber === 3 && (
              <Typography variant='caption'>Property: {row?.property} {row?.number} | {row?.complex}</Typography>
            )}
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function WonLost() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useZustandStore().auth;
  const { getCustomers, items } = useZustandStore().sales;
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [value, setValue] = useState(0);

  const router = useRouter();

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers();
    }
  }, [isAuthenticated, value]);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearch = () => {
    fetchCustomers();
  };

  const fetchCustomers = () => {
    const status = value === 0 ? 3 : 4;
    getCustomers({ search: searchKeyword, status });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchKeyword('');
  };

  return (
    <Container
      maxWidth={isMobile ? false : 'lg'}
      disableGutters
      sx={{ position: 'relative', height: '100vh' }}
    >
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
      <Box
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5
        }}
      >
        <Typography variant='h5' gutterBottom sx={{ p: 2 }}>
          WON & LOST
        </Typography>
        <Grid container sx={{ p: 2, mb: 3 }}>
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='fullWidth' centered>
                  <Tab label="Closed Won" {...a11yProps(0)} />
                  <Tab label="Closed Lost" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Grid container sx={{ mb: 3, mt: 3 }}>
                  <Grid item xs={12}>
                    <Box component='div' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <TextField
                        placeholder="Ketik untuk mencari..."
                        variant="standard"
                        fullWidth
                        value={searchKeyword}
                        onChange={handleSearchChange}
                      />
                      <Button variant='contained' color='primary' onClick={handleSearch}>
                        Cari
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table aria-label="collapsible table">
                        <TableHead>
                          <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>CUSTOMER</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                <Typography variant="subtitle1">Data tidak ditemukan</Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            items.map((row, index) => (
                              <Row
                                key={row?.id}
                                rowNumber={index + 1}
                                row={row}
                              />
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Grid container sx={{ mt: 3, mb: 3 }}>
                  <Grid item xs={12}>
                    <Box component='div' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                      <TextField
                        placeholder="Ketik untuk mencari..."
                        variant="standard"
                        fullWidth
                        value={searchKeyword}
                        onChange={handleSearchChange}
                      />
                      <Button variant='contained' color='primary' onClick={handleSearch}>
                        Cari
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <TableContainer component={Paper}>
                      <Table aria-label="collapsible table">
                        <TableHead>
                          <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>CUSTOMER</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {items.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                <Typography variant="subtitle1">Data tidak ditemukan</Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            items.map((row, index) => (
                              <Row
                                key={row?.id}
                                rowNumber={index + 1}
                                row={row}
                              />
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CustomTabPanel>
            </Box>
          </Grid>
        </Grid>
        <Footer />
      </Box>
    </Container>
  );
}
