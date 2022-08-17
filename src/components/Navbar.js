import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import Image from "next/image";
import { auth } from "../firebase-config";
import { useRouter } from "next/router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import NewPost from "./NewPost";

const pages = ["Github", "LinkedIn", "About"];
const settings = ["My Posts", "My Comments", "New Post", "Logout"];

const Navbar = () => {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClick = (e) => {
    handleCloseUserMenu();
    if (e.target.textContent === "Logout") {
      signOut(auth) && router.replace("/login");
    } else if (e.target.textContent === "My Posts") {
      router.push("/myposts");
    } else if (e.target.textContent === "My Comments") {
      router.push("/mycomments");
    } else if (e.target.textContent === "New Post") {
      setIsNewPostOpen(true);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(user);
    });
  }, []);

  return (
    <AppBar position="fixed">
      <NewPost open={isNewPostOpen} onClose={() => setIsNewPostOpen(false)} />
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              position: "relative",
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => router.push("/")}
            >
              <Image
                src="/assets/images/SUSLU-W.png"
                alt="SUSLU"
                width={50}
                height={50}
                objectFit="contain"
              />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => {
                      page === pages[0] &&
                        window.open("https://github.com/malisuslu", "_blank");
                      page === pages[1] &&
                        window.open(
                          "https://www.linkedin.com/in/muhammed-ali-s%C3%BCsl%C3%BC/",
                          "_blank"
                        );
                      page === pages[2] &&
                        router.push(`/${page.toLowerCase()}`);
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              position: "relative",
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <IconButton onClick={() => router.push("/")}>
              <Image
                src="/assets/images/SUSLU-W.png"
                alt="SUSLU"
                width={50}
                height={50}
                objectFit="contain"
              />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  page === pages[0] &&
                    window.open("https://github.com/malisuslu", "_blank");
                  page === pages[1] &&
                    window.open(
                      "https://www.linkedin.com/in/muhammed-ali-s%C3%BCsl%C3%BC/",
                      "_blank"
                    );
                  page === pages[2] && router.push(`/${page.toLowerCase()}`);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {auth.currentUser ? (
            <Box sx={{ flexGrow: 0 }} className="relative rounded-full">
              <Tooltip title="User Menu">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Image
                    src={
                      auth.currentUser.photoURL ||
                      "https://img.freepik.com/free-photo/pleasant-looking-serious-man-stands-profile-has-confident-expression-wears-casual-white-t-shirt_273609-16959.jpg?w=2000"
                    }
                    alt="SUSLU"
                    width={50}
                    height={50}
                    objectFit="cover"
                    className="rounded-full"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box className="px-4 italic bg-lime-400">
                  <Typography>{auth.currentUser.displayName}</Typography>
                  <Typography>{auth.currentUser.email}</Typography>
                </Box>
                {settings.map((setting, index) => (
                  <MenuItem key={index} onClick={handleClick}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Sign In">
                <IconButton onClick={() => router.push("/login")} sx={{ p: 0 }}>
                  <LoginOutlinedIcon className="text-white" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
