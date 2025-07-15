import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  IconButton,
} from '@mui/material';
import {
  MicRounded,
  KeyboardRounded,
  ArrowBackRounded,
  StopRounded,
} from '@mui/icons-material';

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
    { id: '1', title: 'Mưa Phi Trường', artist: 'Hoàng Dũng', type: 'song', matchPercentage: 95, chords: ['Am', 'Dm', 'G', 'C'] },
    { id: '2', title: 'Vòng hợp âm Canon', artist: 'Playlist', type: 'artist', matchPercentage: 88, chords: ['C', 'Am', 'F', 'G'] },
    { id: 'chord-g', title: 'Hợp âm G', artist: 'Hướng dẫn', type: 'chord', matchPercentage: 92 },
    { id: '3', title: 'Nơi Này Có Anh', artist: 'Sơn Tùng M-TP', type: 'song', matchPercentage: 78, chords: ['C', 'Am', 'F', 'G'] },
  ];

  useEffect(() => {
    if (isListening) {
      setTimeout(() => {
        setIsListening(false);
        setSearchText('mưa phi trường');
        handleSearch('mưa phi trường');
      }, 3000);
    }
  }, [isListening]);

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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackRounded />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Tìm kiếm
          </Typography>
        </Box>

        <Card sx={{ p: 3 }}>
          <Box display="flex" flexDirection="column" gap={3} alignItems="center">
            {!showTextInput && (
              <>
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    {isListening ? 'Đang nghe...' : 'Tìm kiếm bằng giọng nói'}
                  </Typography>
                  {isListening && (
                    <Typography variant="body2" color="text.secondary">
                      Hãy nói tên bài hát, ca sĩ, hoặc hợp âm
                    </Typography>
                  )}
                </Box>

                <Box>
                  {!isListening ? (
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<MicRounded />}
                      onClick={handleVoiceSearch}
                      sx={{ borderRadius: '50px', px: 4, py: 2 }}
                    >
                      Bắt đầu
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<StopRounded />}
                      onClick={handleStopListening}
                      sx={{ borderRadius: '50px', px: 4, py: 2 }}
                    >
                      Dừng
                    </Button>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<KeyboardRounded />}
                  onClick={() => setShowTextInput(true)}
                >
                  Nhập text
                </Button>
              </>
            )}

            {showTextInput && (
              <Box width="100%" display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  label="Tìm kiếm bài hát, ca sĩ, hợp âm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchText)}
                />
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleSearch(searchText)}
                    disabled={!searchText.trim()}
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowTextInput(false)}
                  >
                    Quay lại
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Card>

        {(isSearching || searchResults.length > 0) && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kết quả tìm kiếm
              </Typography>
              
              {isSearching ? (
                <Typography>Đang tìm kiếm...</Typography>
              ) : (
                <List disablePadding>
                  {searchResults.map((result) => (
                    <ListItem key={result.id} disablePadding>
                      <ListItemButton onClick={() => handleResultSelect(result)}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              {result.title}
                              <Chip
                                label={`${result.matchPercentage}%`}
                                size="small"
                                color={result.matchPercentage > 90 ? 'success' : 'default'}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {result.artist}
                              </Typography>
                              {result.chords && (
                                <Typography variant="body2" color="primary">
                                  {result.chords.join(' - ')}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default SearchWindow;