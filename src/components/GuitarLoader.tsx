import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const strumAnimation = keyframes`
  0% { transform: rotate(-10deg); }
  25% { transform: rotate(5deg); }
  50% { transform: rotate(-5deg); }
  75% { transform: rotate(3deg); }
  100% { transform: rotate(0deg); }
`;

const noteFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
  25% { transform: translateY(-10px) rotate(5deg); opacity: 1; }
  50% { transform: translateY(-15px) rotate(-3deg); opacity: 0.8; }
  75% { transform: translateY(-8px) rotate(2deg); opacity: 0.9; }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

interface GuitarLoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const GuitarLoader: React.FC<GuitarLoaderProps> = ({ 
  message = "Đang tải...", 
  size = 'medium' 
}) => {
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 80, fontSize: '0.875rem' };
      case 'large':
        return { width: 120, height: 160, fontSize: '1.25rem' };
      default:
        return { width: 80, height: 120, fontSize: '1rem' };
    }
  };

  const config = getSizeConfig();

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      gap={2}
      py={3}
    >
      <Box position="relative" width={config.width} height={config.height}>
        {/* Guitar Body */}
        <Box
          sx={{
            width: config.width * 0.6,
            height: config.height * 0.4,
            backgroundColor: '#8B4513',
            borderRadius: '50%',
            position: 'absolute',
            top: '60%',
            left: '20%',
            border: '2px solid #654321',
            animation: `${strumAnimation} 2s ease-in-out infinite`,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '30%',
              left: '30%',
              width: '40%',
              height: '40%',
              backgroundColor: '#000',
              borderRadius: '50%',
            }
          }}
        />
        
        {/* Guitar Neck */}
        <Box
          sx={{
            width: config.width * 0.15,
            height: config.height * 0.6,
            backgroundColor: '#DEB887',
            position: 'absolute',
            top: 0,
            left: '42.5%',
            border: '1px solid #CD853F',
            borderRadius: '4px',
          }}
        />

        {/* Guitar Strings */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: '1px',
              height: config.height * 0.6,
              backgroundColor: '#C0C0C0',
              position: 'absolute',
              top: 0,
              left: `${40 + i * 2.5}%`,
              animation: `${fadeInOut} ${1.5 + i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Floating Music Notes */}
        {['♪', '♫', '♪', '♬'].map((note, i) => (
          <Typography
            key={i}
            sx={{
              position: 'absolute',
              color: '#1976d2',
              fontSize: config.width * 0.2,
              fontWeight: 'bold',
              top: `${10 + i * 15}%`,
              right: `${-10 - i * 5}%`,
              animation: `${noteFloat} ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {note}
          </Typography>
        ))}

        {/* Guitar Head */}
        <Box
          sx={{
            width: config.width * 0.25,
            height: config.height * 0.12,
            backgroundColor: '#654321',
            position: 'absolute',
            top: '-2%',
            left: '37.5%',
            borderRadius: '4px 4px 0 0',
          }}
        />
      </Box>

      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: config.fontSize,
          animation: `${fadeInOut} 1.5s ease-in-out infinite`,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default GuitarLoader;