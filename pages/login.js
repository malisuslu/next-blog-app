import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../src/firebase-config";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import { get, ref, set } from "firebase/database";

export default function Login() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);

  remember
    ? setPersistence(auth, browserLocalPersistence)
    : setPersistence(auth, browserSessionPersistence);

  function loginWithEmailAndPassword(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    signInWithEmailAndPassword(auth, data.get("email"), data.get("password"))
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        toast.success("User logged in successfully");
        router.push("/");
        // ...
      })
      .catch((error) => {
        //   const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ..
      });
  }

  function loginWithGoogle(e) {
    e.preventDefault();
    let provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .then(async () => {
        await get(ref(db, "users/" + auth.currentUser.uid)).then(
          async (user) => {
            if (user.exists()) {
              setIsLoggedIn(auth.currentUser);
              router.push("/");
            } else {
              await set(ref(db, "users/" + auth.currentUser.uid), {
                name: auth.currentUser.displayName,
                email: auth.currentUser.email,
                photoURL: auth.currentUser.photoURL,
              });
              toast.success("User registered successfully");
            }
            toast.success("User signed in with Google successfully");
          }
        );
      })
      .catch((error) => {
        //   const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        // ..
      });
  }

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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={loginWithEmailAndPassword}
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={remember}
                  color="primary"
                  onChange={(e) => setRemember(e.target.checked)}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 0, mb: 2 }}
              startIcon={<GoogleIcon />}
              onClick={loginWithGoogle}
            >
              Sign In with Google
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/resetpassword" variant="body2">
                  Forgot password?
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
