import { useState } from 'react';
import Login from './components/Login';
import Occupancy from './components/Occupancy';
import VideoStream from './components/VideoStream';
import { getRole } from './api/auth';
import {
  Container,
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';

const CAMERAS = ['entrada1']; // Puedes agregar más cámaras aquí

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [cameraId, setCameraId] = useState(CAMERAS[0]);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogin = async (newToken: string) => {
    setToken(newToken);
    try {
      const userRole = await getRole(newToken);
      setRole(userRole);
    } catch {
      setRole(null);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : createTheme({ palette: { mode: 'light' } })}>
      <CssBaseline />
      {!token ? (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
          <Login onLogin={handleLogin} />
        </Box>
      ) : (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
          <Container maxWidth="sm">
            <Box
              sx={{
                bgcolor: 'grey.900',
                color: 'common.white',
                borderRadius: 6,
                boxShadow: 6,
                p: 4,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                animation: 'fadein 1s',
                '@keyframes fadein': {
                  from: { opacity: 0 },
                  to: { opacity: 1 }
                }
              }}
            >
              <Typography variant="h3" fontWeight={700} mb={1} sx={{ letterSpacing: 2 }}>
                ¡Bienvenido a FindParking!
              </Typography>
              <Typography variant="subtitle1" mb={2} sx={{ color: 'grey.400' }}>
                {role ? `Rol: ${role.toUpperCase()}` : ''}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setDarkMode(prev => !prev)}
                sx={{ borderRadius: 3, fontWeight: 600, mb: 1 }}
              >
                {darkMode ? 'Modo claro' : 'Modo oscuro'}
              </Button>
              <Box display="flex" alignItems="center" gap={2} justifyContent="center" mb={2}>
                <Select
                  value={cameraId}
                  onChange={e => setCameraId((e.target as HTMLInputElement).value)}
                  sx={{ bgcolor: 'grey.800', color: 'common.white', borderRadius: 3, fontWeight: 600 }}
                >
                  {CAMERAS.map(cam => (
                    <MenuItem key={cam} value={cam} sx={{ color: 'common.white', bgcolor: 'grey.900', borderRadius: 2 }}>
                      {cam}
                    </MenuItem>
                  ))}
                </Select>
                <Button variant="outlined" color="error" onClick={handleLogout} sx={{ borderRadius: 3, fontWeight: 600 }}>
                  Cerrar sesión
                </Button>
              </Box>
              <Box width="100%" mt={2}>
                <Occupancy cameraId={cameraId} token={token} />
                {(role === 'admin' || role === 'gestor') && (
                  <VideoStream cameraId={cameraId} token={token} />
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;