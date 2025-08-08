import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Grid, AppBar, Toolbar } from '@mui/material';
import Menu from './components/Menu';
import Script from './components/Script';
import Canvas from './components/Canvas';
import useDragAndDrop from './hooks/useDragAndDrop';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  const {
    scriptBlocks,
    setScriptBlocks,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearScript,
    updateBlockValue,
  } = useDragAndDrop();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Block Code
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ mt: 2, height: 'calc(100vh - 100px)' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={12} md={3} sx={{ minWidth: '300px', flexShrink: 0 }}>
            <Menu
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </Grid>
          <Grid item xs={12} md={3} sx={{ minWidth: '300px', flexShrink: 0 }}>
            <Script
              blocks={scriptBlocks}
              setBlocks={setScriptBlocks}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClear={clearScript}
              onUpdateBlockValue={updateBlockValue}
            />
          </Grid>
          <Grid item xs={12} md sx={{ flexGrow: 1 }}>
            <Canvas blocks={scriptBlocks} setBlocks={setScriptBlocks} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
