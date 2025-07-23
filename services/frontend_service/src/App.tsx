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
        <Box minHeight="100vh" bgcolor="background.default" display="flex" flexDirection="column">
          {/* Navbar superior */}
          <Box component="nav"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px={4}
            py={2}
            boxShadow={4}
            bgcolor={darkMode ? 'grey.900' : 'grey.100'}
            sx={{
              borderRadius: 99,
              border: `2px solid ${darkMode ? '#222' : '#bbb'}`,
              mx: 'auto',
              mt: 3,
              width: { xs: '95%', md: '80%' },
              maxWidth: 700,
              minHeight: 64,
              position: 'relative',
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 2 }} color={darkMode ? 'common.white' : 'grey.900'}>
              FindParking
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              {/* Rol solo visible en md+ */}
              <Typography variant="subtitle2" sx={{ fontWeight: 600, display: { xs: 'none', md: 'block' } }} color={darkMode ? 'grey.300' : 'grey.700'}>
                {role ? `Rol: ${role.toUpperCase()}` : ''}
              </Typography>
              {/* Icono modo claro/oscuro, solo icono en xs */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: darkMode ? 'grey.800' : 'grey.200',
                  borderRadius: 99,
                  px: 2,
                  py: 1,
                  boxShadow: 2,
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onClick={() => setDarkMode(prev => !prev)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {darkMode ? (
                    <svg width="24" height="24" fill="currentColor"><path d="M12 3a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7 0-3.86 3.14-7 7-7v14z"/></svg>
                  ) : (
                    <svg width="24" height="24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8a7.007 7.007 0 0 0-1.99 4.34H2v2h2.35c.2 1.53.77 2.94 1.64 4.13l-1.79 1.8 1.41 1.41 1.8-1.79a7.007 7.007 0 0 0 4.34 1.99V22h2v-2.35a7.007 7.007 0 0 0 4.13-1.64l1.8 1.79 1.41-1.41-1.79-1.8a7.007 7.007 0 0 0 1.99-4.34H22v-2h-2.35a7.007 7.007 0 0 0-1.64-4.13l1.79-1.8-1.41-1.41-1.8 1.79A7.007 7.007 0 0 0 13.65 4.84V2h-2v2.35a7.007 7.007 0 0 0-4.13 1.64z"/></svg>
                  )}
                  <Typography variant="body2" sx={{ display: { xs: 'none', md: 'inline' }, ml: 1 }}>
                    {darkMode ? 'Modo claro' : 'Modo oscuro'}
                  </Typography>
                </Box>
              </Box>
              {/* Icono logout, solo icono en xs */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: darkMode ? 'grey.800' : 'grey.200',
                  borderRadius: 99,
                  px: 2,
                  py: 1,
                  boxShadow: 2,
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onClick={handleLogout}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <svg width="24" height="24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                  <Typography variant="body2" sx={{ display: { xs: 'none', md: 'inline' }, ml: 1 }}>
                    Cerrar sesión
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Contenido principal centrado y responsivo */}
          <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            {/* Selector de cámara arriba de la grilla */}
            <Box width="100%" display="flex" justifyContent="flex-end" mb={2}>
              <Select
                value={cameraId}
                onChange={e => setCameraId((e.target as HTMLInputElement).value)}
                sx={{ bgcolor: darkMode ? 'grey.800' : 'grey.200', color: darkMode ? 'common.white' : 'grey.900', borderRadius: 99, fontWeight: 600, minWidth: 120 }}
              >
                {CAMERAS.map(cam => (
                  <MenuItem key={cam} value={cam} sx={{ color: darkMode ? 'common.white' : 'grey.900', bgcolor: darkMode ? 'grey.900' : 'grey.100', borderRadius: 2 }}>
                    {cam}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {/* Resumen y grilla de ocupación */}
            <Box width="100%" display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'flex-start' }} justifyContent="space-between" gap={2} mb={3}>
              <Box flex={1}>
                <Occupancy cameraId={cameraId} token={token} darkMode={darkMode} />
              </Box>
            </Box>
            {/* Grilla de ocupación y video */}
            <Box width="100%" mt={2}>
              {(role === 'admin' || role === 'gestor') && (
                <VideoStream cameraId={cameraId} token={token} />
              )}
            </Box>
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;