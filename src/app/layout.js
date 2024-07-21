import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {ThemeProvider} from "@mui/material";
import theme from "@/commons/theme-provider";
import {ZustandProvider} from "@/provider/ZustandContextProvider";
import {Poppins} from "next/font/google";

export const metadata = {
  title: "Pesona Kahuripan",
  description: "Pesona kahuripan",
};

export const viewport = {
  initialScale: 1,
  width: 'device-width'
}

const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});
export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <link rel="manifest" href="/manifest.json"/>
    </head>
    <body suppressHydrationWarning={true} style={{padding: 0, margin: 0, position: 'relative' }} className={poppins.className}>
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider theme={theme}>
            <ZustandProvider>
              {children}
            </ZustandProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
