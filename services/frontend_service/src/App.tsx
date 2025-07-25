import { useState } from 'react';
import Login from './components/Login';
import Occupancy from './components/Occupancy';
import VideoStream from './components/VideoStream';
import Footer from './components/Footer';
import { getRole } from './api/auth';
import {
  Container,
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';

// const CAMERAS = ['entrada1'];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const cameraId = 'entrada1';
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
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
        <Box
          minHeight="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="background.default"
        >
          <Login onLogin={handleLogin} />
        </Box>
      ) : (
        <Box
          minHeight="100vh"
          bgcolor="background.default"
          display="flex"
          flexDirection="column"
          sx={{
            width: { xs: '98%', md: '90%', lg: '80%' },
            maxWidth: { xs: 700, md: 1200 },
            mx: 'auto',
            pb: 0 // Ensure no padding-bottom
          }}
        >

          {/* Navbar embebido */}
          <Box
            component="nav"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            p={3}
            boxShadow={4}
            bgcolor={darkMode ? 'grey.900' : 'grey.100'}
            sx={{
              borderRadius: 6,
              border: `2px solid ${darkMode ? '#222' : '#bbb'}`, // Reverted border visibility
              mt: 3, // Maintain spacing above navbar
              minHeight: 64,
              position: 'relative',
              width: '100%'
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ letterSpacing: 2 }}
              color={darkMode ? 'common.white' : 'grey.900'}
            >
              FindParking
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              {role && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    bgcolor: darkMode ? 'grey.800' : 'grey.200',
                    color: darkMode ? 'grey.100' : 'grey.900',
                    borderRadius: 99,
                    px: 2,
                    py: 1,
                    boxShadow: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    gap: 1.2,
                  }}
                >
                  <svg width="20" height="20" fill="currentColor" style={{ marginRight: 6 }}>
                    <path d="M10 2l7 3v5c0 5-3.5 9-7 9s-7-4-7-9V5l7-3z" fill={darkMode ? '#90caf9' : '#1976d2'} />
                  </svg>
                  {`Rol: ${role.toUpperCase()}`}
                </Box>
              )}

              {token && (
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    bgcolor: darkMode ? 'grey.800' : 'grey.200',
                    color: darkMode ? 'grey.100' : 'grey.900',
                    borderRadius: 99,
                    px: 2,
                    py: 1,
                    boxShadow: 2,
                    fontWeight: 700,
                    fontSize: 16,
                    gap: 1.2,
                  }}
                >
                  <svg width="20" height="20" fill="currentColor" style={{ marginRight: 6 }}>
                    <circle cx="10" cy="7" r="4" fill={darkMode ? '#ffb74d' : '#f57c00'} />
                    <ellipse cx="10" cy="15" rx="6" ry="3" fill={darkMode ? '#ffb74d' : '#f57c00'} />
                  </svg>
                  {(() => {
                    try {
                      const payload = JSON.parse(atob(token.split('.')[1]));
                      if (payload && payload.email) {
                        return payload.email.split('@')[0];
                      }
                    } catch { }
                    return 'Usuario';
                  })()}
                </Box>
              )}

              {/* Toggle Dark Mode */}
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
                    <svg width="24" height="24" fill="currentColor"><path d="M12 3a9 9 0 0 0 0 18c4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7 0-3.86 3.14-7 7-7v14z" /></svg>
                  ) : (
                    <svg width="24" height="24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8a7.007 7.007 0 0 0-1.99 4.34H2v2h2.35c.2 1.53.77 2.94 1.64 4.13l-1.79 1.8 1.41 1.41 1.8-1.79a7.007 7.007 0 0 0 4.34 1.99V22h2v-2.35a7.007 7.007 0 0 0 4.13-1.64l1.8 1.79 1.41-1.41-1.79-1.8a7.007 7.007 0 0 0 1.99-4.34H22v-2h-2.35a7.007 7.007 0 0 0-1.64-4.13l1.79-1.8-1.41-1.41-1.8 1.79A7.007 7.007 0 0 0 13.65 4.84V2h-2v2.35a7.007 7.007 0 0 0-4.13 1.64z" /></svg>
                  )}
                  <Typography variant="body2" sx={{ display: { xs: 'none', md: 'inline' }, ml: 1 }}>
                    {darkMode ? 'Modo claro' : 'Modo oscuro'}
                  </Typography>
                </Box>
              </Box>

              {/* Logout */}
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
                  <svg width="24" height="24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
                  <Typography variant="body2" sx={{ display: { xs: 'none', md: 'inline' }, ml: 1 }}>
                    Cerrar sesión
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Contenido principal */}
            <Container
              maxWidth={false}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 3, // Ensure sufficient spacing between navbar and content
                width: '100%'
              }}
            >
              <Box
                width="100%"
                display="flex"
                flexDirection={{ xs: 'column', lg: 'row' }}
                alignItems={{ xs: 'stretch', lg: 'flex-start' }}
                justifyContent="space-between"
                gap={2}
                mb={3}
                sx={{
                  p: 2 // Reverted border visibility
                }}
              >
                <Box flex={1}>
                  <Occupancy cameraId={cameraId} token={token} darkMode={darkMode} />
                </Box>
              </Box>

              {/* Selector de cámara eliminado, solo se usa la cámara por defecto */}

              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                sx={{ mb: 0 }} // Removed bottom margin
              >
                {(role === 'admin' || role === 'gestor') && (
                  <VideoStream cameraId={cameraId} token={token} darkMode={darkMode} />
                )}
              </Box>

              {/* Footer correctamente alineado */}
              <Footer
                darkMode={darkMode}
                sx={{
                  mt: 2,
                  width: '100%',
                  maxWidth: { xs: 700, md: 1200 },
                  mx: 'auto',
                  mb: 0, // Removed bottom margin
                }}
              />
            </Container>
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;
