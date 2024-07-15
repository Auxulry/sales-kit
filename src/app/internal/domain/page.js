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
import DomainForm from "@/components/molecules/internal/domain/DomainForm";
import {useRouter} from "next/navigation";
import {ContentCopy} from "@mui/icons-material";

function EnhancedTableHead(props) {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell>Nama Pengguna</TableCell>
        <TableCell>Subdomain</TableCell>
        <TableCell>Domain</TableCell>
        <TableCell>Aksi</TableCell>
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
  const [search, setSearch] = useState('');

  const { getDomains, createDomain, updateDomain, deleteDomain, items, totalItems, error, errorMessage } = useZustandStore().domain;

  const { isAuthenticated } = useZustandStore().admin;
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/internal/auth/login');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    getDomains({ page, itemPerPage: rowsPerPage, search });
  }, [page, rowsPerPage, search]);


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
      await createDomain(formData);
      setMessage("Domain Successfully Created.");
      setSeverity("success");
      setOpenSnackbar(true);
    } else {
      const payload = {
        _method: 'put',
        ...formData
      }

      await updateDomain({ id: editData?.id, data: payload })
      setMessage("Domain Successfully Updated");
      setSeverity("success");
      setOpenSnackbar(true);
    }
    await getDomains({ page, itemPerPage: rowsPerPage });
    handleClosePopup();
  };

  const handleDelete = async () => {
    if (deleteItemId) {
      await deleteDomain(deleteItemId);
      setMessage("Team Member Deleted Successfully");
      setSeverity("success");
      setOpenSnackbar(true);
      setConfirmDeleteOpen(false);
      setDeleteItemId(null);
      await getDomains({ page, itemPerPage: rowsPerPage });
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

  return (
    <MainLayout currentPage='Domain'>
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
              <TextField label="Cari" variant="standard" margin={'dense'} sx={{ width: '50%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button variant="contained" color="primary" size="small" onClick={() => handleOpenPopup()}>Tambah</Button>
            </Box>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
              <EnhancedTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {items.map((item, index) => (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>{item.user?.username}</TableCell>
                    <TableCell>
                      <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body1' sx={{ mr: 1 }}>
                          {item?.subdomain}
                        </Typography>
                        <IconButton onClick={() => handleCopyToClipboard(item?.subdomain)} aria-label="copy to clipboard">
                          <ContentCopy />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body1' sx={{ mr: 1 }}>
                          {item?.domain}
                        </Typography>
                        <IconButton onClick={() => handleCopyToClipboard(item?.domain)} aria-label="copy to clipboard">
                          <ContentCopy />
                        </IconButton>
                      </Box>
                    </TableCell>
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
        <DomainForm
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
              Yakin Hapus?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Batal
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Hapus
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
}

export default EnhancedTable;
