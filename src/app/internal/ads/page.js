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
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MainLayout from "@/components/atomics/internal/MainLayout";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import AdsForm from "@/components/molecules/internal/ads/AdsForm";
import {useRouter} from "next/navigation";

function EnhancedTableHead(props) {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell>Media</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Link</TableCell>
        <TableCell>Sales Page</TableCell>
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
  const [orderBy, setOrderBy] = useState('salesIds');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openPopup, setOpenPopup] = useState(false);
  const [editData, setEditData] = useState(null);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const { getAds, createAds, updateAds, deleteAds, items, totalItems, error, errorMessage } = useZustandStore().ads;

  const { isAuthenticated } = useZustandStore().admin;
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/internal/auth/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getAds({ page, itemPerPage: rowsPerPage });
  }, [page, rowsPerPage]);

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
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === 'media' && typeof formData[key] === 'string') {
        // Skip adding the media field if it's a string
        return;
      }
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item, i) => {
          data.append(`${key}[${i}]`, item);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      if (editData === null) {
        await createAds(data);
        setMessage("Ad Successfully Created.");
        setSeverity("success");
      } else {
        data.append('_method', 'put');
        await updateAds({ id: editData?.id, data });
        setMessage("Ad Successfully Updated");
        setSeverity("success");
      }
      await getAds({ page, itemPerPage: rowsPerPage });
      handleClosePopup();
    } catch (error) {
      setMessage("An error occurred.");
      setSeverity("error");
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    if (deleteItemId) {
      await deleteAds(deleteItemId);
      setMessage("Ad Deleted Successfully");
      setSeverity("success");
      setOpenSnackbar(true);
      setConfirmDeleteOpen(false);
      setDeleteItemId(null);
      await getAds({ page, itemPerPage: rowsPerPage });
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
    <MainLayout>
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
              <TextField label="Search" variant="standard" margin={'dense'} sx={{ width: '50%' }} />
              <Button variant="contained" color="primary" size="small" onClick={() => handleOpenPopup()}>Add</Button>
            </Box>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
              <EnhancedTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {items.map((item) => (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>
                      {item.media && <img src={item.media} alt="Ad Media" style={{ maxHeight: 50 }} />}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.link}</TableCell>
                    <TableCell>{item?.users.length > 0 ? item.users?.map(user => user.name).join(', ') : '-'}</TableCell>
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
        <AdsForm
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
              Are you sure you want to delete this ad?
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
