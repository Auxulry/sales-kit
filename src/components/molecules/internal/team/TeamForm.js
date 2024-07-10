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
} from '@mui/material';
import Joi from 'joi'; // Import Joi for validation

const socialMediaTypes = [
  { value: 0, label: 'Facebook' },
  { value: 1, label: 'Instagram' },
  { value: 2, label: 'Twitter' },
  { value: 3, label: 'YouTube' },
  { value: 4, label: 'TikTok' },
];

const TeamForm = ({ open, handleClose, handleSave, initialData }) => {
  const [formState, setFormState] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
  });

  const [errors, setErrors] = useState({}); // State to hold validation errors

  useEffect(() => {
    if (initialData) {
      setFormState({
        name: initialData?.name || '',
        username: initialData?.username || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        facebook: getUserSocialMediaLink(0) || '',
        instagram: getUserSocialMediaLink(1) || '',
        twitter: getUserSocialMediaLink(2) || '',
        tiktok: getUserSocialMediaLink(3) || '',
      });
    } else {
      setFormState({
        name: '',
        username: '',
        email: '',
        phone: '',
        facebook: '',
        instagram: '',
        twitter: '',
        tiktok: '',
      });
    }
  }, [initialData]);

  const getUserSocialMediaLink = (socialMediaIndex) => {
    const socialMediaItem = initialData?.socials?.find(item => item.socialType === socialMediaIndex);
    return socialMediaItem ? socialMediaItem.link : '';
  };

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
      setFormState({
        name: '',
        username: '',
        email: '',
        phone: '',
        facebook: '',
        instagram: '',
        twitter: '',
        tiktok: '',
      })
      handleSave(value); // Call parent component's save function with validated form data
    }
  };

  // Joi schema definition for validation
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.empty": "Name is required",
    }),
    username: Joi.string()
      .pattern(/^[a-z0-9._-]+$/)
      .min(3)
      .required()
      .messages({
        "string.base": "Username should be a type of text",
        "string.empty": "Username is required",
        "string.pattern.base": "Username can only contain lowercase letters, numbers, dots, underscores, and hyphens",
      }),

    email: Joi.string().email({ tlds: false }).allow('', null).messages({
      "string.email": "Email must be a valid email",
    }),
    phone: Joi.string().required().messages({
      "any.required": "Phone is required",
      "string.empty": "Phone is required",
    }),
    facebook: Joi.string().allow('').optional().messages({
      "string.base": "Facebook should be a type of text",
    }),
    instagram: Joi.string().allow('').optional().messages({
      "string.base": "Instagram should be a type of text",
    }),
    twitter: Joi.string().allow('').optional().messages({
      "string.base": "Twitter should be a type of text",
    }),
    tiktok: Joi.string().allow('').optional().messages({
      "string.base": "TikTok should be a type of text",
    }),
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 3, p: 2 }}>
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
              label="Username"
              name="username"
              value={formState.username}
              onChange={handleChange}
              fullWidth
              error={Boolean(errors.username)}
              helperText={errors.username}
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
            <TextField
              label="Facebook"
              name="facebook"
              fullWidth
              value={formState.facebook}
              onChange={handleChange}
              error={Boolean(errors.facebook)}
              helperText={errors.facebook || 'https://www.facebook.com'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Instagram"
              name="instagram"
              fullWidth
              value={formState.instagram}
              onChange={handleChange}
              error={Boolean(errors.instagram)}
              helperText={errors.instagram || 'https://www.instagram.com'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Twitter / X"
              name="twitter"
              fullWidth
              value={formState.twitter}
              onChange={handleChange}
              error={Boolean(errors.twitter)}
              helperText={errors.twitter || 'https://www.twiter.com'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tiktok"
              name="tiktok"
              fullWidth
              value={formState.tiktok}
              onChange={handleChange}
              error={Boolean(errors.tiktok)}
              helperText={errors.tiktok || 'https://www.tiktok.com'}
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

export default TeamForm;
