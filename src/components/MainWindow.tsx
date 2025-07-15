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
  Button,
  Fab,
} from '@mui/material';
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
            title: 'Nơi Này Có Anh', 
            artist: { id: 1, name: 'Sơn Tùng M-TP' }, 
            lyrics: '',
            tempo: 80,
            difficulty: 'BEGINNER',
            playCount: 0,
            chords: []
          },
          { 
            id: 2, 
            title: 'Chạy Ngay Đi', 
            artist: { id: 1, name: 'Sơn Tùng M-TP' }, 
            lyrics: '',
            tempo: 90,
            difficulty: 'INTERMEDIATE',
            playCount: 0,
            chords: []
          },
          { 
            id: 3, 
            title: 'Có Chắc Yêu Là Đây', 
            artist: { id: 1, name: 'Sơn Tùng M-TP' }, 
            lyrics: '',
            tempo: 85,
            difficulty: 'BEGINNER',
            playCount: 0,
            chords: []
          },
          { 
            id: 4, 
            title: 'Hãy Trao Cho Anh', 
            artist: { id: 1, name: 'Sơn Tùng M-TP' }, 
            lyrics: '',
            tempo: 95,
            difficulty: 'INTERMEDIATE',
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
    { name: 'Canon', chords: 'C G Am Em F C F G' },
    { name: 'Pop Ballad', chords: 'G Em C D' },
    { name: 'Blues', chords: 'A D E A' },
    { name: 'Bolero', chords: 'Am Dm G C' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', position: 'relative' }}>
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
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'Pacifico, cursive',
              color: 'primary.main',
              fontSize: '1.5rem'
            }}
          >
            logo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label="Trial: 3"
              icon={<i className="ri-vip-crown-fill" style={{ fontSize: '1rem' }} />}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontSize: '0.75rem',
                px: 1,
                '& .MuiChip-icon': {
                  color: 'white',
                  ml: 0.5
                }
              }}
            />
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'grey.100'
              }}
            >
              <img 
                src="https://readdy.ai/api/search-image?query=young%20vietnamese%20man%20with%20glasses%2C%20minimalist%20portrait%2C%20professional%20headshot%2C%20neutral%20expression%2C%20isolated%20on%20light%20background&width=80&height=80&seq=1&orientation=squarish" 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Avatar>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ pt: '4rem', px: 2, pb: 10 }}>
        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 6,
          px: 2,
          gap: 2
        }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleVoiceSearch}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              py: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            <Box sx={{
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              mb: 1
            }}>
              <i className="ri-mic-line" style={{ fontSize: '2rem' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={500}>
              Tìm Kiếm
            </Typography>
          </Button>
          
          <Button
            variant="outlined"
            fullWidth
            onClick={handleFamiliarSongs}
            sx={{
              borderColor: 'primary.main',
              borderWidth: 2,
              color: 'primary.main',
              py: 3,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'none',
              '&:hover': {
                borderWidth: 2,
                borderColor: 'primary.main',
                bgcolor: 'primary.main',
                color: 'white',
                '& .icon-bg': {
                  bgcolor: 'rgba(255,255,255,0.2)'
                }
              }
            }}
          >
            <Box 
              className="icon-bg"
              sx={{
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(79,70,229,0.1)',
                borderRadius: '50%',
                mb: 1,
                transition: 'all 0.3s'
              }}
            >
              <i className="ri-music-2-line" style={{ fontSize: '2rem' }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={500}>
              Quen Thuộc
            </Typography>
          </Button>
        </Box>


        {/* Recent Songs */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.125rem', fontWeight: 600 }}>
            Bài Gần Đây
          </Typography>
          
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Đang tải...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              overflowX: 'auto',
              pb: 2,
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}>
              <Box sx={{ display: 'flex', gap: 1.5, width: 'max-content' }}>
                {recentSongs && recentSongs.length > 0 ? (
                  recentSongs.map((song, index) => (
                    <Card
                      key={song.id}
                      onClick={() => handleSongSelect(song.id)}
                      sx={{
                        width: '10rem',
                        flexShrink: 0,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Box sx={{ 
                        height: '8rem',
                        overflow: 'hidden',
                        bgcolor: 'grey.100'
                      }}>
                        <img 
                          src={`https://readdy.ai/api/search-image?query=acoustic%20guitar%20with%20sheet%20music%20in%20warm%20lighting%2C%20artistic%20composition%2C%20music%20theme%2C%20soft%20focus&width=160&height=128&seq=${index + 2}&orientation=landscape`}
                          alt={song.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      <Box sx={{ p: 1.5 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {song.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {song.artist?.name}
                        </Typography>
                      </Box>
                    </Card>
                  ))
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', width: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      Chưa có bài hát nào gần đây
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* Chord Progressions */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1.5, fontSize: '1.125rem', fontWeight: 600 }}>
            Vòng Hợp Âm Phổ Biến
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {chordProgressions.map((progression, index) => (
              <Card 
                key={progression.name}
                onClick={() => navigate(`/chord/${progression.name}`)}
                sx={{
                  cursor: 'pointer',
                  p: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(79,70,229,0.1)',
                    borderRadius: 2,
                    color: 'primary.main'
                  }}>
                    <i className="ri-music-2-line" style={{ fontSize: '1.25rem' }} />
                  </Box>
                  <Box sx={{ ml: 1.5 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        mb: 0.25
                      }}
                    >
                      {progression.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.75rem'
                      }}
                    >
                      {progression.chords}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
      
      {/* Floating Search Button */}
      <Fab
        color="primary"
        onClick={handleVoiceSearch}
        sx={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          width: 56,
          height: 56,
          boxShadow: 3
        }}
      >
        <i className="ri-search-2-fill" style={{ fontSize: '1.5rem' }} />
      </Fab>
    </Box>
  );
};

export default MainWindow;