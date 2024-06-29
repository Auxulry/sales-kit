"use client";

import {Box, IconButton, Paper} from "@mui/material";
import {
  BroadcastOnPersonalOutlined,
  CurrencyExchangeOutlined,
  HomeOutlined as MuiHome,
  ScienceOutlined, SettingsOutlined
} from "@mui/icons-material";
import React from "react";
import {usePathname, useRouter} from "next/navigation";
import {useTheme} from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  const router = useRouter();
  const pathname = usePathname();

  return (
    <Paper
      elevation={5}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        py: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1
      }}
    >
      <IconButton
        onClick={() => router.push('/')}
        {...pathname && pathname === '/' && ({ sx: { color: theme.palette.primary.main } })}
      >
        <MuiHome sx={{ fontSize: '2.5rem' }} />
      </IconButton>
      <IconButton
        onClick={() => router.push('/proposal')}
        {...pathname && pathname === '/proposal' && ({ sx: { color: theme.palette.primary.main } })}
      >
        <BroadcastOnPersonalOutlined sx={{ fontSize: '2.5rem' }} />
      </IconButton>
      <IconButton
        onClick={() => router.push('/evaluation')}
        {...pathname && pathname === '/evaluation' && ({ sx: { color: theme.palette.primary.main } })}
      >
        <ScienceOutlined sx={{ fontSize: '2.5rem' }} />
      </IconButton>
      <IconButton
        onClick={() => router.push('/won-lost')}
        {...pathname && pathname === '/won-lost' && ({ sx: { color: theme.palette.primary.main } })}
      >
        <CurrencyExchangeOutlined sx={{ fontSize: '2.5rem' }} />
      </IconButton>
      <IconButton
        onClick={() => router.push('/profile')}
        {...pathname && pathname === '/profile' && ({ sx: { color: theme.palette.primary.main } })}
      >
        <SettingsOutlined sx={{ fontSize: '2.5rem' }} />
      </IconButton>
    </Paper>
  )
}

export default Footer;
