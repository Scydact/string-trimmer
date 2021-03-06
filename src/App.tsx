import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'
import useDarkMode from './hooks/use-darkmode';

import NewLineTrimmer from './components/new-line-trimmer';
import ResponsiveAppBar from './components/AppNav';
import { useEffect } from 'react';


function App() {
  const { mode, setMode, theme } = useDarkMode();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <ResponsiveAppBar
          title="String Trimmer 3010™"
          darkmode={mode}
          setDarkmode={s => setMode(s)} />
        <NewLineTrimmer />
      </Box>
    </ThemeProvider>

  );
}

export default App;
