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
import TeamForm from "@/components/molecules/internal/team/TeamForm";
import {ContentCopy, FacebookOutlined, Instagram, MusicNote, Twitter} from "@mui/icons-material";
import {useRouter} from "next/navigation";

const SocialComponents = ({ type, link }) => {
  const handleClick = (link) => {
    window.open(link, '_blank');
  };

  switch (type) {
    case 0:
      return <IconButton onClick={() => handleClick(link)}><FacebookOutlined /></IconButton>;
    case 1:
      return <IconButton onClick={() => handleClick(link)}><Instagram /></IconButton>;
    case 2:
      return <IconButton onClick={() => handleClick(link)}><Twitter /></IconButton>;
    case 3:
      return <IconButton onClick={() => handleClick(link)}><MusicNote /></IconButton>;
    default:
      return <></>;
  }
};

function EnhancedTableHead(props) {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Username</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Phone</TableCell>
        <TableCell>Social Media</TableCell>
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
  const [search, setSearch] = useState('');


  const { getTeams, createTeam, updateTeam, deleteTeam, items, totalItems, error, errorMessage } = useZustandStore().team;

  useEffect(() => {
    getTeams({ page, itemPerPage: rowsPerPage, search });
  }, [page, rowsPerPage, search]);

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
      await createTeam(formData);
      setMessage("Team Successfully Created.");
      setSeverity("success");
      setOpenSnackbar(true);
    } else {
      const payload = {
        _method: 'put',
        ...formData
      }

      await updateTeam({ id: editData?.id, data: payload })
      setMessage("Team Successfully Updated");
      setSeverity("success");
      setOpenSnackbar(true);
    }
    await getTeams({ page, itemPerPage: rowsPerPage });
    handleClosePopup();
  };

  const handleDelete = async () => {
    if (deleteItemId) {
      await deleteTeam(deleteItemId);
      setMessage("Team Member Deleted Successfully");
      setSeverity("success");
      setOpenSnackbar(true);
      setConfirmDeleteOpen(false);
      setDeleteItemId(null);
      await getTeams({ page, itemPerPage: rowsPerPage });
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

  const handleCopyToClipboard = (text) => {
    if (text !== null) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log("Domain copied to clipboard");
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };

  return (
    <MainLayout currentPage='Team'>
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
              <TextField label="Search" variant="standard" margin={'dense'} sx={{ width: '50%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button variant="contained" color="primary" size="small" onClick={() => handleOpenPopup()}>Add</Button>
            </Box>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
              <EnhancedTableHead order={order} orderBy={orderBy} />
              <TableBody>
                {items.map((item) => (
                  <TableRow hover tabIndex={-1} key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body1' sx={{ mr: 1 }}>
                          {item?.username}
                        </Typography>
                        <IconButton onClick={() => handleCopyToClipboard(item?.username)} aria-label="copy to clipboard">
                          <ContentCopy />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Box component='div' sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='body1' sx={{ mr: 1 }}>
                          {item?.phone}
                        </Typography>
                        <IconButton onClick={() => handleCopyToClipboard(item?.phone)} aria-label="copy to clipboard">
                          <ContentCopy />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box component='div' sx={{ display: 'flex', flexDirection: 'row', gap: .5 }}>
                        { item.socials.filter((row) => row.link !== null).map((row, key) => (
                          <SocialComponents key={key} type={row?.socialType} link={row?.link} />
                        )) }
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
        <TeamForm
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
