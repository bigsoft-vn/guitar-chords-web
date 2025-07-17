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
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0E0D11 0%, #1C1C1E 100%)',
      position: 'relative' 
    }}>
      {/* Nav Bar */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        py: 2
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 800,
            color: 'text.primary',
            fontSize: '1.75rem',
            letterSpacing: '-0.025em'
          }}
        >
          Guitar Chords
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton size="small">
            <i className="ri-add-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
          <IconButton size="small">
            <i className="ri-add-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 2, pb: 4 }}>
        {/* Action Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          mt: 2
        }}>
          <Card
            onClick={handleVoiceSearch}
            sx={{
              cursor: 'pointer',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '1',
            }}
          >
            <Box sx={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(79,70,229,0.1)',
              borderRadius: 2,
              color: 'primary.main',
              flexShrink: 0
            }}>
              <i className="ri-search-line" style={{ fontSize: '1.25rem' }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'left', fontSize: '1.125rem', lineHeight: 1.2, mb: 1 }}>
                Tìm kiếm
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'left', fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.2 }}>
                Tên hoặc lời bài hát
              </Typography>
            </Box>
          </Card>

          <Card
            onClick={handleFamiliarSongs}
            sx={{
              cursor: 'pointer',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '1',
            }}
          >
            <Box sx={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(79,70,229,0.1)',
              borderRadius: 2,
              color: 'primary.main',
              flexShrink: 0
            }}>
              <i className="ri-play-circle-line" style={{ fontSize: '1.25rem' }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'left', fontSize: '1.125rem', lineHeight: 1.2, mb: 1 }}>
                Ngẫu nhiên
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'left', fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.2 }}>
                Danh sách yêu thích
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Recent Songs */}
        <Card sx={{ 
          mt: 2,
          p: 2,
          aspectRatio: '2 / 1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'left', fontSize: '1.125rem', lineHeight: 1.2 }}>
              Bài hát gần đây
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Đang tải...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}>
              {recentSongs && recentSongs.length > 0 ? (
                recentSongs.slice(0, 2).map((song, index) => (
                  <Box
                    key={song.id}
                    onClick={() => handleSongSelect(song.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      p: 0,
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'grey.50',
                        transform: 'translateY(-1px)'
                      }
                    }}
                  >
                    <Box sx={{ 
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      overflow: 'hidden',
                      bgcolor: 'rgba(79,70,229,0.1)',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main'
                    }}>
                      <i className="ri-music-line" style={{ fontSize: '1.25rem' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 400,
                          fontSize: '1rem',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.2,
                          color: 'white'
                        }}
                      >
                        {song.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontSize: '0.875rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: 1.2
                        }}
                      >
                        {song.artist?.name}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có bài hát nào gần đây
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Card>

        {/* Chord Progressions */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {chordProgressions.map((progression, index) => (
              <Card 
                key={progression.name}
                onClick={() => navigate(`/chord/${progression.name}`)}
                sx={{
                  cursor: 'pointer',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2
                  }
                }}
              >
                <Box sx={{
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(79,70,229,0.1)',
                  borderRadius: 2,
                  color: 'primary.main',
                  flexShrink: 0
                }}>
                  <i className="ri-music-2-line" style={{ fontSize: '1.25rem' }} />
                </Box>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 700, textAlign: 'left', fontSize: '1.125rem', lineHeight: 1.2, mb: 1 }}>
                    {progression.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 400, textAlign: 'left', fontSize: '0.875rem', color: 'text.secondary', lineHeight: 1.2 }}>
                    {progression.chords}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
      
    </Box>
  );
};

export default MainWindow;