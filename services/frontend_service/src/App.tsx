import { useState } from 'react';
import Login from './components/Login';
import Occupancy from './components/Occupancy';
import VideoStream from './components/VideoStream';
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
  const [cameraId, setCameraId] = useState(CAMERAS[0]);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => setToken(null);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : createTheme({ palette: { mode: 'light' } })}>
      <CssBaseline />
      {!token ? (
        <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="background.default">
          <Login onLogin={setToken} />
        </Box>
      ) : (
        <Container maxWidth="md">
          <Box mt={4}>
            <Typography variant="h4" mb={2}>FindParking Frontend</Typography>

            <Button
              variant="text"
              onClick={() => setDarkMode(prev => !prev)}
              sx={{ mb: 2 }}
            >
              {darkMode ? 'Modo claro' : 'Modo oscuro'}
            </Button>

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Select
                value={cameraId}
                onChange={e => setCameraId((e.target as HTMLInputElement).value)}
              >
                {CAMERAS.map(cam => (
                  <MenuItem key={cam} value={cam}>
                    {cam}
                  </MenuItem>
                ))}
              </Select>
              <Button variant="outlined" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Box>

            <Occupancy cameraId={cameraId} token={token} />
            <VideoStream cameraId={cameraId} token={token} />
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;