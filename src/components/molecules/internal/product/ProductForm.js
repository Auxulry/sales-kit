import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox, Box,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import Joi from 'joi';
import {useTheme} from "@mui/material/styles";
import Autocomplete from "@mui/material/Autocomplete"; // Import Joi for validation

const ProductForm = ({ open, handleClose, handleSave, initialData }) => {
  const theme = useTheme();
  const [formState, setFormState] = useState({
    branch: '',
    isCommercial: false,
    name: '',
    routes: '',
    galleries: [],
  });

  const [errors, setErrors] = useState({}); // State to hold validation errors

  // Handle file uploads using react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFormState((prevState) => ({
        ...prevState,
        galleries: [...prevState.galleries, ...acceptedFiles],
      }));
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSaveClick = () => {
    const { error: validationError, value } = schema.validate(formState, { abortEarly: false });

    if (validationError) {
      const validationErrors = {};
      validationError.details.forEach((detail) => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
      handleSave(value); // Call parent component's save function with validated form data
      setFormState({
        branch: '',
        isCommercial: false,
        name: '',
        routes: '',
        galleries: [],
      });
    }
  };

  // Joi schema definition for validation
  const schema = Joi.object({
    branch: Joi.string().required().messages({
      'any.required': 'Branch is required',
      'string.empty': 'Branch is required',
    }),
    isCommercial: Joi.boolean().required(),
    name: Joi.string().required().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name is required',
    }),
    routes: Joi.string().required().messages({
      'any.required': 'routes is required',
      'string.empty': 'routes is required',
    }),
    galleries: Joi.array().min(1).messages({
      'array.min': 'At least one gallery image is required',
    }),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Ubah Product' : 'Tambah Product'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3, p: 2 }}>
          <Grid item xs={12}>
            <Autocomplete
              fullWidth
              options={[
                {
                  id: '8',
                  name: 'Pesona Kahuripan 8'
                },
                {
                  id: '9',
                  name: 'Pesona Kahuripan 9'
                },
                {
                  id: '10',
                  name: 'Pesona Kahuripan 10'
                },
                {
                  id: '11',
                  name: 'Pesona Kahuripan 11'
                }
              ]}
              getOptionLabel={(option) => option.name}
              value={[
                {
                  id: '8',
                  name: 'Pesona Kahuripan 8'
                },
                {
                  id: '9',
                  name: 'Pesona Kahuripan 9'
                },
                {
                  id: '10',
                  name: 'Pesona Kahuripan 10'
                },
                {
                  id: '11',
                  name: 'Pesona Kahuripan 11'
                }
              ].find(option => option.id === formState.branch) || null}
              onChange={(event, newValue) => {
                setFormState({ ...formState, branch: newValue ? newValue.id : null });
              }}
              renderInput={(params) => <TextField {...params} label="Branch" />}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.isCommercial}
                  onChange={handleChange}
                  name="isCommercial"
                />
              }
              label="Komersil"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nama"
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
              label="Rute"
              name="routes"
              value={formState.routes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              error={Boolean(errors.routes)}
              helperText={errors.routes}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              component='div'
              {...getRootProps({ className: 'dropzone' })}
            >
              <input {...getInputProps()} />
              <Box
                component='div'
                sx={{
                  backgroundColor: theme.palette.grey[400],
                  p: 5,
                  borderRadius: '10px'
                }}
              >
                <Typography variant="body1" align="center">
                  Drag & drop some files here, or click to select files
                </Typography>
              </Box>
            </Box>
            <aside>
              <Typography variant="h6">Files:</Typography>
              <ul>
                {formState.galleries.map((file) => (
                  <li key={file.path}>{file.path}</li>
                ))}
              </ul>
            </aside>
            {errors.galleries && <Typography color="error">{errors.galleries}</Typography>}
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

export default ProductForm;
