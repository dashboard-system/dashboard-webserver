import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Typography,
  Box
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

interface LoginProps {
  open: boolean;
  toggleLogin: () => void;
}

const LoginDialog: React.FC<LoginProps> = ({ open, toggleLogin }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={toggleLogin}
      fullScreen={fullScreen}
    >
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter your username and password to log in.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="username"
          placeholder="username"
          type="username"
          fullWidth
          variant="outlined"
        />
        <TextField
          margin="dense"
          id="password"
          label="Password"
          placeholder="******"
          type="password"
          fullWidth
          variant="outlined"
        />
        {/* <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link href="#" variant="body2">Forgot password?</Link>
        </Box> */}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={toggleLogin}>
          Sign In
        </Button>
        <Box textAlign="center" mt={1}>
          <Link href="#" variant="body2">Cancal</Link>
        </Box>
      </DialogContent>
    </Dialog>
  );
};


// const LoginDialog: React.FC<LoginProps> = ({ open, toggleLogin }) => {
//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Dialog
//       open={open}
//       onClose={toggleLogin}
//       fullScreen={fullScreen}
//     >
//       <DialogTitle>Login</DialogTitle>
//       <DialogContent>
//         <Button
//           fullWidth
//           variant="outlined"
//           startIcon={<GitHubIcon />}
//           sx={{ mt: 2, mb: 2 }}
//         >
//           Sign In With GitHub
//         </Button>
//         <Box display="flex" alignItems="center" mb={2}>
//           <Divider sx={{ flexGrow: 1 }} />
//           <Typography sx={{ mx: 1 }} color="text.secondary">or</Typography>
//           <Divider sx={{ flexGrow: 1 }} />
//         </Box>
//         <DialogContentText>
//           Please enter your email and password to log in.
//         </DialogContentText>
//         <TextField
//           autoFocus
//           margin="dense"
//           id="email"
//           label="Email"
//           placeholder="your@email.com"
//           type="email"
//           fullWidth
//           variant="outlined"
//         />
//         <TextField
//           margin="dense"
//           id="password"
//           label="Password"
//           placeholder="******"
//           type="password"
//           fullWidth
//           variant="outlined"
//         />
//         <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
//           <FormControlLabel control={<Checkbox />} label="Remember me" />
//           <Link href="#" variant="body2">Forgot password?</Link>
//         </Box>
//         <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={toggleLogin}>
//           Sign In
//         </Button>
//         <Box textAlign="center" mt={1}>
//           <Link href="#" variant="body2">Sign up</Link>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

export default LoginDialog;