import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Suslu Blog
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        py: 1,
        px: 2,
        bottom: 0,
        width: "100%",
        textAlign: "center",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">
          Created with ❤️ by{" "}
          <Link href="https://github.com/asoylu06" target="_blank">
            SUSLU
          </Link>
        </Typography>
        <Copyright />
      </Container>
    </Box>
    // </Box>
  );
}
