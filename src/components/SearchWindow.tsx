import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  IconButton,
  InputAdornment,
} from '@mui/material';

interface SearchResult {
  id: string;
  title: string;
  artist?: string;
  type: 'song' | 'chord' | 'artist';
  matchPercentage: number;
  chords?: string[];
}

const SearchWindow: React.FC = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockResults: SearchResult[] = [
    { id: '1', title: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP', type: 'song', matchPercentage: 95, chords: ['C', 'G', 'Am', 'Em'] },
    { id: '2', title: 'Có Chắc Yêu Là Đây', artist: 'Sơn Tùng M-TP', type: 'song', matchPercentage: 88, chords: ['G', 'Em', 'C', 'D'] },
    { id: 'chord-c', title: 'Canon in D', artist: 'Chord Progression', type: 'chord', matchPercentage: 92 },
    { id: '3', title: 'Sơn Tùng M-TP', artist: 'Ca sĩ', type: 'artist', matchPercentage: 85 },
  ];

  useEffect(() => {
    if (isListening) {
      setTimeout(() => {
        setIsListening(false);
        setSearchText('nơi này có anh');
        handleSearch('nơi này có anh');
      }, 3000);
    }
  }, [isListening]);

  useEffect(() => {
    // Show default search results on component mount
    if (searchText === '') {
      setSearchResults(mockResults);
    }
  }, []);

  const handleVoiceSearch = () => {
    setIsListening(true);
    setSearchText('');
    setSearchResults([]);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        (result.artist && result.artist.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered);
      setIsSearching(false);

      const highMatch = filtered.find(result => result.matchPercentage > 90);
      if (highMatch) {
        setTimeout(() => {
          if (highMatch.type === 'chord') {
            navigate(`/chord/${highMatch.title.replace('Hợp âm ', '')}`);
          } else {
            navigate(`/player/${highMatch.id}`);
          }
        }, 1000);
      }
    }, 1000);
  };

  const handleResultSelect = (result: SearchResult) => {
    if (result.type === 'chord') {
      navigate(`/chord/${result.title.replace('Hợp âm ', '')}`);
    } else {
      navigate(`/player/${result.id}`);
    }
  };

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
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ width: 32, height: 32 }}
          >
            <i className="ri-arrow-left-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
          
          <Box sx={{ flex: 1, mx: 1 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm bài hát, nghệ sĩ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchText)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="ri-search-line" style={{ color: '#6B7280' }} />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }}
            />
          </Box>
          
          <IconButton 
            onClick={() => setShowTextInput(!showTextInput)}
            sx={{ 
              width: 32, 
              height: 32,
              color: showTextInput ? 'primary.main' : 'text.secondary'
            }}
          >
            <i className="ri-mic-line" style={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Voice Search UI */}
      <Box sx={{ pt: '4rem', px: 2, pb: 10 }}>
        {showTextInput && (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 6
          }}>
            {/* Waveform Animation */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '3.75rem',
              mb: 2
            }}>
              {[40, 64, 96, 128, 160, 128, 96, 64, 40].map((height, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '4px',
                    height: `${height / 4}px`,
                    bgcolor: 'primary.main',
                    borderRadius: '2px',
                    mx: '2px',
                    animation: isListening ? 'pulse 1s infinite' : 'none',
                    animationDelay: `${index * 0.1}s`,
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 0.3 },
                      '50%': { opacity: 1 }
                    }
                  }}
                />
              ))}
            </Box>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {isListening ? 'Đang lắng nghe...' : 'Nhấn để tìm kiếm bằng giọng nói'}
            </Typography>
            
            <Button
              variant={isListening ? 'outlined' : 'contained'}
              onClick={isListening ? handleStopListening : handleVoiceSearch}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500
              }}
              startIcon={
                <i className={isListening ? "ri-close-line" : "ri-mic-line"} style={{ fontSize: '1.25rem' }} />
              }
            >
              {isListening ? 'Huỷ' : 'Bắt đầu'}
            </Button>
          </Box>
        )}

        {/* Search Results */}
        {(isSearching || searchResults.length > 0 || (!showTextInput && searchText)) && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1.125rem', fontWeight: 600 }}>
              Kết Quả Tìm Kiếm
            </Typography>
            
            {isSearching ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Đang tìm kiếm...
                </Typography>
              </Box>
            ) : (
              <>
                {/* Songs */}
                {searchResults.filter(r => r.type === 'song').length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Bài Hát
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {searchResults.filter(r => r.type === 'song').map((result) => (
                        <Card
                          key={result.id}
                          onClick={() => handleResultSelect(result)}
                          sx={{
                            cursor: 'pointer',
                            p: 1.5,
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 2
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 48, 
                              height: 48,
                              borderRadius: 2,
                              overflow: 'hidden',
                              mr: 1.5
                            }}>
                              <img 
                                src={`https://readdy.ai/api/search-image?query=acoustic%20guitar%20with%20sheet%20music%2C%20warm%20lighting%2C%20music%20theme&width=48&height=48&seq=${parseInt(result.id) + 5}&orientation=squarish`}
                                alt={result.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ fontWeight: 500, fontSize: '0.875rem', mb: 0.25 }}
                              >
                                {result.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                {result.artist}
                              </Typography>
                            </Box>
                            <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="ri-play-circle-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Chord Progressions */}
                {searchResults.filter(r => r.type === 'chord').length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Vòng Hợp Âm
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {searchResults.filter(r => r.type === 'chord').map((result) => (
                        <Card
                          key={result.id}
                          onClick={() => handleResultSelect(result)}
                          sx={{
                            cursor: 'pointer',
                            p: 1.5,
                            transition: 'all 0.2s',
                            '&:hover': {
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
                              color: 'primary.main',
                              mr: 1.5
                            }}>
                              <i className="ri-music-2-line" style={{ fontSize: '1.25rem' }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ fontWeight: 500, fontSize: '0.875rem', mb: 0.25 }}
                              >
                                {result.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                {result.chords?.join(' ')}
                              </Typography>
                            </Box>
                            <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="ri-play-circle-line" style={{ fontSize: '1.25rem', color: '#4F46E5' }} />
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Artists */}
                {searchResults.filter(r => r.type === 'artist').length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Ca Sĩ
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {searchResults.filter(r => r.type === 'artist').map((result) => (
                        <Card
                          key={result.id}
                          onClick={() => handleResultSelect(result)}
                          sx={{
                            cursor: 'pointer',
                            p: 1.5,
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: 2
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ 
                              width: 48, 
                              height: 48,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              mr: 1.5
                            }}>
                              <img 
                                src="https://readdy.ai/api/search-image?query=young%20vietnamese%20male%20singer%2C%20professional%20portrait%2C%20neutral%20expression%2C%20isolated%20on%20light%20background&width=48&height=48&seq=8&orientation=squarish"
                                alt={result.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ fontWeight: 500, fontSize: '0.875rem', mb: 0.25 }}
                              >
                                {result.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                {result.artist}
                              </Typography>
                            </Box>
                            <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="ri-arrow-right-s-line" style={{ fontSize: '1.25rem', color: '#9CA3AF' }} />
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchWindow;