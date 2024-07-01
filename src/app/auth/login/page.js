"use client";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Joi from 'joi';
import { useZustandStore } from "@/provider/ZustandContextProvider";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Sales Kit
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const router = useRouter();
  const { postAuthentication, isAuthenticated, error, errorMessage, isLoading } = useZustandStore().auth;
  const [formState, setFormState] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      setMessage(errorMessage);
      setSeverity('error');
      setOpen(true);
    }
  }, [error, errorMessage]);

  const schema = Joi.object({
    username: Joi.string()
      .pattern(/^[a-z0-9._-]+$/)
      .min(3)
      .required()
      .messages({
        "string.base": "Username should be a type of text",
        "string.empty": "Username is required",
        "string.pattern.base": "Username can only contain lowercase letters, numbers, dots, underscores, and hyphens",
      }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password is required",
    }),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { errorState } = schema.validate(formState, { abortEarly: false });

    if (errorState) {
      const validationErrors = {};
      errorState.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        await postAuthentication(formState).then(() => {
          setMessage("Login Successfully");
          setSeverity("success");
          setOpen(true);

          window.location.reload()
        });

      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username/Phone"
            name="username"
            autoComplete="username"
            autoFocus
            value={formState.username}
            onChange={handleChange}
            error={Boolean(errors.username)}
            helperText={errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formState.password}
            onChange={handleChange}
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
