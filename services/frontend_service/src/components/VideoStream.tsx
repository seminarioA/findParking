import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';

interface Props {
  cameraId: string;
  token: string;
  darkMode: boolean;
}

export default function VideoStream({ cameraId, token, darkMode }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [mode, setMode] = useState<'processed' | 'original'>('processed');
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const wsUrl = `/api/video/${cameraId}/${mode === 'original' ? 'raw' : 'processed'}`;
    const ws = new window.WebSocket(wsUrl, token);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => {
      console.log('WebSocket abierto:', wsUrl);
    };
    ws.onclose = (event) => {
      console.warn('WebSocket cerrado:', event.code, event.reason);
    };
    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
    ws.onmessage = (event) => {
      if (imgRef.current && event.data instanceof ArrayBuffer) {
        const blob = new Blob([event.data], { type: 'image/jpeg' });
        imgRef.current.src = URL.createObjectURL(blob);
      }
    };
    return () => ws.close();
  }, [cameraId, token, mode]);

  return (
    <Box
      mt={maximized ? 0 : 2}
      display="flex"
      justifyContent="center"
      width={maximized ? '100vw' : '100%'}
      sx={{
        position: maximized ? 'fixed' : 'static',
        top: maximized ? 0 : 'auto',
        left: maximized ? 0 : 'auto',
        zIndex: maximized ? 3000 : 'auto',
        bgcolor: maximized ? (darkMode ? 'grey.900' : 'grey.100') : 'transparent',
        height: maximized ? '100vh' : 'auto',
        width: maximized ? '100vw' : '100%',
        m: maximized ? 0 : undefined,
        p: maximized ? 0 : undefined,
        overflow: maximized ? 'hidden' : 'visible',
        boxShadow: maximized ? 8 : undefined,
        border: maximized ? `2px solid ${darkMode ? '#222' : '#bbb'}` : undefined,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: maximized ? 0 : 3,
          borderRadius: maximized ? 0 : 6,
          boxShadow: 4,
          width: '100%',
          maxWidth: maximized ? '100vw' : { xs: 700, md: 1200 },
          mx: 'auto',
          bgcolor: darkMode ? 'grey.900' : 'grey.100',
          border: `2px solid ${darkMode ? '#222' : '#bbb'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: maximized ? '100vh' : 'auto',
          justifyContent: maximized ? 'center' : 'flex-start',
          position: 'relative',
        }}
      >
        {/* Selector de cámara removido, ahora solo en App.tsx */}
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            textAlign: 'center',
            mb: 2, // Consistent spacing with other elements
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            color={darkMode ? 'grey.100' : 'grey.900'}
            sx={{ mb: 2 }}
          >
            Video procesado cámara entrada
          </Typography>
          <img
            ref={imgRef}
            alt="Video stream"
            style={{
              width: maximized ? '100vw' : '100%',
              maxWidth: maximized ? '100vw' : 900,
              height: maximized ? '80vh' : 'auto',
              borderRadius: maximized ? 0 : 12,
              border: `1px solid ${darkMode ? '#333' : '#bbb'}`,
              background: darkMode ? '#111' : '#fff',
              objectFit: maximized ? 'contain' : 'cover',
            }}
          />
        </Box>
        <Box
          display={maximized ? 'flex' : 'flex'}
          gap={2}
          mt={maximized ? 0 : 3}
          flexWrap={maximized ? 'wrap' : 'wrap'}
          justifyContent={maximized ? 'center' : 'center'}
          alignItems={maximized ? 'flex-end' : 'center'}
          sx={
            maximized
              ? {
                  position: 'absolute',
                  bottom: 24,
                  left: 0,
                  right: 0,
                  zIndex: 3100,
                  width: '100%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: 2,
                }
              : {}
          }
        >
          <Button
            variant="contained"
            color={mode === 'processed' ? 'success' : 'info'}
            onClick={() => setMode(mode === 'processed' ? 'original' : 'processed')}
            sx={{ borderRadius: 99, fontWeight: 700, px: 3, py: 1.5, boxShadow: 3, gap: 1 }}
            startIcon={mode === 'processed' ? <VisibilityIcon /> : <VideoSettingsIcon />}
          >
            {mode === 'processed' ? 'Ver original' : 'Ver procesado'}
          </Button>
          {!maximized ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setMaximized(true)}
              sx={{ borderRadius: 99, fontWeight: 700, px: 3, py: 1.5, boxShadow: 3, gap: 1 }}
            >
              Maximizar
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setMaximized(false)}
              sx={{ borderRadius: 99, fontWeight: 700, px: 3, py: 1.5, boxShadow: 3, gap: 1, position: 'absolute', top: 16, right: 16 }}
            >
              Volver
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
