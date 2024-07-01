"use client";

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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import Joi from 'joi'; // Import Joi for validation
import Autocomplete from '@mui/material/Autocomplete';
import { useZustandStore } from "@/provider/ZustandContextProvider";

const AdsForm = ({ open, handleClose, handleSave, initialData }) => {
  const { items, getTeams } = useZustandStore().team;

  const [formState, setFormState] = useState({
    salesIds: [],
    media: null,
    description: '',
    link: '',
  });

  const [mediaPreview, setMediaPreview] = useState(null);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    getTeams({ page: -1 });
  }, [getTeams]);

  useEffect(() => {
    if (initialData) {
      setFormState({
        salesIds: initialData?.users?.map(user => user.id) || [],
        media: initialData?.media || null,
        description: initialData?.description || '',
        link: initialData?.link || '',
      });
      if (initialData?.media) {
        setMediaPreview(initialData.media);
      }
    } else {
      setFormState({
        salesIds: [],
        media: null,
        description: '',
        link: '',
      });
      setMediaPreview(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormState({ ...formState, media: file });
    setMediaPreview(URL.createObjectURL(file));
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
        salesIds: [],
        media: null,
        description: '',
        link: '',
      });
      setMediaPreview(null);
    }
  };

  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setFormState({
      ...formState,
      salesIds: checked ? items.map(item => item.id) : [],
    });
  };

  // Joi schema definition for validation
  const schema = Joi.object({
    salesIds: Joi.array().items(Joi.number()).messages({
      "number.base": "Sales should be a type of number",
    }),
    media: Joi.any().required().messages({
      "any.required": "Media is required",
    }),
    description: Joi.string().required().messages({
      "any.required": "Description is required",
      "string.empty": "Description is required",
    }),
    link: Joi.string().uri().required().messages({
      "any.required": "Link is required",
      "string.empty": "Link is required",
      "string.uri": "Link must be a valid URL",
    }),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Ad' : 'Add Ad'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3, p: 2 }}>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  color="primary"
                />
              }
              label="Select All Sales"
            />
            <Autocomplete
              multiple
              fullWidth
              options={items}
              getOptionLabel={(option) => option.name}
              value={items.filter(option => formState.salesIds.includes(option.id))}
              onChange={(event, newValue) => {
                setFormState({ ...formState, salesIds: newValue.map(item => item.id) });
                if (newValue.length !== items.length) {
                  setSelectAll(false);
                } else {
                  setSelectAll(true);
                }
              }}
              renderInput={(params) => <TextField {...params} label="Sales" />}
            />
            {errors.salesIds && <Typography color="error">{errors.salesIds}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              color={errors.media ? 'error' : 'primary'}
            >
              Upload Media
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {mediaPreview && (
              <img
                src={mediaPreview}
                alt="Media Preview"
                style={{ marginTop: 10, maxHeight: 200, width: '100%', objectFit: 'cover' }}
              />
            )}
            {errors.media && <Typography color="error">{errors.media}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formState.description}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.description)}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Link"
              name="link"
              value={formState.link}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.link)}
              helperText={errors.link}
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

export default AdsForm;
