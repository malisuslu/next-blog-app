/* eslint-disable react/jsx-no-undef */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Container, CssBaseline } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import {
  get,
  push,
  ref,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { auth, db } from "../firebase-config";
import { toast } from "react-hot-toast";
import { uuidv4 } from "@firebase/util";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

export default function NewPost({ open, onClose }) {
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    let postId = uuidv4();
    setUploading(true);
    await update(ref(db, "posts/" + postId), {
      postId,
      subject,
      title,
      content,
      imageUrl,
      createdAt: serverTimestamp(),
      creatorUid: auth.currentUser.uid,
      creatorName: auth.currentUser.displayName,
      creatorEmail: auth.currentUser.email,
      creatorPhotoUrl: auth.currentUser.photoURL,
      likes: 0,
      comments: {},
    });
    await update(ref(db, "users/" + auth.currentUser.uid + "/myPosts/"), {
      [postId]: true,
    })
      .then(() => {
        toast.success("Post created successfully");
        setUploading(false);
        onClose();
        setSubject("");
        setTitle("");
        setContent("");
        setImageUrl("");
        setImageFile(null);
      })
      .catch((error) => {
        toast.error(error.message);
        setUploading(false);
      });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="mx-8"
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 300,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 3,
          borderRadius: "16px",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={
              imageUrl ||
              "https://png.pngitem.com/pimgs/s/197-1971336_release-notes-icon-hd-png-download.png"
            }
            alt="blog-icon"
            className="h-32 w-32 rounded-full"
          />

          <Typography component="h1" variant="h5">
            New Post
          </Typography>
          <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="subject"
              label="Subject"
              name="subject"
              autoComplete="subject"
              autoFocus
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                    {(imageUrl || imageFile) && (
                      <ClearOutlinedIcon
                        onClick={() => {
                          setImageUrl("");
                          setImageFile("");
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
                      {imageUrl ? "Change Image" : "Add Image"}
                    </Button>
                  </>
                ),
              }}
              value={imageFile || imageUrl}
              onChange={(e) => {
                if (imageFile) {
                  setImageUrl(imageUrl);
                } else {
                  setImageFile("");
                  setImageUrl(e.target.value);
                }
              }}
            />
            <input
              type="file"
              id="img-input"
              accept="image/png, image/jpg"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file.name);
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    setImageUrl(e.target.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="content"
              label="Content"
              name="content"
              type="content"
              autoComplete="content"
              autoFocus
              multiline
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Create Post"}
            </Button>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </Modal>
  );
}
