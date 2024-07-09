import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Typography,
} from '@mui/material';
import Joi from 'joi'; // Import Joi for validation
import Autocomplete from '@mui/material/Autocomplete';
import { useZustandStore } from "@/provider/ZustandContextProvider";

const statusOptions = [
  { value: 0, label: 'Qualification' },
  { value: 1, label: 'Proposal' },
  { value: 2, label: 'Evaluasi - Harga & Pricing' },
  { value: 3, label: 'Closed Won' },
  { value: 4, label: 'Closed Lost' },
];

const CustomerForm = ({ open, handleClose, handleSave, initialData }) => {
  const { items, getTeams } = useZustandStore().team;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    status: '',
    salesId: null,
  });

  const [errors, setErrors] = useState({}); // State to hold validation errors

  useEffect(() => {
    getTeams({ page: -1 });
  }, [getTeams]);

  useEffect(() => {
    if (initialData) {
      setFormState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        status: initialData?.statusNumber || 0,
        salesId: initialData?.sales?.id || null,
      });
    } else {
      setFormState({
        name: '',
        email: '',
        phone: '',
        status: '',
        salesId: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSaveClick = () => {
    const { error: validationError, value } = schema.validate(formState, { abortEarly: false });

    if (validationError) {
      const validationErrors = {};
      validationError.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
      handleSave(value); // Call parent component's save function with validated form data
      setFormState({
        name: '',
        email: '',
        phone: '',
        status: '',
        salesId: null,
      });
    }
  };

  // Joi schema definition for validation
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name is required",
    }),
    email: Joi.string().email({ tlds: false }).required().messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone is required",
      "string.empty": "Phone is required",
    }),
    status: Joi.number().required().messages({
      "any.required": "Status is required",
      "number.empty": "Status is required",
    }),
    salesId: Joi.number().allow('', null).optional().messages({
      "string.base": "Sales should be a type of text",
    }),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mb: 3, p: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.name)}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.phone)}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={statusOptions}
              getOptionLabel={(option) => option.label}
              value={statusOptions.find(option => option.value === formState.status) || null}
              onChange={(event, newValue) => {
                setFormState({ ...formState, status: newValue ? newValue.value : '' });
              }}
              renderInput={(params) => <TextField {...params} label="Status" error={Boolean(errors.status)} />}
            />
            {errors.status && <Typography color="error">{errors.status}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={items}
              getOptionLabel={(option) => option.name}
              value={items.find(option => option.id === formState.salesId) || null}
              onChange={(event, newValue) => {
                setFormState({ ...formState, salesId: newValue ? newValue.id : null });
              }}
              renderInput={(params) => <TextField {...params} label="Sales" />}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerForm;
