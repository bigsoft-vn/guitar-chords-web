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
          <Box
            key={`chord-${index}`}
            component="span"
            onClick={() => handleChordClick(chordPos.chord)}
            sx={{
              display: 'inline-block',
              px: 1,
              py: 0.5,
              mx: 0.5,
              bgcolor: 'rgba(79,70,229,0.1)',
              color: 'primary.main',
              borderRadius: 2,
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { 
                bgcolor: 'primary.main',
                color: 'white'
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', position: 'relative' }}>
      {/* Nav Bar */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        width: '100%',
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        zIndex: 10
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          px: 2,
          py: 1.5
        }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ width: 32, height: 32 }}
          >
            <i className="ri-arrow-left-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {song.title}
          </Typography>
          <IconButton sx={{ width: 32, height: 32 }}>
            <i className="ri-more-2-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </Box>
      
      {/* Song Content */}
      <Box sx={{ pt: '4rem', px: 2, pb: '6rem' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {song.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {song.artist}
            </Typography>
          </Box>
        </Box>

        {/* Floating Control Buttons */}
        <Box sx={{ 
          position: 'fixed',
          right: '1rem',
          top: '5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          zIndex: 20
        }}>
          <Fab
            size="small"
            sx={{ 
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'grey.50' }
            }}
            onClick={() => setShowSpeedDialog(true)}
          >
            <i className="ri-speed-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
          </Fab>
          <Fab
            size="small"
            sx={{ 
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'grey.50' }
            }}
          >
            <i className="ri-contrast-2-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
          </Fab>
          <Fab
            size="small"
            sx={{ 
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'grey.50' }
            }}
          >
            <i className="ri-metronome-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
          </Fab>
          <Fab
            size="small"
            sx={{ 
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'grey.50' }
            }}
          >
            <i className="ri-heart-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
          </Fab>
          <Fab
            size="small"
            sx={{ 
              bgcolor: 'white',
              boxShadow: 3,
              '&:hover': { bgcolor: 'grey.50' }
            }}
          >
            <i className="ri-share-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
          </Fab>
        </Box>

        <Card sx={{ border: '1px solid', borderColor: 'grey.100', borderRadius: 2, p: 2, mb: 4 }}>
          <Box
            ref={scrollContainerRef}
            sx={{
              maxHeight: '60vh',
              overflow: 'auto',
              fontSize: '1rem',
              lineHeight: 1.8
            }}
          >
            {lyricsLines.map((line, index) => renderLineWithChords(line, index))}
          </Box>
        </Card>

      </Box>
      
      {/* Next Song Preview */}
      <Box sx={{ 
        position: 'fixed',
        bottom: '3.5rem',
        left: 0,
        width: '100%',
        bgcolor: 'white',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        px: 2,
        py: 1.5,
        zIndex: 10
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'grey.100',
              borderRadius: 2,
              overflow: 'hidden',
              mr: 1.5
            }}>
              <img 
                src="https://readdy.ai/api/search-image?query=acoustic%20guitar%20with%20sheet%20music%2C%20warm%20lighting%2C%20music%20theme&width=40&height=40&seq=9&orientation=squarish"
                alt="Next song"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                Chạy Ngay Đi
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Sơn Tùng M-TP
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ width: 32, height: 32 }}>
            <i className="ri-skip-forward-line" style={{ fontSize: '1.25rem', color: '#6B7280' }} />
          </IconButton>
        </Box>
      </Box>
      
      {/* Auto-scroll Control */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        bgcolor: 'white',
        borderTop: '1px solid',
        borderColor: 'grey.200',
        px: 2,
        py: 1,
        zIndex: 10
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton 
            onClick={() => setCurrentLine(Math.max(0, currentLine - 1))}
            sx={{ width: 32, height: 32 }}
          >
            <i className="ri-skip-back-line" style={{ fontSize: '1.25rem', color: '#6B7280' }} />
          </IconButton>
          <Box sx={{ flex: 1, mx: 2 }}>
            <Slider
              value={(currentLine / (lyricsLines.length - 1)) * 100}
              onChange={(_, value) => setCurrentLine(Math.round(((value as number) / 100) * (lyricsLines.length - 1)))}
              min={0}
              max={100}
              sx={{
                height: 8,
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16
                },
                '& .MuiSlider-track': {
                  bgcolor: 'primary.main'
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'grey.200'
                }
              }}
            />
          </Box>
          <IconButton 
            onClick={() => setCurrentLine(Math.min(lyricsLines.length - 1, currentLine + 1))}
            sx={{ width: 32, height: 32 }}
          >
            <i className="ri-skip-forward-line" style={{ fontSize: '1.25rem', color: '#6B7280' }} />
          </IconButton>
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
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Hợp Âm {selectedChord}
            </Typography>
            <IconButton 
              onClick={() => setShowChordDialog(false)}
              sx={{ width: 32, height: 32 }}
            >
              <i className="ri-close-line" style={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
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
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
              startIcon={<i className="ri-volume-up-line" style={{ fontSize: '1.25rem' }} />}
            >
              Nghe Âm Thanh
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
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }
        }}
      >
        <DialogContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tốc Độ Phát
            </Typography>
            <IconButton 
              onClick={() => setShowSpeedDialog(false)}
              sx={{ width: 32, height: 32 }}
            >
              <i className="ri-close-line" style={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
          
          <Box sx={{ mb: 3 }}>
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
                  bgcolor: 'primary.main'
                },
                '& .MuiSlider-rail': {
                  bgcolor: 'grey.200'
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MusicPlayer;