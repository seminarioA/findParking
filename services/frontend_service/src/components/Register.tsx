import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  InputAdornment,
  Fade,
  Stack
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { register } from '../api/register';

interface Props {
  onBack: () => void;
}

export default function Register({ onBack }: Props) {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!username.trim()) errors.username = 'El usuario es obligatorio.';
    if (!email.trim()) errors.email = 'El correo es obligatorio.';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)) errors.email = 'Correo no válido.';
    if (!password.trim()) errors.password = 'La contraseña es obligatoria.';
    if (!confirm.trim()) errors.confirm = 'Debe confirmar la contraseña.';
    if (password && confirm && password !== confirm) errors.confirm = 'Las contraseñas no coinciden.';
    return errors;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalMessage(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      setGlobalMessage({ type: 'success', text: 'Usuario registrado correctamente.' });
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirm('');
    } catch {
      setGlobalMessage({ type: 'error', text: 'No se pudo registrar el usuario.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="background.default"
      px={2}
    >
      <Fade in={mounted} timeout={500}>
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
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Volver
            </Button>
            <PersonAddAltIcon color="primary" sx={{ fontSize: 32 }} />
          </Stack>

          <Typography variant="h5" fontWeight={700}>
            Crear cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5} mb={3}>
            Ingresa tus datos para registrarte
          </Typography>

          <form onSubmit={handleRegister} noValidate>
            <TextField
              label="Usuario"
              fullWidth
              margin="dense"
              value={username}
              onChange={e => setUsername(e.target.value)}
              error={!!fieldErrors.username}
              helperText={fieldErrors.username || ' '}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Correo"
              fullWidth
              margin="dense"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email || ' '}
              type="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Contraseña"
              fullWidth
              margin="dense"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password || ' '}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar contraseña"
              fullWidth
              margin="dense"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              type="password"
              error={!!fieldErrors.confirm}
              helperText={fieldErrors.confirm || ' '}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            {globalMessage && (
              <Typography
                variant="body2"
                mt={1}
                sx={{
                  color: globalMessage.type === 'error' ? 'error.main' : 'success.main',
                }}
              >
                {globalMessage.text}
              </Typography>
            )}

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
            >
              {loading ? (
                <>
                  <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                  Registrando...
                </>
              ) : (
                'Registrar'
              )}
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
}