import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './theme';
import CreateApp from './components/CreateApp';

function App() {
  useEffect(() => {
    // ✅ Set mock user_id for testing if not already present
    const storedUserId = localStorage.getItem('user_id');
    if (!storedUserId) {
      localStorage.setItem('user_id', '1'); // You can change this to match your backend user
      console.log('Mock user_id set in localStorage: 1');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <CreateApp />
      </Container>
    </ThemeProvider>
  );
}

export default App;
