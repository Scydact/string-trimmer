import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import { Box, Button, Container, CssBaseline, Grid, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { memo, createElement, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, LinkProps, useResolvedPath, useMatch } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';

import NewLineTrimmer from './Pages/new-line-trimmer';
import ResponsiveAppBar from './ResponsiveAppBar';

const pages = [
  {
    path: 'trimmer',
    name: 'Trimmer',
    elem: NewLineTrimmer,
  }
]

type PaletteMode = 'light' | 'dark' | 'auto';

function useDarkMode() {
  const [mode, setMode] = useLocalStorage<PaletteMode>('muiTheme', 'auto');
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

  const theme = useMemo(() => {
    let m: 'light' | 'dark' = 'light';
    switch (mode) {
      case 'light':
      case 'dark':
        m = mode;
        break;
      default:
        m = prefersDarkMode ? 'dark' : 'light'
        break;
    }

    return createTheme({
      palette: {
        mode: m,
      }
    })
  }, [prefersDarkMode, mode])

  return { mode, setMode, toggleMode, theme };
}

function App() {
  const { mode, setMode, theme } = useDarkMode();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          {/* <Nav mode={mode} setMode={(s: any) => setMode(s)} /> */}
          <ResponsiveAppBar darkmode={mode} setDarkmode={s => setMode(s)} pages={[{ name: 'Trimmer', path: 'trimmer' }]} />
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



const Nav = memo(function Nav({ mode, setMode }: any) {

  return <Box sx={{ bgcolor: 'primary.dark', px: 3 }}>
    <Grid container py={1} alignItems='center'>
      <Grid item flexGrow='1'>
        <Typography component={Link} to='/' sx={{ color: 'text.primary' }}>Text utils</Typography>
      </Grid>

      <Grid item container sx={{ width: 'auto' }} gap={2}>
        <Index />
      </Grid>

      <Grid item>
        <ToggleButtonGroup 
          value={mode} 
          exclusive
          onChange={(evt, m) => setMode(m)} >
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
