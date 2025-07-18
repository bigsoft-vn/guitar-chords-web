import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import ExtensionNotice from './components/ExtensionNotice';
import MainWindow from './components/MainWindow';
import SearchWindow from './components/SearchWindow';
import MusicPlayer from './components/MusicPlayer';
import ChordTutorial from './components/ChordTutorial';
import darkTheme from './theme/darkTheme';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container maxWidth={false} disableGutters>
          <ExtensionNotice />
        </Container>
        <Router>
          <Routes>
            <Route path="/" element={<MainWindow />} />
            <Route path="/search" element={<SearchWindow />} />
            <Route path="/player/:songId?" element={<MusicPlayer />} />
            <Route path="/chord/:chordName" element={<ChordTutorial />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
