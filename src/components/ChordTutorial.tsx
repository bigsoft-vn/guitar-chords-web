import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
import { ArrowBackRounded } from '@mui/icons-material';

interface ChordInfo {
  name: string;
  positions: number[];
  fingers: number[];
  description: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  tips: string[];
}

interface ChordDiagramProps {
  positions: number[];
  fingers: number[];
  chordName: string;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ positions, fingers, chordName }) => {
  const strings = 6;
  const frets = 5;

  const getFingerColor = (finger: number) => {
    const colors = ['transparent', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    return colors[finger] || 'transparent';
  };

  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {chordName}
      </Typography>
      
      <Box sx={{ display: 'inline-block', position: 'relative' }}>
        <svg width="200" height="250" viewBox="0 0 200 250">
          {Array.from({ length: strings }, (_, string) => (
            <line
              key={`string-${string}`}
              x1={30 + string * 28}
              y1={30}
              x2={30 + string * 28}
              y2={230}
              stroke="#333"
              strokeWidth="2"
            />
          ))}
          
          {Array.from({ length: frets + 1 }, (_, fret) => (
            <line
              key={`fret-${fret}`}
              x1={30}
              y1={30 + fret * 40}
              x2={170}
              y2={30 + fret * 40}
              stroke="#333"
              strokeWidth={fret === 0 ? "4" : "1"}
            />
          ))}
          
          {positions.map((position, stringIndex) => {
            if (position === 0) {
              return (
                <text
                  key={`open-${stringIndex}`}
                  x={30 + stringIndex * 28}
                  y={20}
                  textAnchor="middle"
                  fontSize="16"
                  fill="#4CAF50"
                  fontWeight="bold"
                >
                  O
                </text>
              );
            }
            
            if (position === -1) {
              return (
                <text
                  key={`muted-${stringIndex}`}
                  x={30 + stringIndex * 28}
                  y={20}
                  textAnchor="middle"
                  fontSize="16"
                  fill="#F44336"
                  fontWeight="bold"
                >
                  X
                </text>
              );
            }
            
            return (
              <g key={`fret-${stringIndex}-${position}`}>
                <circle
                  cx={30 + stringIndex * 28}
                  cy={10 + position * 40}
                  r="12"
                  fill={getFingerColor(fingers[stringIndex])}
                  stroke="#333"
                  strokeWidth="2"
                />
                <text
                  x={30 + stringIndex * 28}
                  y={16 + position * 40}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="bold"
                >
                  {fingers[stringIndex]}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
      
      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          <strong>Chú thích:</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          O = Dây rỗng | X = Không bấm | Số = Ngón tay
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} mt={1} flexWrap="wrap">
          <Chip label="1: Ngón trỏ" size="small" sx={{ backgroundColor: '#FF6B6B', color: 'white' }} />
          <Chip label="2: Ngón giữa" size="small" sx={{ backgroundColor: '#4ECDC4', color: 'white' }} />
          <Chip label="3: Ngón áp út" size="small" sx={{ backgroundColor: '#45B7D1', color: 'white' }} />
          <Chip label="4: Ngón út" size="small" sx={{ backgroundColor: '#96CEB4', color: 'white' }} />
        </Box>
      </Box>
    </Paper>
  );
};

const ChordTutorial: React.FC = () => {
  const navigate = useNavigate();
  const { chordName } = useParams();

  const chordDatabase: Record<string, ChordInfo> = {
    'C': {
      name: 'C Major',
      positions: [0, 1, 0, 2, 3, 0],
      fingers: [0, 1, 0, 2, 3, 0],
      description: 'Hợp âm C Major là một trong những hợp âm cơ bản nhất trong guitar.',
      difficulty: 'Dễ',
      tips: [
        'Đặt ngón tay 1 ở phím 1 dây B',
        'Ngón tay 2 ở phím 2 dây D',
        'Ngón tay 3 ở phím 3 dây A',
        'Các dây E cao, G và E thấp để rỗng'
      ]
    },
    'Am': {
      name: 'A Minor',
      positions: [0, 1, 2, 2, 0, 0],
      fingers: [0, 1, 2, 3, 0, 0],
      description: 'Hợp âm Am (La thứ) là hợp âm minor cơ bản và dễ học.',
      difficulty: 'Dễ',
      tips: [
        'Ngón tay 1 ở phím 1 dây B',
        'Ngón tay 2 ở phím 2 dây D',
        'Ngón tay 3 ở phím 2 dây G',
        'Các dây E để rỗng, dây A để rỗng'
      ]
    },
    'F': {
      name: 'F Major',
      positions: [1, 1, 2, 3, 3, 1],
      fingers: [1, 1, 2, 3, 4, 1],
      description: 'Hợp âm F Major sử dụng kỹ thuật barré, khó hơn các hợp âm cơ bản.',
      difficulty: 'Khó',
      tips: [
        'Sử dụng ngón tay 1 để bấm barré tất cả dây ở phím 1',
        'Ngón tay 2 ở phím 2 dây G',
        'Ngón tay 3 ở phím 3 dây A',
        'Ngón tay 4 ở phím 3 dây D',
        'Cần luyện tập nhiều để có đủ lực bấm barré'
      ]
    },
    'G': {
      name: 'G Major',
      positions: [3, 0, 0, 0, 2, 3],
      fingers: [3, 0, 0, 0, 2, 4],
      description: 'Hợp âm G Major là hợp âm mở với âm thanh tươi sáng.',
      difficulty: 'Trung bình',
      tips: [
        'Ngón tay 2 ở phím 2 dây A',
        'Ngón tay 3 ở phím 3 dây E thấp',
        'Ngón tay 4 ở phím 3 dây E cao',
        'Các dây còn lại để rỗng'
      ]
    },
    'Dm': {
      name: 'D Minor',
      positions: [-1, 0, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      description: 'Hợp âm Dm (Rê thứ) có âm sắc buồn đặc trưng.',
      difficulty: 'Dễ',
      tips: [
        'Ngón tay 1 ở phím 1 dây E cao',
        'Ngón tay 2 ở phím 2 dây G',
        'Ngón tay 3 ở phím 3 dây B',
        'Dây E thấp không gảy (X)',
        'Dây D để rỗng'
      ]
    },
    'Em': {
      name: 'E Minor',
      positions: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
      description: 'Hợp âm Em là một trong những hợp âm dễ nhất để học.',
      difficulty: 'Dễ',
      tips: [
        'Ngón tay 2 ở phím 2 dây A',
        'Ngón tay 3 ở phím 2 dây D',
        'Tất cả các dây khác để rỗng',
        'Hợp âm rất đơn giản, chỉ cần 2 ngón tay'
      ]
    }
  };

  const chord = chordDatabase[chordName || 'C'] || chordDatabase['C'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'success';
      case 'Trung bình': return 'warning';
      case 'Khó': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" flexDirection="column" gap={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackRounded />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Hướng dẫn hợp âm
          </Typography>
        </Box>

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          <Box flex={1}>
            <ChordDiagram
              positions={chord.positions}
              fingers={chord.fingers}
              chordName={chord.name}
            />
          </Box>

          <Box flex={1}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Typography variant="h5" fontWeight="bold">
                    {chord.name}
                  </Typography>
                  <Chip
                    label={chord.difficulty}
                    color={getDifficultyColor(chord.difficulty) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body1" paragraph>
                  {chord.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Hướng dẫn bấm:
                </Typography>
                
                <Box component="ul" sx={{ pl: 2 }}>
                  {chord.tips.map((tip, index) => (
                    <Typography key={index} component="li" variant="body2" sx={{ mb: 1 }}>
                      {tip}
                    </Typography>
                  ))}
                </Box>

                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin kỹ thuật:
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Vị trí các ngón tay:</strong>
                    <br />
                    {chord.positions.map((pos, index) => (
                      <span key={index}>
                        Dây {6 - index}: {pos === -1 ? 'X' : pos === 0 ? 'Rỗng' : `Phím ${pos}`}
                        {index < chord.positions.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bài hát sử dụng hợp âm {chordName}:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip label="Mưa Phi Trường - Hoàng Dũng" onClick={() => navigate('/player/1')} clickable />
              <Chip label="Nơi Này Có Anh - Sơn Tùng M-TP" onClick={() => navigate('/player/2')} clickable />
              <Chip label="Đã Lỡ Yêu Em Nhiều - JustaTee" onClick={() => navigate('/player/3')} clickable />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ChordTutorial;