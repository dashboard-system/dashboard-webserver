import { Box, Typography, Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router'

const Error404 = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        px: 2,
        // flexGrow: 1,
      }}
    >
      <Typography variant="h1" color="error" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h4" sx={{ mt: 2 }}>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, mb: 4 }}>
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => navigate('/')}>
          Go Home
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Stack>
    </Box>
  )
}

export default Error404
