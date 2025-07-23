import { useRef, useEffect } from 'react';
import { getVideoStream } from '../api/video';
import { Box, Typography, Paper } from '@mui/material';

interface Props {
  cameraId: string;
  token: string;
}

export default function VideoStream({ cameraId, token }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wsUrl = getVideoStream(cameraId);
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
  }, [cameraId, token]);

  return (
    <Box
      mt={2}
      display="flex"
      justifyContent="center"
      width="100%"
    >
      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 6,
          boxShadow: 4,
          width: '100%',
          maxWidth: { xs: 700, md: 640 },
          mx: 'auto',
          bgcolor: '#181818',
          border: '2px solid #222',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2} color="grey.100">
          Video procesado cámara {cameraId}
        </Typography>
        <img
          ref={imgRef}
          alt="Video stream"
          style={{ width: '100%', maxWidth: 600, borderRadius: 12, border: '1px solid #333', background: '#111' }}
        />
      </Paper>
    </Box>
  );
}
