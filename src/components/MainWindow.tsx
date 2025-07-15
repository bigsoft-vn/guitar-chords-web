import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import {
  MicRounded,
  MusicNoteRounded,
  PersonRounded,
} from '@mui/icons-material';
import { apiService, Song } from '../services/api';
import GuitarLoader from './GuitarLoader';

const MainWindow: React.FC = () => {
  const navigate = useNavigate();
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecentSongs = async () => {
      try {
        setLoading(true);
        setError(null);
        const songs = await apiService.getRecentSongs(3);
        setRecentSongs(songs || []);
      } catch (err) {
        console.error('Failed to load recent songs:', err);
        setError('Không thể tải danh sách bài hát gần đây');
        // Fallback to mock data
        setRecentSongs([
          { 
            id: 1, 
            title: 'Mưa Phi Trường', 
            artist: { id: 1, name: 'Hoàng Dũng' }, 
            lyrics: '',
            tempo: 80,
            difficulty: 'BEGINNER',
            playCount: 0,
            chords: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRecentSongs();
  }, []);

  const handleFamiliarSongs = () => {
    if (recentSongs && recentSongs.length > 0) {
      const randomSong = recentSongs[Math.floor(Math.random() * recentSongs.length)];
      if (randomSong?.id) {
        navigate(`/player/${randomSong.id}`);
      }
    } else {
      navigate('/search');
    }
  };

  const handleVoiceSearch = () => {
    navigate('/search');
  };

  const handleSongSelect = (songId: number) => {
    if (songId) {
      navigate(`/player/${songId}`);
    }
  };

  const chordProgressions = [
    { name: 'Canon', chords: 'C G Am Em F C F G', icon: MusicNoteRounded },
    { name: 'Pop Ballad', chords: 'G Em C D', icon: MusicNoteRounded },
    { name: 'Blues', chords: 'A D E A', icon: MusicNoteRounded },
    { name: 'Bolero', chords: 'Am Dm', icon: MusicNoteRounded },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      px: 2,
      py: 2
    }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#5865f2',
            fontWeight: 'bold',
            fontStyle: 'italic'
          }}
        >
          logo
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={<PersonRounded />}
            label="Trial: 3"
            sx={{
              backgroundColor: '#5865f2',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Avatar 
            sx={{ width: 40, height: 40 }}
            src="/api/placeholder/40/40"
          />
        </Box>
      </Box>

      {/* Main Action Cards */}
      <Box display="flex" gap={2} mb={4}>
        <Box flex={1}>
          <Card 
            onClick={handleVoiceSearch}
            sx={{
              background: 'linear-gradient(135deg, #5865f2 0%, #7289da 100%)',
              color: 'white',
              cursor: 'pointer',
              borderRadius: 3,
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <MicRounded sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h6" fontWeight="bold">
              Tìm Kiếm
            </Typography>
          </Card>
        </Box>
        
        <Box flex={1}>
          <Card 
            onClick={handleFamiliarSongs}
            sx={{
              backgroundColor: 'white',
              border: '2px solid #5865f2',
              cursor: 'pointer',
              borderRadius: 3,
              minHeight: 140,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#f0f0f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1
              }}
            >
              <MusicNoteRounded sx={{ fontSize: 30, color: '#5865f2' }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" color="#5865f2">
              Quen Thuộc
            </Typography>
          </Card>
        </Box>
      </Box>

      {/* Recent Songs Section */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="#333">
          Bài Gần Đây
        </Typography>
        
        {loading ? (
          <GuitarLoader message="Đang tải bài hát..." size="small" />
        ) : (
          <Box display="flex" gap={2}>
            {recentSongs && recentSongs.length > 0 ? (
              recentSongs.slice(0, 2).map((song, index) => (
                <Box flex={1} key={song.id}>
                  <Card 
                    onClick={() => handleSongSelect(song.id)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 120,
                        background: index === 0 
                          ? 'linear-gradient(45deg, #8B4513 30%, #D2691E 90%)'
                          : 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <MusicNoteRounded sx={{ fontSize: 40, color: 'white' }} />
                    </Box>
                    <CardContent sx={{ py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                        {song.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {song.artist?.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))
            ) : (
              <Box width="100%">
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  Chưa có bài hát nào gần đây
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Popular Chord Progressions */}
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={2} color="#333">
          Vòng Hợp Âm Phổ Biến
        </Typography>
        
        <Box display="flex" flexWrap="wrap" gap={2}>
          {chordProgressions.map((progression, index) => (
            <Box flex="1 1 calc(50% - 8px)" key={progression.name}>
              <Card 
                sx={{
                  borderRadius: 3,
                  backgroundColor: index === 3 ? '#5865f2' : '#f8f9fa',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: index === 3 ? 'rgba(255,255,255,0.2)' : '#e9ecef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1
                      }}
                    >
                      <MusicNoteRounded 
                        sx={{ 
                          fontSize: 16, 
                          color: index === 3 ? 'white' : '#5865f2' 
                        }} 
                      />
                    </Box>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight="bold"
                      color={index === 3 ? 'white' : '#333'}
                    >
                      {progression.name}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color={index === 3 ? 'rgba(255,255,255,0.8)' : 'text.secondary'}
                  >
                    {progression.chords}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Floating Action Button */}
      <IconButton
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#5865f2',
          color: 'white',
          width: 56,
          height: 56,
          '&:hover': {
            backgroundColor: '#4752c4'
          }
        }}
        onClick={handleVoiceSearch}
      >
        <MicRounded />
      </IconButton>
    </Box>
  );
};

export default MainWindow;