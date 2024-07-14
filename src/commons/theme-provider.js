"use client";

import {Poppins} from "next/font/google";
import {createTheme} from "@mui/material";

const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  box: {
    fontFamily: poppins.style.fontFamily,
  }
});

export default theme;
