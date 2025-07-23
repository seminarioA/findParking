import { useEffect, useState } from 'react';
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
    // Consulta inicial por REST
    getOccupancy(cameraId, token)
      .then(setData)
      .catch(() => setError('No se pudo obtener ocupación'));

    // WebSocket para actualizaciones en tiempo real
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

  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>Cargando ocupación...</Typography>;

  return (
    <>
      {/* Isla: Resumen de ocupación */}
      <Box
        sx={{
          bgcolor: darkMode ? 'primary.dark' : 'primary.light',
          color: 'common.white',
          borderRadius: 6,
          boxShadow: 4,
          p: 2,
          textAlign: 'center',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Flash Info
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
          {data.summary.free > 0
            ? <>
                <Typography variant="h5" fontWeight={600}>
                  {data.summary.occupied} / {data.summary.free}
                </Typography>
              </>
            : <>
                <Typography variant="h5" fontWeight={600}>
                  {data.summary.occupied} / {data.summary.free}
                </Typography>
              </>
          }
        </Box>
      </Box>
      {/* Grilla de ocupación */}
      <Box mt={2}>
        <Typography variant="h6">Ocupación cámara {cameraId}</Typography>
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
                  <svg width="24" height="24" fill="currentColor" style={{ verticalAlign: 'middle' }}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                ) : (
                  <svg width="24" height="24" fill="currentColor" style={{ verticalAlign: 'middle' }}><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/></svg>
                )}
                <Typography variant="body1" fontWeight={700}>
                  {area}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight={700}>
                {value ? 'Ocupado' : 'Libre'}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
