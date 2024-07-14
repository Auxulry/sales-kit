"use client"

import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import Joi from 'joi'

const CustomerForm = ({ open, handleClose, handleSave }) => {

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({}); // State to hold validation errors

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
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tambah Kontak</DialogTitle>
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
