import { Box } from '@mui/material';
import type { SxProps } from '@mui/material';

function Footer({ darkMode, sx }: { darkMode: boolean; sx?: SxProps }) {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
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
        ...sx, // Merge custom styles
      }}
    >
      Demo para la Universidad Tecnologica del Peru (UTP)
    </Box>
  );
}

export default Footer;