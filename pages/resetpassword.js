import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/firebase-config";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Reset() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [email, setEmail] = useState("");

  let resetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        toast.success(
          "Password reset email sent! Don't forge t to check your spam folder!"
        );
        setEmail("");
        // ..
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ..
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(user);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return (
      <div className="text-center align-middle">
        <Image
          src="/assets/images/loading.gif"
          alt="Loading"
          width={300}
          height={300}
          objectFit="contain"
        />
      </div>
    );
  } else if (isLoggedIn) {
    router.replace("/");
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={resetPassword}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Reset Link
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    );
  }
}
