import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import {ThemeProvider} from "@mui/material";
import theme from "@/commons/theme-provider";
import {ZustandProvider} from "@/provider/ZustandContextProvider";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export const viewport = {
  initialScale: 1,
  width: 'device-width'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} style={{ padding: 0, margin: 0 }}>
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
