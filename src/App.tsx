import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import { Box, Button, Container, CssBaseline, Grid, Link as MUILink, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, { memo, createElement, useMemo, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, LinkProps, useResolvedPath, useMatch } from 'react-router-dom';

import NewLineTrimmer from './Pages/new-line-trimmer';

const pages = [
  {
    path: 'trimmer',
    name: 'Trimmer',
    elem: NewLineTrimmer,
  }
]

type PaletteMode = 'light' | 'dark' | 'auto';

function useDarkMode() {
  const [mode, setMode] = useState<PaletteMode>('auto');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const toggleMode = useCallback((mode?: PaletteMode) => {
    if (mode) setMode(mode);
    else setMode(prev => {
      switch (prev) {
        case 'light':
          return 'auto';
        case 'auto':
          return 'dark';
        case 'dark':
        default:
          return 'light';
      }
    });
  }, [])

  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light' || (mode === 'auto') ? (prefersDarkMode ? 'dark' : 'light') : mode,
    }
  }), [prefersDarkMode, mode])

  return { mode, setMode, toggleMode, theme };
}

function App() {
  const { mode, setMode, toggleMode, theme } = useDarkMode();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Nav mode={mode} setMode={(s) => setMode(s)} />
          <Container>
            <Routes>
              <Route index element={<Container><h1>Text utils available:</h1><Index /></Container>} />
              {pages.map(x => <Route key={x.path} path={x.path} element={createElement(x.elem)} />)}
            </Routes>
          </Container>
        </BrowserRouter>
      </Box>
    </ThemeProvider>

  );
}

type NavProps = {
  mode: PaletteMode,
  setMode: (s: PaletteMode) => any,
}

const Nav = memo(function Nav({ mode, setMode }: NavProps) {
  return <Box sx={{ bgcolor: 'primary.dark', px: 3 }}>
    <Grid container py={1} alignItems='center'>
      <Grid item flexGrow='1'>
        <Typography component={Link} to='/' sx={{ color: 'text.primary' }}>Text utils</Typography>
      </Grid>

      <Grid item container sx={{ width: 'auto' }} gap={2}>
        <Index />
      </Grid>

      <Grid item>
        <ToggleButtonGroup value={mode} onChange={(evt, m) => setMode(m)} >
          <ToggleButton value='light'><LightMode /></ToggleButton>
          <ToggleButton value='auto'><SettingsBrightness /></ToggleButton>
          <ToggleButton value='dark'><DarkMode /></ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  </Box>
})

const Index = memo(function Index() {
  return (<>
    {pages.map(x =>
      <CustomLink
        key={x.path}
        to={x.path}>
        {x.name}
      </CustomLink>)}
  </>)
})

function CustomLink({ children, to, ...props }: LinkProps) {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  // @ts-ignore
  return <Button
    // underline={match ? 'always' : 'hover'}
    variant={match ?  'outlined' : 'contained' }
    component={Link}
    to={to}
    {...props}>
    {children}
  </Button>
}

export default App;
