"use client";

import React, {useState, useEffect, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert, FormControl, Select, InputLabel, MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MainLayout from "@/components/atomics/internal/MainLayout";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import CustomerForm from "@/components/molecules/internal/customer/CustomerForm";
import {useRouter} from "next/navigation";

function EnhancedTableHead(props) {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Whatsapp</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Sales</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openPopup, setOpenPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [search, setSearch] = useState('')
  const { getContacts, createContact, updateContact, deleteContact, items, totalItems, error, errorMessage } = useZustandStore().contact;
  const { isAuthenticated } = useZustandStore().admin;

  const [status, setStatus] = React.useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };


  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/internal/auth/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getContacts({ page, itemPerPage: rowsPerPage, status, search });
  }, [page, rowsPerPage, status, search]);


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

  const handleOpenPopup = (data = null) => {
    setEditData(data);
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setEditData(null);
  };

  const handleSave = async (formData) => {
    if (editData === null) {
      await createContact(formData);
      setMessage("Contact Successfully Created.");
      setSeverity("success");
      setOpenSnackbar(true);
    } else {
      const payload = {
        _method: 'put',
        ...formData
      }

      await updateContact({ id: editData?.id, data: payload })
      setMessage("Contact Successfully Updated");
      setSeverity("success");
      setOpenSnackbar(true);
    }
    await getContacts({ page, itemPerPage: rowsPerPage });
    handleClosePopup();
  };

  const handleDelete = async () => {
    if (deleteItemId) {
      await deleteContact(deleteItemId);
      setMessage("Contact Member Deleted Successfully");
      setSeverity("success");
      setOpenSnackbar(true);
      setConfirmDeleteOpen(false);
      setDeleteItemId(null);
      await getContacts({ page, itemPerPage: rowsPerPage });
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteItemId(id);
    setConfirmDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setConfirmDeleteOpen(false);
    setDeleteItemId(null);
  };

  return (
    <MainLayout currentPage='Customer'>
      <Box sx={{ width: '100%' }}>
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
        <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
          <Toolbar>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
              <Box component='div' sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 3 }}>
                <TextField label="Search" variant="standard" margin={'dense'} sx={{ width: '50%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={0}>Qualification</MenuItem>
                    <MenuItem value={1}>Proposal</MenuItem>
                    <MenuItem value={2}>Evaluasi - Harga & Pricing</MenuItem>
                    <MenuItem value={3}>Closed Won</MenuItem>
                    <MenuItem value={4}>Closed Lost</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button variant="contained" color="primary" size="small" onClick={() => handleOpenPopup()}>Add</Button>
            </Box>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
              <EnhancedTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {items.map((item, index) => (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.sales !== null ? item.sales?.name : '-'}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenPopup(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => openDeleteDialog(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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
        <CustomerForm
          open={openPopup}
          handleClose={handleClosePopup}
          handleSave={handleSave}
          initialData={editData}
        />
        <Dialog
          open={confirmDeleteOpen}
          onClose={closeDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this team member?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

export default EnhancedTable;
