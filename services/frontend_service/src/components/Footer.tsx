import { Box } from '@mui/material';

function Footer({ darkMode }: { darkMode: boolean }) {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        maxWidth: { xs: 700, md: 1200 },
        mx: 'auto',
        bgcolor: darkMode ? 'grey.900' : 'grey.100',
        borderRadius: 6,
        boxShadow: 4,
        border: `2px solid ${darkMode ? '#222' : '#bbb'}`,
        p: 3,
        textAlign: 'center',
        color: darkMode ? 'grey.100' : 'grey.900',
        fontWeight: 700,
        fontSize: 18,
        mt: 4,
      }}
    >
      Alejandro - ML/Computer Vision Engineer |{' '}
      <a
        href="mailto:alejandro@email.com"
        style={{
          color: darkMode ? '#90caf9' : '#1976d2',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        alejandro@email.com
      </a>
      <Box sx={{ height: { xs: 32, md: 48 } }} />
    </Box>
  );
}

export default Footer;