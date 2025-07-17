import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  IconButton,
  Slider,
  Dialog,
  DialogContent,
  Fab,
} from '@mui/material';
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
  const [showSpeedDialog, setShowSpeedDialog] = useState(false);
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
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GuitarLoader message="Đang tải bài hát..." size="large" />
      </Box>
    );
  }

  if (!songData || !song) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Không tìm thấy bài hát
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Quay về trang chủ
        </Button>
      </Box>
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
            py: 2,
            px: 2,
            backgroundColor: currentLine === lineIndex ? 'grey.100' : 'transparent',
            color: currentLine === lineIndex ? 'text.primary' : 'text.secondary',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            fontSize: '1.125rem',
            fontWeight: currentLine === lineIndex ? 600 : 400,
            borderLeft: currentLine === lineIndex ? '4px solid' : '4px solid transparent',
            borderColor: currentLine === lineIndex ? 'primary.main' : 'transparent',
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
          <Box
            key={`chord-${index}`}
            component="span"
            onClick={() => handleChordClick(chordPos.chord)}
            sx={{
              display: 'inline-block',
              px: 1.5,
              py: 0.5,
              mx: 0.5,
              bgcolor: 'grey.100',
              color: 'text.primary',
              borderRadius: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid',
              borderColor: 'grey.200',
              '&:hover': { 
                bgcolor: 'grey.200',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              },
            }}
          >
            {chordPos.chord}
          </Box>
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
          py: 2,
          px: 2,
          backgroundColor: currentLine === lineIndex ? 'grey.100' : 'transparent',
          color: currentLine === lineIndex ? 'text.primary' : 'text.secondary',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          minHeight: '60px',
          fontSize: '1.125rem',
          fontWeight: currentLine === lineIndex ? 600 : 400,
          borderLeft: currentLine === lineIndex ? '4px solid' : '4px solid transparent',
          borderColor: currentLine === lineIndex ? 'primary.main' : 'transparent',
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontSize: '1.125rem' }}>
          {parts}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        py: 2,
        position: 'sticky',
        top: 0,
        bgcolor: 'background.default',
        zIndex: 10,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ width: 40, height: 40 }}
        >
          <i className="ri-arrow-left-line" style={{ fontSize: '1.5rem' }} />
        </IconButton>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
            {song.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {song.artist}
          </Typography>
        </Box>
        <IconButton sx={{ width: 40, height: 40 }}>
          <i className="ri-more-fill" style={{ fontSize: '1.5rem' }} />
        </IconButton>
      </Box>
      
      {/* Lyrics Card */}
      <Box sx={{ px: 2, pb: '8rem' }}>
        <Card sx={{ mt: 2, overflow: 'hidden' }}>
          <Box
            ref={scrollContainerRef}
            sx={{
              maxHeight: '70vh',
              overflow: 'auto',
              p: 0
            }}
          >
            {lyricsLines.map((line, index) => renderLineWithChords(line, index))}
          </Box>
        </Card>

        {/* Control Buttons */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 3
        }}>
          <IconButton
            onClick={() => setShowSpeedDialog(true)}
            sx={{ width: 48, height: 48 }}
          >
            <i className="ri-speed-line" style={{ fontSize: '1.5rem' }} />
          </IconButton>
          <IconButton
            onClick={togglePlayPause}
            sx={{ 
              width: 60, 
              height: 60,
              bgcolor: isPlaying ? 'grey.200' : 'primary.main',
              color: isPlaying ? 'text.primary' : 'white',
              '&:hover': {
                bgcolor: isPlaying ? 'grey.300' : 'primary.dark'
              }
            }}
          >
            <i className={isPlaying ? "ri-pause-fill" : "ri-play-fill"} style={{ fontSize: '2rem' }} />
          </IconButton>
          <IconButton sx={{ width: 48, height: 48 }}>
            <i className="ri-heart-line" style={{ fontSize: '1.5rem' }} />
          </IconButton>
        </Box>
      </Box>
      
      {/* Bottom Controls */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        p: 2,
        backdropFilter: 'blur(20px)',
        zIndex: 20
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton 
            onClick={() => setCurrentLine(Math.max(0, currentLine - 1))}
            sx={{ width: 40, height: 40 }}
          >
            <i className="ri-skip-back-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Slider
              value={(currentLine / Math.max(lyricsLines.length - 1, 1)) * 100}
              onChange={(_, value) => setCurrentLine(Math.round(((value as number) / 100) * Math.max(lyricsLines.length - 1, 1)))}
              min={0}
              max={100}
              sx={{
                height: 6,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16
                },
                '& .MuiSlider-track': {
                  bgcolor: 'text.primary'
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'grey.200'
                }
              }}
            />
          </Box>
          <IconButton 
            onClick={() => setCurrentLine(Math.min(lyricsLines.length - 1, currentLine + 1))}
            sx={{ width: 40, height: 40 }}
          >
            <i className="ri-skip-forward-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {currentLine + 1} / {lyricsLines.length}
          </Typography>
          <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
          <Typography variant="body2" color="text.secondary">
            {Math.round(scrollSpeed * 100)}% tốc độ
          </Typography>
        </Box>
      </Box>

      {/* Chord Detail Bottom Sheet */}
      <Dialog
        open={showChordDialog}
        onClose={() => setShowChordDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 0,
            maxWidth: 'none',
            maxHeight: '70vh',
            borderRadius: '20px 20px 0 0',
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Hợp Âm {selectedChord}
            </Typography>
            <IconButton 
              onClick={() => setShowChordDialog(false)}
              sx={{ width: 40, height: 40 }}
            >
              <i className="ri-close-line" style={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Bấm vào để xem chi tiết cách bấm hợp âm {selectedChord}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setShowChordDialog(false);
                navigate(`/chord/${selectedChord}`);
              }}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem'
              }}
              startIcon={<i className="ri-volume-up-line" style={{ fontSize: '1.25rem' }} />}
            >
              Xem Chi Tiết
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* Speed Control Dialog */}
      <Dialog
        open={showSpeedDialog}
        onClose={() => setShowSpeedDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            margin: 0,
            maxWidth: 'none',
            maxHeight: '50vh',
            borderRadius: '20px 20px 0 0',
            bgcolor: 'background.paper'
          }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tốc Độ Phát
            </Typography>
            <IconButton 
              onClick={() => setShowSpeedDialog(false)}
              sx={{ width: 40, height: 40 }}
            >
              <i className="ri-close-line" style={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              {Math.round(scrollSpeed * 100)}%
            </Typography>
            <Slider
              value={scrollSpeed}
              onChange={(_, value) => setScrollSpeed(value as number)}
              min={0.5}
              max={2.0}
              step={0.1}
              sx={{
                height: 8,
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20
                },
                '& .MuiSlider-track': {
                  bgcolor: 'text.primary'
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'grey.200'
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">Chậm</Typography>
              <Typography variant="body2" color="text.secondary">Nhanh</Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MusicPlayer;