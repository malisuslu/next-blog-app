/* eslint-disable react/jsx-no-undef */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Avatar,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { Fragment, useEffect, useState } from "react";
import {
  get,
  onValue,
  query,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { auth, db } from "../firebase-config";
import SendIcon from "@mui/icons-material/Send";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import { onAuthStateChanged } from "firebase/auth";
import { async } from "@firebase/util";
import { useRouter } from "next/router";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function CommentsBlog({
  isCommenting,
  onClose,
  postId,
  creatorName,
  creatorPhotoUrl,
  subject,
  title,
  imageUrl,
  createdAt,
}) {
  const [uploading, setUploading] = useState(false);
  const [parent] = useAutoAnimate(/* optional config */);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [value, setValue] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    onValue(ref(db, "posts/" + postId + "/comments"), async (snapshot) => {
      if (snapshot.exists()) {
        const comments = Object.values(await snapshot.val()).reverse();
        setComments(comments);
      }
    });
  }, [isSignedIn, postId]);

  const handleComment = async () => {
    if (auth.currentUser) {
      if (comment.length > 0) {
        setUploading(true);
        const commentId = Date.now();
        const commentData = {
          postId,
          commentId,
          creatorUid: auth.currentUser.uid,
          creatorName: auth.currentUser.displayName,
          creatorPhotoUrl: auth.currentUser.photoURL,
          comment,
          createdAt: serverTimestamp(),
        };
        await update(ref(db, "posts/" + postId + "/comments/" + commentId), {
          ...commentData,
        });
        await set(ref(db, "comments/" + commentId), {
          ...commentData,
        });
        await set(
          ref(db, "users/" + auth.currentUser.uid + "/myComments/" + commentId),
          postId
        );
        setComment("");
        setUploading(false);
      }
    }
  };

  const handleDelete = async (commentId) => {
    if (auth.currentUser) {
      setUploading(true);
      await set(ref(db, "posts/" + postId + "/comments/" + commentId), {});
      await set(
        ref(db, "users/" + auth.currentUser.uid + "/myComments/" + commentId),
        {}
      );
      await remove(ref(db, "comments/" + commentId));
      setUploading(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (auth.currentUser && editComment.length > 0) {
      const commentData = {
        commentId,
        creatorUid: auth.currentUser.uid,
        creatorName: auth.currentUser.displayName,
        creatorPhotoUrl: auth.currentUser.photoURL,
        comment: editComment,
        createdAt: serverTimestamp(),
      };
      await update(ref(db, "posts/" + postId + "/comments/" + commentId), {
        ...commentData,
      });
      setComment("");
      setIsEditing(false);
    }
  };

  return (
    <Container component="main" className="relative p-0 break-words">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {auth.currentUser && (
          <TextField
            margin="normal"
            required
            fullWidth
            id="comment"
            label="Type your comment here..."
            name="comment"
            type="comment"
            autoComplete="comment"
            autoFocus
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-white"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleComment()}
                  >
                    <SendIcon className=" text-blue-500" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}

        {comments.length > 0 && (
          <List
            sx={{ width: "100%", bgcolor: "bg-orange-200" }}
            className="max-h-72 overflow-y-scroll"
          >
            <h4 className="m-0 text-center">Comments</h4>
            {comments.map((comment) =>
              router.pathname === "/mycomments" ? (
                comment.creatorUid === auth.currentUser.uid && (
                  <Fragment key={comment.commentId}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={comment.creatorPhotoUrl}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        className="pr-2"
                        primary={
                          <Fragment>
                            <Typography
                              variant="body1"
                              sx={{ display: "inline" }}
                            >
                              {" "}
                              {comment.creatorName}
                              {" - "}
                            </Typography>
                            <Typography variant="caption">
                              {" "}
                              {moment(comment.createdAt).fromNow()}{" "}
                            </Typography>
                          </Fragment>
                        }
                        secondary={
                          <Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {comment.comment}
                            </Typography>
                          </Fragment>
                        }
                      />
                      <ListItemSecondaryAction
                        hidden={
                          !auth.currentUser ||
                          auth.currentUser.uid !== comment.creatorUid
                        }
                      >
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          className="z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(comment.commentId);
                          }}
                        >
                          <DeleteIcon className="text-red-500" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => {
                            setIsEditing(true);
                            setCurrentCommentId(comment.commentId);
                          }}
                        >
                          <EditIcon className="text-green-500" />
                        </IconButton>
                        <Modal
                          open={
                            isEditing && currentCommentId === comment.commentId
                          }
                          onClose={() =>
                            setIsEditing(false) && setEditComment("")
                          }
                          aria-labelledby="child-modal-title"
                          aria-describedby="child-modal-description"
                        >
                          <Box sx={{ ...style, width: 400 }}>
                            <TextField
                              margin="normal"
                              required
                              fullWidth
                              id="editcomment"
                              label="Edit your comment here..."
                              name="editcomment"
                              type="editcomment"
                              autoComplete="editcomment"
                              autoFocus
                              multiline
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={async () => {
                                        await handleEdit(currentCommentId);
                                        setEditComment("");
                                        setIsEditing(false);
                                      }}
                                    >
                                      <SendIcon className=" text-blue-500" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        </Modal>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Fragment>
                )
              ) : (
                <Fragment key={comment.commentId}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt="Remy Sharp" src={comment.creatorPhotoUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      className="pr-2"
                      primary={
                        <Fragment>
                          <Typography
                            variant="body1"
                            sx={{ display: "inline" }}
                          >
                            {" "}
                            {comment.creatorName}
                            {" - "}
                          </Typography>
                          <Typography variant="caption">
                            {" "}
                            {moment(comment.createdAt).fromNow()}{" "}
                          </Typography>
                        </Fragment>
                      }
                      secondary={
                        <Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {comment.comment}
                          </Typography>
                        </Fragment>
                      }
                    />
                    <ListItemSecondaryAction
                      hidden={
                        !auth.currentUser ||
                        auth.currentUser.uid !== comment.creatorUid
                      }
                    >
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        className="z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(comment.commentId);
                        }}
                      >
                        <DeleteIcon className="text-red-500" />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentCommentId(comment.commentId);
                        }}
                      >
                        <EditIcon className="text-green-500" />
                      </IconButton>
                      <Modal
                        open={
                          isEditing && currentCommentId === comment.commentId
                        }
                        onClose={() =>
                          setIsEditing(false) && setEditComment("")
                        }
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                      >
                        <Box sx={{ ...style, width: 400 }}>
                          <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="editcomment"
                            label="Edit your comment here..."
                            name="editcomment"
                            type="editcomment"
                            autoComplete="editcomment"
                            autoFocus
                            multiline
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={async () => {
                                      await handleEdit(currentCommentId);
                                      setEditComment("");
                                      setIsEditing(false);
                                    }}
                                  >
                                    <SendIcon className=" text-blue-500" />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Modal>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              )
            )}
          </List>
        )}
      </Box>
    </Container>
  );
}
