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
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Footer from "@/components/atomics/Footer";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import { useRouter } from "next/navigation";
import Joi from 'joi';


const Row = (props) => {
  const { row, setMessage, setSnackbar, setSeverity } = props;
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = React.useState(false);
  const [formState, setFormState] = useState({
    property: '',
    number: '',
    complex: ''
  });
  const [errors, setErrors] = useState({});
  const { changeStatusCustomer } = useZustandStore().sales;

  const chatToWhatsapp = () => {
    let firstChar = row?.phone.slice(1);

    if (firstChar === "+") {
      firstChar = row?.phone.slice(3);
    }

    window.open(`https://wa.me/${firstChar}`, '_blank')
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const onProcess = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        id: row?.id,
        data: {
          ...formState,
          status: 3,
        }
      };

      await changeStatusCustomer(payload);
      setMessage("Customer status updated successfully");
      setSeverity("success");
      setSnackbar(true);
      handleConfirmClose();
    } catch (error) {
      console.log("Failed to update customer status: ", error)
    }
  };

  const handleConfirmCancelOpen = () => {
    setConfirmCancelOpen(true);
  };

  const handleConfirmCancelClose = () => {
    setConfirmCancelOpen(false);
  };

  const onCancel = async () => {
    handleConfirmCancelClose();
    const payload = {
      id: row?.id,
      data: {
        status: 4,
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

  const schema = Joi.object({
    property: Joi.string().required().messages({
      "string.base": "Property should be a type of text",
      "string.empty": "Property is required",
    }),
    number: Joi.string().required().messages({
      "string.base": "number should be a type of text",
      "string.empty": "number is required",
    }),
    complex: Joi.string().required().messages({
      "string.base": "Complex should be a type of text",
      "string.empty": "Complex is required",
    }),
  });

  const validateForm = () => {
    const { error: errorState } = schema.validate(formState, { abortEarly: false });

    if (errorState) {
      const validationErrors = {};
      errorState.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
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
              <Box component='div' sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 1.5 }}>
                <Button variant='contained' color='inherit' onClick={chatToWhatsapp}>Whatsapp</Button>
                <Button variant='contained' color='success' onClick={handleConfirmOpen}>Proses</Button>
                <Button variant='contained' color='error' onClick={handleConfirmCancelOpen}>Gagal</Button>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog open={confirmOpen} onClose={handleConfirmClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Client Won!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="property"
            name="property"
            label="Property"
            type="text"
            fullWidth
            value={formState.property}
            onChange={handleChange}
            error={Boolean(errors.property)}
            helperText={errors.property}
          />
          <TextField
            margin="dense"
            id="number"
            name="number"
            label="Number"
            type="text"
            fullWidth
            value={formState.number}
            onChange={handleChange}
            error={Boolean(errors.number)}
            helperText={errors.number}
          />
          <TextField
            margin="dense"
            id="complex"
            name="complex"
            label="Complex"
            type="text"
            fullWidth
            value={formState.complex}
            onChange={handleChange}
            error={Boolean(errors.complex)}
            helperText={errors.complex}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onProcess} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmCancelOpen}
        onClose={handleConfirmCancelClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Konfirmasi"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Anda yakin untuk memasukan client {row?.name} ke gagal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmCancelClose} color="primary">
            Tidak
          </Button>
          <Button onClick={onCancel} color="primary" autoFocus>
            Ya
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Evaluation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useZustandStore().auth;
  const { getCustomers, items } = useZustandStore().sales;
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [searchKeyword, setSearchKeyword] = useState(''); // State for search keyword

  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const handleSearch = () => {
    getCustomers({ search: searchKeyword, status: 2 }); // Fetch customers with the current search keyword
  };

  useEffect(() => {
    if (isAuthenticated) {
      getCustomers({ search: '', status: 2 });
    }
  }, [isAuthenticated, getCustomers]);

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
          EVALUATION DISCUSSION
        </Typography>
        <Grid container sx={{ p: 2, mb: 3 }}>
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
                    <TableCell>CUSTOMER - PRICING & LEGAL DISCUSSION</TableCell>
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
    </Container>
  );
}
