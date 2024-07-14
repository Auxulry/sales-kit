"use client"

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import {
  Add,
  ContentCopy,
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Footer from "@/components/atomics/Footer";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import { useRouter } from "next/navigation";
import CustomerForm from "@/components/molecules/sales/CustomerForm";

const Row = (props) => {
  const { row, setMessage, setSnackbar, setSeverity, domain } = props;
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { changeStatusCustomer } = useZustandStore().sales;

  const handleSaveContact = () => {
    var contact = {
      name: row.name,
      phone: row.phone,
      email: row.email
    };
    // create a vcard file
    var vcard = "BEGIN:VCARD\nVERSION:4.0\nFN:" + contact.name + "\nTEL;TYPE=work,voice:" + contact.phone + "\nEMAIL:" + contact.email + "\nEND:VCARD";
    var blob = new Blob([vcard], { type: "text/vcard" });
    var url = URL.createObjectURL(blob);

    const newLink = document.createElement('a');
    newLink.download = contact.name + ".vcf";
    newLink.textContent = contact.name;
    newLink.href = url;

    newLink.click();
  };


  const handleCopyToClipboard = (name = '') => {
    if (domain !== null) {
      const link = name === '' ? domain : `${domain}?refname=${name}`
      navigator.clipboard.writeText(link)
        .then(() => {
          console.log("Domain copied to clipboard");
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };
  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const onFollowUp = async () => {
    handleConfirmClose(); // Close the confirmation dialog
    const payload = {
      id: row?.id,
      data: {
        status: 1
      }
    };

    try {
      await changeStatusCustomer(payload);
      setMessage("Customer status updated successfully");
      setSeverity("success");
      setSnackbar(true);
    } catch (error) {
      console.log("Failed to update customer status: ", error)
    }
  };

  return (
    <>
      <TableRow key={props.key} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {props.rowNumber}
        </TableCell>
        <TableCell>
          <Box component='div' sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{row?.name}</Typography>
            <Typography variant='caption'>{row?.phone}</Typography>
            <Typography variant='caption'>{row?.email}</Typography>
            <Typography variant='caption'>Status : {row?.status}</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box component='div' sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
                <Button variant='contained' color='inherit' onClick={handleSaveContact}>Simpan Kontak</Button>
                <Button variant='contained' color='success' onClick={handleConfirmOpen}>Tindak Lanjut</Button>
                <Button variant='contained' color='primary' onClick={() => handleCopyToClipboard(row.name)}>Buat Tautan</Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Konfirmasi"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anda yakin untuk tindak lanjut {row?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            No
          </Button>
          <Button onClick={onFollowUp} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [user, setUser] = useState({});
  const { profile, isAuthenticated } = useZustandStore().auth;
  const { getCustomers, items, addCustomer } = useZustandStore().sales;
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [searchKeyword, setSearchKeyword] = useState(''); // State for search keyword
  const [openForm, setOpenForm] = useState(false)

  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.refresh()
      router.push('/auth/login');
    } else {
      setUser(profile);
    }
  }, [profile, isAuthenticated]);

  const handleCopyToClipboard = (domain) => {
    if (domain !== null) {
      navigator.clipboard.writeText(domain)
        .then(() => {
          console.log("Domain copied to clipboard");
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearch = () => {
    getCustomers({ search: searchKeyword }); // Fetch customers with the current search keyword
  };

  useEffect(() => {
    if (isAuthenticated) {
      getCustomers({ search: '' });
    }
  }, [isAuthenticated, getCustomers]);


  const handleSave = async (formData) => {
    await addCustomer(formData);
    setMessage("Contact Successfully Created.");
    setSeverity("success");
    setOpenSnackbar(true);
    setOpenForm(false)
  }

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
          Halo, {user?.name}
        </Typography>
        <Grid container sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              Link untuk disebar
            </Typography>
            {profile?.domain !== null && (
              <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant='body1' sx={{ mr: 1 }}>
                  {user?.domain}
                </Typography>
                <IconButton onClick={() => handleCopyToClipboard(profile?.domain)} aria-label="copy to clipboard">
                  <ContentCopy />
                </IconButton>
              </Box>
            )}
            <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='body1' sx={{ mr: 1 }}>
                {user?.subdomain}
              </Typography>
              <IconButton onClick={() => handleCopyToClipboard(profile?.subdomain)} aria-label="copy to clipboard">
                <ContentCopy />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Grid container sx={{ p: 2, mb: 3 }}>
          <Grid item xs={12}>
            <Typography variant='h5' gutterBottom>
              Form Terisi
            </Typography>
          </Grid>
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
        <Grid container sx={{ p: 2 }}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>CUSTOMER</TableCell>
                    <TableCell />
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
                        setMessage={setMessage}
                        setSnackbar={setOpenSnackbar}
                        setServerity={setSeverity}
                        domain={profile?.subdomain}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        <Footer />
      </Box>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 70,
          right: 16,
          zIndex: 2
        }}
        onClick={() => setOpenForm(true)}
      >
        <Add />
      </Fab>
      <CustomerForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        handleSave={handleSave}
      />
    </Container>
  );
}
