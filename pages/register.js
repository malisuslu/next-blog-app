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
import { auth, db, storage } from "../src/firebase-config";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ref, set } from "firebase/database";
import { ref as sRef } from "firebase/storage";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { getDownloadURL, uploadString } from "firebase/storage";

export default function Register() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [picFilename, setPicFilename] = useState("");

  const register = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await createUserWithEmailAndPassword(
      auth,
      data.get("email"),
      data.get("password")
    )
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        const imageRef = sRef(storage, "profile-pics/" + user.uid);
        await uploadString(imageRef, profilePic, "data_url");
        await getDownloadURL(imageRef).then(async (url) => {
          await updateProfile(user, {
            displayName: firstName + " " + lastName,
            photoURL: url,
          });
        });
        await set(ref(db, "users/" + user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
        toast.success("User registered successfully");
        setIsLoggedIn(true);
        router.push("/");
      })
      .catch((error) => {
        toast.error(error.message);
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={register} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="img-url"
              label="Image URL"
              type="img-url"
              id="img-url"
              autoComplete="img-url"
              hidden
              InputProps={{
                endAdornment: (
                  <>
                    {profilePic && (
                      <ClearOutlinedIcon
                        onClick={() => {
                          setProfilePic("");
                          setPicFilename("");
                          document.getElementById("img-input").value = "";
                        }}
                        style={{ cursor: "pointer", marginRight: "8px" }}
                      />
                    )}
                    <Button
                      type="button"
                      variant="contained"
                      className="text-xs"
                      onClick={() =>
                        document.getElementById("img-input").click()
                      }
                    >
                      {profilePic ? "Change Image" : "Add Image"}
                    </Button>
                  </>
                ),
              }}
              value={picFilename + ""}
              // onChange={(e) => setImageUrl(e.target.value)}
            />
            <input
              type="file"
              id="img-input"
              accept="image/png, image/jpg"
              hidden
              onChange={(e) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  setProfilePic(e.target.result);
                };
                reader.readAsDataURL(e.target.files[0]);
                setPicFilename(e.target.files[0].name);
                // console.log(profilePic);
                // console.log(picFilename);
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    );
  }
}
