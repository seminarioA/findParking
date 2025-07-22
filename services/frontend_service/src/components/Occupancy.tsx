import { useEffect, useState } from 'react';
import { getOccupancy } from '../api/occupancy';
import { Box, Typography, Paper } from '@mui/material';

interface Props {
  cameraId: string;
  token: string;
}

export default function Occupancy({ cameraId, token }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOccupancy(cameraId, token)
      .then(setData)
      .catch(() => setError('No se pudo obtener ocupación'));
  }, [cameraId, token]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>Cargando ocupación...</Typography>;

  return (
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
      <Box mt={2}>
        <Typography>Resumen: {data.summary.occupied} ocupados, {data.summary.free} libres</Typography>
      </Box>
    </Box>
  );
}
