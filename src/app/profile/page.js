"use client";

import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "@/components/atomics/Footer";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import { useRouter } from "next/navigation";
import Joi from 'joi';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const socialMediaMap = {
  0: 'Facebook',
  1: 'Instagram',
  2: 'Twitter',
  3: 'YouTube',
  4: 'TikTok',
};

export default function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, profile, updateSocialMedia, error, errorMessage, updatePassword, logout } = useZustandStore().auth;
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [value, setValue] = useState(0);
  const [user, setUser] = useState({});
  const [formState, setFormState] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: ''
  });
  const [passwordFormState, setPasswordFormState] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const router = useRouter();

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setUser(profile);
      setFormState({
        facebook: getUserSocialMediaLink(0),
        instagram: getUserSocialMediaLink(1),
        twitter: getUserSocialMediaLink(2),
        tiktok: getUserSocialMediaLink(4)
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      setMessage(errorMessage);
      setSeverity("error");
      setOpenSnackbar(true);
    }
  }, [error, errorMessage]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordFormState({
      ...passwordFormState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const schema = Joi.object({
      facebook: Joi.string().uri().allow('').messages({
        "string.base": "Facebook should be a type of text",
      }),
      instagram: Joi.string().uri().allow('').messages({
        "string.base": "Instagram should be a type of text",
      }),
      twitter: Joi.string().uri().allow('').message({
        "string.base": "Twitter should be a type of text",
      }),
      tiktok: Joi.string().uri().allow('').messages({
        "string.base": "Tiktok should be a type of text",
      }),
    });

    const { error: validationError } = schema.validate(formState, { abortEarly: false });

    if (validationError) {
      const validationErrors = {};
      validationError.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
    } else {
      setErrors({});

      try {
        const payload = [
          {
            socialType: 0,
            link: formState.facebook
          },
          {
            socialType: 1,
            link: formState.instagram
          },
          {
            socialType: 2,
            link: formState.twitter
          },
          {
            socialType: 3,
            link: formState.tiktok
          }
        ]
        await updateSocialMedia({ items: payload });

        setMessage("Profile Updated Successfully");
        setSeverity("success");
        setOpenSnackbar(true);

      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handlePasswordFormSubmit = async (event) => {
    event.preventDefault();

    const schema = Joi.object({
      newPassword: Joi.string().min(6).required().label('New Password'),
      confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().label('Confirm Password')
        .messages({ 'any.only': 'Passwords do not match' }),
    });

    const { error: validationError } = schema.validate(passwordFormState, { abortEarly: false });

    if (validationError) {
      const validationErrors = {};
      validationError.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setPasswordErrors(validationErrors);
    } else {
      setPasswordErrors({});

      try {
        await updatePassword({
          newPassword: passwordFormState.newPassword,
          confirmationPassword: passwordFormState.confirmPassword
        });

        setMessage("Password Updated Successfully");
        setSeverity("success");
        setOpenSnackbar(true);

      } catch (error) {
        console.error("Error updating password:", error);
      }
    }
  };

  const getUserSocialMediaLink = (socialMediaIndex) => {
    const socialMediaItem = profile?.socialMedia?.find(item => item.social_media === socialMediaIndex);
    return socialMediaItem ? socialMediaItem.link : '';
  };

  const onLogout = async () => {
    await logout().then(() => {
      window.location.reload()
    })
  }

  return (
    <Container
      maxWidth={isMobile ? false : 'lg'}
      disableGutters
      sx={{ position: 'relative', height: 'auto' }}
    >
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
      <Box
        component='div'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5
        }}
      >
        <Grid container sx={{ p: 2, mb: 3 }}>
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant='fullWidth' centered>
                  <Tab label="Profile" {...a11yProps(0)} />
                  <Tab label="Password" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4} md={3}>
                    <Box
                      component='div'
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3
                      }}
                    >
                      <Avatar sx={{ width: 80, height: 80 }} alt={user?.name} />
                      <Typography variant="h5">{user?.name}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={user?.username || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={user?.phone || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={user?.email || ''}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Facebook"
                      variant="outlined"
                      fullWidth
                      name="facebook"
                      value={formState.facebook}
                      onChange={handleInputChange}
                      error={Boolean(errors.facebook)}
                      helperText={errors.facebook}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Instagram"
                      variant="outlined"
                      fullWidth
                      name="instagram"
                      value={formState.instagram}
                      onChange={handleInputChange}
                      error={Boolean(errors.instagram)}
                      helperText={errors.instagram}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Twitter"
                      variant="outlined"
                      fullWidth
                      name="twitter"
                      value={formState.twitter}
                      onChange={handleInputChange}
                      error={Boolean(errors.twitter)}
                      helperText={errors.twitter}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="TikTok"
                      variant="outlined"
                      fullWidth
                      name="tiktok"
                      value={formState.tiktok}
                      onChange={handleInputChange}
                      error={Boolean(errors.tiktok)}
                      helperText={errors.tiktok}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFormSubmit}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="inherit"
                      fullWidth
                      onClick={onLogout}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="New Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      name="newPassword"
                      value={passwordFormState.newPassword}
                      onChange={handlePasswordInputChange}
                      error={Boolean(passwordErrors.newPassword)}
                      helperText={passwordErrors.newPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      name="confirmPassword"
                      value={passwordFormState.confirmPassword}
                      onChange={handlePasswordInputChange}
                      error={Boolean(passwordErrors.confirmPassword)}
                      helperText={passwordErrors.confirmPassword}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePasswordFormSubmit}
                      fullWidth
                    >
                      Change Password
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="inherit"
                      fullWidth
                      onClick={onLogout}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </CustomTabPanel>
            </Box>
          </Grid>
        </Grid>
        <Footer />
      </Box>
    </Container>
  );
}
