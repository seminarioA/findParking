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
              sx={{ p: 1, textAlign: 'center', bgcolor: value ? 'error.dark' : 'success.dark', color: 'common.white' }}
            >
              {area}: {value ? 'Ocupado' : 'Libre'}
            </Paper>
          ))}
        </Box>
      </Box>
    </>
  );
}
