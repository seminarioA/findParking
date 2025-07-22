import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  InputAdornment,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { login } from '../api/auth';
import Register from './Register';

interface Props {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña son obligatorios.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const token = await login(username, password);
      onLogin(token);
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />;
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      px={2}
    >
      <Fade in={mounted} timeout={600}>
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 5 },
            maxWidth: 400,
            width: '100%',
            borderRadius: 4,
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <LockOutlinedIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5} mb={3}>
            Ingresa tus credenciales para continuar
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Usuario"
              fullWidth
              margin="dense"
              value={username}
              onChange={e => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
              autoComplete="username"
              variant="outlined"
              error={!!error}
            />

            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="dense"
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              autoComplete="current-password"
              variant="outlined"
              error={!!error}
              helperText={error || ' '}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: 'bold',
                fontSize: 16,
                textTransform: 'none',
              }}
              disabled={loading}
              size="large"
            >
              {loading ? (
                <>
                  <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                  Iniciando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => setShowRegister(true)}
          >
            Crear cuenta
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
}