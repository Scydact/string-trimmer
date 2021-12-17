import { Box, Button, Container, CssBaseline, Grid, Link as MUILink, Typography } from '@mui/material';
import { memo, createElement } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, LinkProps, useResolvedPath, useMatch } from 'react-router-dom';

import NewLineTrimmer from './Pages/new-line-trimmer';

const pages = [
  {
    path: 'trimmer',
    name: 'Trimmer',
    elem: NewLineTrimmer,
  }
]

function App() {
  return (
    <Box>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Nav />
        <CssBaseline />
        <Container>
          <Routes>
            <Route index element={<Index />} />
            {pages.map(x => <Route key={x.path} path={x.path} element={createElement(x.elem)} />)}
          </Routes>
        </Container>
      </BrowserRouter>
    </Box>

  );
}

const Nav = memo(function Nav() {
  return <Box sx={{ bgcolor: 'ButtonFace', px: 3 }}>
    <Grid container py={1} alignItems='center'>
      <Grid item flexGrow='1'>
        <Typography>Text utils</Typography>
      </Grid>

      <Grid item container sx={{ width: 'auto' }} gap={2}>
        <Index />
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
  return <MUILink
    underline={match ? 'always' : 'hover'}
    component={Link}
    to={to}
    {...props}>
    {children}
  </MUILink>
}

export default App;
