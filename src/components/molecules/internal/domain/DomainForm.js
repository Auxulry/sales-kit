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

const DomainForm = ({ open, handleClose, handleSave, initialData }) => {
  const { items, getTeams } = useZustandStore().team;

  const [formState, setFormState] = useState({
    domain: '',
    salesId: null,
  });

  const [errors, setErrors] = useState({}); // State to hold validation errors

  useEffect(() => {
    getTeams({ page: -1 });
  }, [getTeams]);

  useEffect(() => {
    if (initialData) {
      setFormState({
        domain: initialData?.domain || '',
        salesId: initialData?.user?.id || null,
      });
    } else {
      setFormState({
        domain: '',
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
        domain: '',
        salesId: null,
      });
    }
  };

  // Joi schema definition for validation
  const schema = Joi.object({
    domain: Joi.string().required().messages({
      "any.required": "Domain is required",
      "string.empty": "Domain is required",
    }),
    salesId: Joi.number().allow(null).optional().messages({
      "number.base": "Sales should be a type of number",
    }),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Domain' : 'Add Domain'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3, p: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Domain"
              name="domain"
              value={formState.domain}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.domain)}
              helperText={errors.domain}
            />
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
            {errors.salesId && <Typography color="error">{errors.salesId}</Typography>}
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

export default DomainForm;
