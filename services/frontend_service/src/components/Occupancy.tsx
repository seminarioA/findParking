import { useEffect, useState } from 'react';
  // Función para síntesis de voz con mensaje simplificado
  function speakAvailability(free: number) {
    const msg = free > 0 ? 'Sí, hay espacio disponible' : 'No, no hay espacio disponible';
    const utter = new window.SpeechSynthesisUtterance(msg);
    utter.voice = window.speechSynthesis.getVoices().find(voice => voice.name.includes('Google') && voice.name.includes('feminine')) || null;
    window.speechSynthesis.speak(utter);
  }
import { getOccupancy } from '../api/occupancy';
import { Box, Typography, Paper } from '@mui/material';

interface Props {
  cameraId: string;
  token: string;
  darkMode?: boolean;
}

export default function Occupancy(props: Props) {
  const { cameraId, token, darkMode } = props;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOccupancy(cameraId, token)
      .then(setData)
      .catch(() => setError('No se pudo obtener ocupación'));

    const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const wsUrl = wsProtocol + window.location.host + `/api/occupancy/${cameraId}/ws?token=Bearer%20${token}`;
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setData(newData);
      } catch (e) {
        setError('Error actualizando ocupación');
      }
    };
    ws.onerror = () => setError('Error de conexión WebSocket');
    return () => ws.close();
  }, [cameraId, token]);

  // Helper for summary color
  function getSummaryColor(free: number, dark: boolean) {
    if (free > 1) return dark ? 'info.light' : 'info.main';
    if (free === 1) return dark ? 'success.light' : 'success.main';
    return dark ? 'error.light' : 'error.main';
  }

  // Animated counter state
  const [animatedOccupied, setAnimatedOccupied] = useState(0);
  const [animatedFree, setAnimatedFree] = useState(0);

  useEffect(() => {
    if (!data) return;
    let frame: number;
    let startOccupied = animatedOccupied;
    let startFree = animatedFree;
    let endOccupied = data.summary.occupied;
    let endFree = data.summary.free;
    let duration = 500;
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setAnimatedOccupied(Math.round(startOccupied + (endOccupied - startOccupied) * progress));
      setAnimatedFree(Math.round(startFree + (endFree - startFree) * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [data]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>Cargando ocupación...</Typography>;

  return (
    <>
      {/* Isla con botón de voz de disponibilidad */}
      <Box
        sx={{
          bgcolor: darkMode ? 'grey.900' : 'grey.100',
          color: darkMode ? 'common.white' : 'grey.900',
          borderRadius: 6,
          boxShadow: 4,
          p: 2,
          textAlign: 'center',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          maxWidth: { xs: 700, md: 1200 },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Escucha la disponibilidad de espacios
        </Typography>
        <button
          onClick={() => speakAvailability(data.summary.free)}
          style={{
            background: darkMode ? '#1976d2' : '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 99,
            fontWeight: 700,
            fontSize: 18,
            padding: '10px 32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            cursor: 'pointer',
          }}
        >
          🔊 Escuchar disponibilidad
        </button>
      </Box>

      {/* Isla: Resumen de ocupación */}
      <Box
        sx={{
          bgcolor: darkMode ? 'grey.900' : 'grey.100',
          color: darkMode ? 'common.white' : 'grey.900',
          borderRadius: 6,
          boxShadow: 4,
          p: 2,
          textAlign: 'center',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          width: '100%',
          maxWidth: { xs: 700, md: 1200 },
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Flash Info
        </Typography>
        <Box display="flex" alignItems="center" gap={4} flexWrap="wrap" justifyContent="center" width="100%">
          <Box display="flex" flexDirection="column" alignItems="center" mx={2} minWidth={80}>
            <Typography variant="h3" fontWeight={800} color={getSummaryColor(data.summary.free, !!darkMode)}>
              {animatedFree}
            </Typography>
            <Typography variant="body1" fontWeight={600} color={darkMode ? 'grey.300' : 'grey.700'} sx={{ whiteSpace: 'nowrap', fontSize: { xs: 16, sm: 18, md: 20 } }}>
              Libres
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} color={darkMode ? 'grey.500' : 'grey.700'}>/</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mx={2} minWidth={80}>
            <Typography variant="h3" fontWeight={800} color={darkMode ? 'error.main' : 'error.dark'}>
              {animatedOccupied}
            </Typography>
            <Typography variant="body1" fontWeight={600} color={darkMode ? 'grey.300' : 'grey.700'} sx={{ whiteSpace: 'nowrap', fontSize: { xs: 16, sm: 18, md: 20 } }}>
              Ocupados
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Grilla de ocupación */}
      <Box mt={2}
        sx={{
          bgcolor: darkMode ? 'grey.900' : 'grey.100',
          color: darkMode ? 'common.white' : 'grey.900',
          borderRadius: 6,
          boxShadow: 4,
          p: 3,
          textAlign: 'center',
          width: '100%',
          maxWidth: { xs: 700, md: 1200 },
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>Ocupación cámara {cameraId}</Typography>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
          gap={1}
          mt={1}
        >
          {Object.entries(data.areas).map(([area, value]) => (
            <Paper
              key={area as string}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: value ? 'error.dark' : 'success.dark',
                color: 'common.white',
                borderRadius: 4,
                boxShadow: 3,
                minWidth: 120,
                gap: 2,
                fontWeight: 600,
                fontSize: 18
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                {value ? (
                  <svg width="24" height="24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                    <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.2" />
                    <path d="M12 7v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="2" fill="#fff" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
                    <circle cx="12" cy="12" r="10" fill="#fff" opacity="0.2" />
                    <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
                <Typography variant="body1" fontWeight={700} sx={{ whiteSpace: 'nowrap', fontSize: { xs: 16, sm: 17, md: 18 }, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: 80, sm: 100, md: 120 } }}>
                  {area}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={700} sx={{ whiteSpace: 'nowrap', fontSize: { xs: 16, sm: 17, md: 18 }, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: { xs: 80, sm: 100, md: 120 } }}>
                {value ? 'Ocupado' : 'Libre'}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
