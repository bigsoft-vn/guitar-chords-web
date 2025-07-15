import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Slider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
} from '@mui/material';
import {
  ArrowBackRounded,
  PlayArrowRounded,
  PauseRounded,
  SkipPreviousRounded,
  SkipNextRounded,
  SpeedRounded,
} from '@mui/icons-material';
import { apiService, Song as ApiSong } from '../services/api';
import GuitarLoader from './GuitarLoader';

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  chords: ChordPosition[];
  tempo: number;
}

interface ChordPosition {
  chord: string;
  position: number;
  line: number;
}

const MusicPlayer: React.FC = () => {
  const navigate = useNavigate();
  const { songId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [showChordDialog, setShowChordDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [songData, setSongData] = useState<ApiSong | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadSong = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSongById(songId || '1');
        setSongData(data);
      } catch (error) {
        console.error('Failed to load song:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSong();
  }, [songId]);

  const lyricsLines = songData ? songData.lyrics.split('\n') : [];
  const song = songData ? {
    id: songData.id.toString(),
    title: songData.title,
    artist: songData.artist.name,
    tempo: songData.tempo,
    lyrics: songData.lyrics,
    chords: songData.chords.map(c => ({
      chord: c.name,
      position: c.position,
      line: c.line
    }))
  } : null;

  useEffect(() => {
    if (isPlaying && song) {
      intervalRef.current = setInterval(() => {
        setCurrentLine((prev) => {
          if (prev < lyricsLines.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return 0;
          }
        });
      }, song.tempo ? (60 / song.tempo) * 1000 / scrollSpeed : 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, scrollSpeed, song?.tempo, lyricsLines.length]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const lineHeight = 60;
      const targetScroll = currentLine * lineHeight - container.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [currentLine]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <GuitarLoader message="Đang tải bài hát..." size="large" />
      </Container>
    );
  }

  if (!songData || !song) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h6" color="error">
            Không tìm thấy bài hát
          </Typography>
          <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Quay về trang chủ
          </Button>
        </Box>
      </Container>
    );
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleChordClick = (chord: string) => {
    setSelectedChord(chord);
    setShowChordDialog(true);
  };

  const renderLineWithChords = (line: string, lineIndex: number) => {
    const lineChords = song.chords.filter(c => c.line === lineIndex);
    
    if (lineChords.length === 0) {
      return (
        <Typography
          key={lineIndex}
          variant="h6"
          sx={{
            py: 1,
            backgroundColor: currentLine === lineIndex ? 'primary.light' : 'transparent',
            color: currentLine === lineIndex ? 'white' : 'inherit',
            borderRadius: 1,
            px: 2,
            transition: 'all 0.3s ease',
          }}
        >
          {line}
        </Typography>
      );
    }

    const parts = [];
    let lastPos = 0;

    lineChords
      .sort((a, b) => a.position - b.position)
      .forEach((chordPos, index) => {
        if (chordPos.position > lastPos) {
          parts.push(line.slice(lastPos, chordPos.position));
        }
        
        parts.push(
          <Chip
            key={`chord-${index}`}
            label={chordPos.chord}
            onClick={() => handleChordClick(chordPos.chord)}
            variant="outlined"
            size="small"
            sx={{
              mx: 0.5,
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'primary.light' },
            }}
          />
        );
        
        lastPos = chordPos.position;
      });

    if (lastPos < line.length) {
      parts.push(line.slice(lastPos));
    }

    return (
      <Box
        key={lineIndex}
        sx={{
          py: 1,
          backgroundColor: currentLine === lineIndex ? 'primary.light' : 'transparent',
          color: currentLine === lineIndex ? 'white' : 'inherit',
          borderRadius: 1,
          px: 2,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          minHeight: '40px',
        }}
      >
        <Typography variant="h6" component="span">
          {parts}
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackRounded />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {song.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {song.artist}
            </Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2}>
              <IconButton size="large">
                <SkipPreviousRounded />
              </IconButton>
              
              <IconButton size="large" onClick={togglePlayPause} color="primary">
                {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
              </IconButton>
              
              <IconButton size="large">
                <SkipNextRounded />
              </IconButton>
            </Box>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <SpeedRounded />
              <Typography variant="body2">Tốc độ cuộn:</Typography>
              <Slider
                value={scrollSpeed}
                onChange={(_, value) => setScrollSpeed(value as number)}
                min={0.5}
                max={3}
                step={0.1}
                sx={{ width: 200 }}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}x`}
              />
            </Box>
          </CardContent>
        </Card>

        <Paper
          ref={scrollContainerRef}
          sx={{
            maxHeight: '60vh',
            overflow: 'auto',
            p: 3,
            backgroundColor: 'grey.50',
          }}
        >
          {lyricsLines.map((line, index) => renderLineWithChords(line, index))}
        </Paper>

        <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
          <Typography variant="h6" width="100%" textAlign="center" mb={1}>
            Hợp âm trong bài:
          </Typography>
          {Array.from(new Set(song.chords.map(c => c.chord))).map((chord) => (
            <Chip
              key={chord}
              label={chord}
              onClick={() => handleChordClick(chord)}
              variant="outlined"
              sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'primary.light' } }}
            />
          ))}
        </Box>
      </Box>

      <Dialog
        open={showChordDialog}
        onClose={() => setShowChordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Hợp âm {selectedChord}</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <Typography variant="body1" mb={2}>
              Bấm vào để xem chi tiết cách bấm hợp âm {selectedChord}
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setShowChordDialog(false);
                navigate(`/chord/${selectedChord}`);
              }}
            >
              Xem hướng dẫn chi tiết
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MusicPlayer;