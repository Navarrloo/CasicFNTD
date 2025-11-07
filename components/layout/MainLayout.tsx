import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Container } from '@mui/material';
import NavBar from './NavBar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#32ff91', // accent-green
    },
    secondary: {
      main: '#fcee63', // accent-yellow
    },
    background: {
      default: '#02040a', // background-dark
      paper: '#0d111c', // background-med
    },
    text: {
      primary: '#f0f1f6', // text-light
      secondary: '#b0b5be', // text-dark
    },
  },
  typography: {
    fontFamily: '"VT323", monospace',
  },
});

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <NavBar />
        <Container component="main" sx={{ flexGrow: 1, py: 2 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
