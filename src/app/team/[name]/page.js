'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import {Box, Button, Container, Grid, IconButton, TextField, Typography, useMediaQuery, Snackbar} from "@mui/material";
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { Autoplay } from "swiper/modules";
import { FacebookOutlined, Instagram, Twitter, MusicNote } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import {useParams} from "next/navigation";
import Joi from 'joi';

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

const Front = () => {
  const theme = useTheme();
  const param = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTab = useMediaQuery(theme.breakpoints.down('md'));
  const { error, isNotFound, errorMessage, getSalesInfo, salesInfo, addGuestToCustomer } = useZustandStore().guest;
  const [salesFound, setSalesFound] = useState({
    isFound: false,
    message: ''
  });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    getSalesInfo(decodeURIComponent(param?.name));
  }, [getSalesInfo, param?.name]);

  useEffect(() => {
    if (error) {
      if (isNotFound) {
        setSalesFound({
          isFound: false,
          message: errorMessage
        });
      } else {
        setMessage(errorMessage);
        setSeverity('error');
        setOpen(true);
        setSalesFound({
          isFound: true,
          message: '',
        });
      }
    } else {
      setSalesFound({
        isFound: true,
        message: ''
      });
    }
  }, [error, isNotFound, errorMessage]);

  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name is required",
    }),
    email: Joi.string().email({ tlds: false }).required().messages({
      "string.base": "Email should be a type of text",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10,12}$')).required().messages({
      "string.base": "Phone should be a type of text",
      "string.empty": "Phone is required",
      "string.pattern.base": "Phone must be a valid phone number",
    }),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { error: errorState } = schema.validate(formState, { abortEarly: false });

    if (errorState) {
      const validationErrors = {};
      errorState.details.forEach(detail => {
        validationErrors[detail.path[0]] = detail.message;
      });
      setErrors(validationErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setErrors({})
      const payload = {
        ...formState,
        username: salesInfo.username,
      }
      await addGuestToCustomer(payload);

      setMessage("Form submitted successfully");
      setSeverity("success");
      setOpen(true);

      // Clear form state after submission if needed
      setFormState({
        name: '',
        email: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth={isMobile ? false : 'lg'} disableGutters>
      {!salesFound.isFound && (
        <Box
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
          }}
        >
          <Typography variant='h5'>{salesFound.message}</Typography>
        </Box>
      )}
      {salesFound.isFound && (
        <>
          <Grid container sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Swiper
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
                loop
                style={{ paddingTop: isMobile || isTab ? 0 : '3rem' }}
              >
                <SwiperSlide>
                  <div style={{ width: '100%', height: '160px', position: 'relative' }}>
                    <Image
                      src="https://placehold.co/600x400/png?text=Banner+1"
                      alt="Placeholder Image 1"
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div style={{ width: '100%', height: '160px', position: 'relative' }}>
                    <Image
                      src="https://placehold.co/600x400/png?text=Banner+2"
                      alt="Placeholder Image 2"
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div style={{ width: '100%', height: '160px', position: 'relative' }}>
                    <Image
                      src="https://placehold.co/600x400/png?text=Banner+3"
                      alt="Placeholder Image 3"
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div style={{ width: '100%', height: '160px', position: 'relative' }}>
                    <Image
                      src="https://placehold.co/600x400/png?text=Banner+4"
                      alt="Placeholder Image 4"
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </Grid>
          </Grid>
          <Box component='div' sx={{ px: isMobile || isTab ? 3 : 0, mb: 3 }}>
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Typography variant='h5'>Type 30/60</Typography>
                <Swiper
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                  loop
                >
                  <SwiperSlide>
                    <div style={{ width: '100%', height: '360px', position: 'relative' }}>
                      <Image
                        src="/images/3060-1.png"
                        alt="Placeholder Image 1"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div style={{ width: '100%', height: '360px', position: 'relative' }}>
                      <Image
                        src="/images/3060-2.png"
                        alt="Placeholder Image 2"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div style={{ width: '100%', height: '360px', position: 'relative' }}>
                      <Image
                        src="/images/3060-3.png"
                        alt="Placeholder Image 3"
                        fill
                        priority
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Box component='div' sx={{ display: 'flex', flexDirection: 'column', px: 3 }}>
                  <Typography variant='h6' sx={{ mb: 2 }}>Rumah Tipe Subsidi - Double Dinding</Typography>
                  <table border='0'>
                    <tbody>
                    <tr>
                      <td>
                        <Typography variant='subtitle1' sx={{fontWeight: 'bold'}}>Harga KPR</Typography>
                      </td>
                      <td>
                        <Typography variant='subtitle1' sx={{fontWeight: 'bold'}}>: Rp. 185.000.000,00</Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant='subtitle1'>Luas Tanah</Typography>
                      </td>
                      <td>
                        <Typography variant='subtitle1'>: 60 m2</Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant='subtitle1'>Luas Bangunan</Typography>
                      </td>
                      <td>
                        <Typography variant='subtitle1'>: 30 m2</Typography>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <Typography variant='subtitle1' sx={{fontWeight: 'bold'}}>Cicilan</Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant='subtitle1'>20 Tahun</Typography>
                      </td>
                      <td>
                        <Typography variant='subtitle1'>: Rp. 1.192.574,00 /bln</Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant='subtitle1'>15 Tahun</Typography>
                      </td>
                      <td>
                        <Typography variant='subtitle1'>: Rp. 1.427.023,00 /bln</Typography>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Typography variant='subtitle1'>10 Tahun</Typography>
                      </td>
                      <td>
                        <Typography variant='subtitle1'>: Rp. 1.910.587,00 /bln</Typography>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid container sx={{ mb: 5 }}>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : '50%', margin: '0 auto' }}>
                <Box component='div' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: isMobile | isTab ? 3 : 0 }}>
                  <Box component='div' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component='h5'>{salesInfo?.name}</Typography>
                    <Typography variant='subtitle1'>{salesInfo?.phone}</Typography>
                    <Box component='div' sx={{ display: 'flex', gap: 1, mb: 3 }}>
                      {salesInfo.socialMedia.length > 0 && salesInfo.socialMedia.map((item, key) => (
                        <SocialComponents key={key} type={item?.socialType} link={item?.link} />
                      ))}
                    </Box>
                  </Box>
                  <TextField
                    label="Nama Lengkap"
                    variant="standard"
                    fullWidth
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                  />
                  <TextField
                    label="Alamat Email"
                    variant="standard"
                    fullWidth
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                  <TextField
                    label="Nomor Telepon"
                    variant="standard"
                    fullWidth
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    error={Boolean(errors.phone)}
                    helperText={errors.phone}
                  />
                  <Button variant='contained' color='primary' fullWidth type="submit">Save</Button>
                  <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={message}
                    severity={severity}
                  />
                </Box>
              </form>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Front;
