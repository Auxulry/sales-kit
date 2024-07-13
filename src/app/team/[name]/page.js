'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import {Box, Button, Container, Grid, IconButton, TextField, Typography, useMediaQuery, Snackbar} from "@mui/material";
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { Autoplay } from "swiper/modules";
import { FacebookOutlined, Instagram, Twitter, MusicNote } from "@mui/icons-material";
import React, {useEffect, useLayoutEffect, useState} from "react";
import { useZustandStore } from "@/provider/ZustandContextProvider";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import Joi from 'joi';
import AutoPlayAudio from "@/components/atomics/AutoPlayAudio";
import {Product} from "@/app/team/[name]/dataObj";

const SocialComponents = ({ type, link }) => {
  const handleClick = (link) => {
    window.open(link, '_blank');
  };

  switch (type) {
    case 0:
      return <IconButton onClick={() => handleClick(link)}><FacebookOutlined sx={{ color: '#fff' }} /></IconButton>;
    case 1:
      return <IconButton onClick={() => handleClick(link)}><Instagram sx={{ color: '#fff' }} /></IconButton>;
    case 2:
      return <IconButton onClick={() => handleClick(link)}><Twitter sx={{ color: '#fff' }} /></IconButton>;
    case 3:
      return <IconButton onClick={() => handleClick(link)}><MusicNote sx={{ color: '#fff' }} /></IconButton>;
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
  const [product, setProduct] = useState(11);
  const [productType, setProductType] = useState([])
  const [productCategory, setProductCategory] = useState({
    type: 1,
    category: 1
  })
  const [selectedProperty, setSelectedProperty] = useState("30/60")
  const [openForm, setOpenForm] = useState(false);
  const searchParams = useSearchParams()

  useEffect(() => {
    setProductType(Product.filter((item) => item.name === product).length > 0
      ? Product.filter((item) => item.name === product)[0].types
      : [])
  }, [product]);

  useLayoutEffect(() => {
    document.body.style.height = '100%';
    document.body.style.color = '#fff';
    document.body.style.background = 'linear-gradient(to bottom, #147C3B 0%, #66B030 100%)';
    document.documentElement.style.height = '100%';
    document.documentElement.style.color = '#fff';
    document.documentElement.style.background = 'linear-gradient(to bottom, #147C3B 0%, #66B030 100%)'

    return () => {
      document.body.style.height = '';
      document.body.style.color = '';
      document.body.style.background = '';
      document.documentElement.style.height = '';
      document.documentElement.style.color = '';
      document.documentElement.style.background = ''
    };
  }, []);

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

  const handleAdsClick = (link) => {
    window.open(link, '_blank')
  }

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const handleRouteChange = () => {
    window.open(
      'https://www.google.com/maps?rlz=1C5CHFA_enID1016ID1016&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGDsyCAgCEEUYJxg7MgYIAxBFGDsyBggEEEUYOTIGCAUQRRg8MgYIBhBFGD0yBggHEEUYPdIBCDEyODlqMGo3qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KVEz6UpHk2kuMelOrUGrykTS&daddr=Jl.+Raya+Cileungsi+-+Jonggol,+Gandoang,+Kec.+Cileungsi,+Kabupaten+Bogor,+Jawa+Barat',
      '_blank'
    )
  }

  return (
    <Container
      maxWidth={isMobile ? false : 'lg'}
      disableGutters
    >
      <AutoPlayAudio src='/sound/pesona-kahuripan.mp3' />
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
          {searchParams.size > 0 && (
            <Typography variant='h4' sx={{ pt: 3 }}>Halo, {searchParams.get('refname')}</Typography>
          )}
          {salesInfo.ads.length > 0 && (
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
                  {salesInfo.ads.map((item, key) => (
                    <SwiperSlide key={key}>
                      <div
                        style={{
                          width: '100%',
                          height: '160px',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleAdsClick(item?.link)}
                      >
                        <Image
                          src={item?.media}
                          alt={item?.description}
                          fill
                          priority
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Grid>
            </Grid>
          )}
          <Box component='div' sx={{ px: isMobile || isTab ? 3 : 0, mb: 3 }}>
            <Grid container sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Typography variant='h4' sx={{ textAlign: 'center' }}>Persona Kahuripan</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Box
                  component='div'
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: .5
                  }}
                >
                  {Product.map((item) => (
                    <Box
                      component='div'
                      sx={{
                        background: item.name === product ? '#A4A4A4' : '#93C490',
                        py: .5,
                        px: 1.5,
                        borderRadius: '10px',
                        width: '95%',
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          background: '#A4A4A4'
                        }
                      }}
                      onClick={() => setProduct(item.name)}
                      key={item.name}
                    >{item.name}</Box>
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5' sx={{ textAlign: 'center' }}>{`Persona Kahuripan ${product}`}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {productType.length > 0 && productType.map((item) => (
                <>
                  <Grid item xs={12} key={`type-${item.id}`}>
                    <Box
                      component='div'
                      key={`product-${product}-category-${item.id}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: .5
                      }}
                    >
                      <Typography variant='h5'>{item.name} :</Typography>
                    </Box>
                  </Grid>
                  {item.categories.length > 0 && item.categories.map((e) => (
                    <Grid item xs={6} key={`category-${e.id}`}>
                      <Box
                        component='div'
                        sx={{
                          background: item.id === productCategory.type && e.id === productCategory.category ? '#A4A4A4' : '#93C490',
                          py: .5,
                          px: 1.5,
                          borderRadius: '10px',
                          width: '95%',
                          textAlign: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            background: '#A4A4A4'
                          }
                        }}
                        onClick={() => {
                          setProductCategory({
                            type: item.id,
                            category: e.id
                          })
                          setSelectedProperty(e.name)
                        }}
                      >{e.name}</Box>
                    </Grid>
                  ))}
                </>
              ))}
            </Grid>
            {product === 11 && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Typography variant='h5' sx={{ mb: 3 }}>Tipe {selectedProperty}</Typography>
                  <Swiper
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
                <Grid item xs={12}>
                  <Button variant='outlined' color='inherit' fullWidth onClick={handleRouteChange}>Rute ke Lokasi</Button>
                </Grid>
              </Grid>
            )}
            {product !== 11 && (
              <Typography variant='h4' sx={{ textAlign: 'center' }}>Coming Soon</Typography>
            )}
          </Box>
          <Grid container sx={{ p: 3 }}>
            <Grid item xs={12}>
              <Box component='div' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Typography variant='h5'>HUBUNGI SALES PERSON KAMI</Typography>
                <Box
                  component='div'
                  sx={{
                    borderRadius: '50%',
                    width: '150px',
                    height: '150px',
                    background: '#a4a4a4'
                  }}
                ></Box>
                <Typography component='h5'>{salesInfo?.name}</Typography>
                <Typography variant='subtitle1'>{salesInfo?.phone}</Typography>
                <Box component='div' sx={{ display: 'flex', gap: 1, mb: 3 }}>
                  {salesInfo.socialMedia.length > 0 && salesInfo.socialMedia.map((item, key) => (
                    <SocialComponents key={key} type={item?.socialType} link={item?.link} />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant='outlined' color='inherit' fullWidth onClick={() => setOpenForm(!openForm)}>Dapatkan Brosur</Button>
            </Grid>
          </Grid>
          {openForm && (
            <Grid container sx={{ pb: 3 }}>
              <Grid item xs={12}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: isMobile ? '100%' : '50%', margin: '0 auto' }}>
                  <Box component='div' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: isMobile | isTab ? 3 : 0 }}>
                    <TextField
                      label="Nama Lengkap"
                      variant="standard"
                      fullWidth
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      InputLabelProps={{
                        style: { color: '#fff' },
                      }}
                      InputProps={{
                        style: { color: '#fff' },
                        placeholder: 'Nama Lengkap',
                      }}
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#fff',
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottomColor: '#fff',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#fff',
                        },
                      }}
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
                      InputLabelProps={{
                        style: { color: '#fff' },
                      }}
                      InputProps={{
                        style: { color: '#fff' },
                        placeholder: 'Nama Lengkap',
                      }}
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#fff',
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottomColor: '#fff',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#fff',
                        },
                      }}
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
                      InputLabelProps={{
                        style: { color: '#fff' },
                      }}
                      InputProps={{
                        style: { color: '#fff' },
                        placeholder: 'Nama Lengkap',
                      }}
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#fff',
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottomColor: '#fff',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#fff',
                        },
                      }}
                    />
                    <Button variant='outlined' color='inherit' fullWidth type="submit">Dapatkan</Button>
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
          )}
        </>
      )}
    </Container>
  );
};

export default Front;
