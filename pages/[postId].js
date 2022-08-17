import moment from "moment";
import { onValue, query, ref, set } from "firebase/database";
import { auth, db } from "../src/firebase-config";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import NewPost from "../src/components/NewPost";
import CommentsBlog from "../src/components/Comments-Blog";

function Blog() {
  const router = useRouter();
  const [postId, setPostId] = useState(router.query.postId);
  const [post, setPost] = useState({});
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorPhotoUrl, setCreatorPhotoUrl] = useState("");
  const [creatorUid, setCreatorUid] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    if (postId) {
      return;
    } else {
      setPostId(router.query.postId);
    }
  }, [postId, router.query.postId]);

  useEffect(() => {
    if (postId) {
      onValue(ref(db, "posts/" + postId), async (snapshot) => {
        if (snapshot.exists()) {
          setPost(await snapshot.val());
          setSubject(await snapshot.val().subject);
          setTitle(await snapshot.val().title);
          setContent(await snapshot.val().content);
          setImageUrl(await snapshot.val().imageUrl);
          setCreatorName(await snapshot.val().creatorName);
          setCreatorPhotoUrl(await snapshot.val().creatorPhotoUrl);
          setCreatorUid(await snapshot.val().creatorUid);
          setCreatedAt(await snapshot.val().createdAt);
          console.log(post);
        }
      });
    }
  }, [postId]);

  console.log(postId);

  useEffect(() => {
    onValue(ref(db, "posts/" + postId + "/likes"), async (snapshot) => {
      if (snapshot.exists()) {
        const likes = Object.keys(snapshot.val());
        setLikesCount(likes.length);
        if (auth.currentUser && likes.includes(auth.currentUser.uid)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } else {
        setLikesCount(0);
      }
    });

    onValue(ref(db, "posts/" + postId + "/comments"), async (snapshot) => {
      if (snapshot.exists()) {
        const comments = Object.keys(await snapshot.val());
        setCommentsCount(comments.length);
      } else {
        setCommentsCount(0);
      }
    });
  });

  const handleLike = async () => {
    if (auth.currentUser) {
      if (liked) {
        await set(
          ref(db, "posts/" + postId + "/likes/" + auth.currentUser.uid),
          {}
        );
        await set(
          ref(db, "users/" + auth.currentUser.uid + "/myLikes/" + postId),
          {}
        );
        setLikesCount(likesCount - 1);
      } else {
        await set(
          ref(db, "posts/" + postId + "/likes/" + auth.currentUser.uid),
          true
        );
        await set(
          ref(db, "users/" + auth.currentUser.uid + "/myLikes/" + postId),
          true
        );
        setLikesCount(likesCount + 1);
      }
      setLiked(!liked);
    }
  };

  const handleDelete = async () => {
    if (auth.currentUser) {
      if (auth.currentUser.uid === creatorUid) {
        await set(ref(db, "posts/" + postId), {});
        await set(ref(db, "users/" + creatorUid + "/myPosts/" + postId), {});
        // router.push("/");
      }
    }
  };

  return (
    <>
      <NewPost
        open={isEditing}
        onClose={() => setIsEditing(false)}
        // handleEdit={handleEdit}
        id={editingPostId}
        currentSubject={subject}
        currentTitle={title}
        currentImageUrl={imageUrl}
        currentContent={content}
        header="Edit Post"
        buttonText="Upload Edited Post"
      />
      <div className="p-4 w-2/12 min-w-[80vw] max-h-[82vh] text-center mx-auto shadow-2xl rounded-3xl m-4 bg-orange-200 hover:scale-105 hover:transition-all hover:ease-in-out transition-all ease-in-out">
        <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
          <div className="w-full">
            <div className="relative w-full flex p-2">
              <img
                src={
                  creatorPhotoUrl ||
                  "https://produto.mercadolivre.com.br/MLB-1754758196-adesivo-grande-anonymus-29-x-21-cm-premium-brindes-_JM"
                }
                alt="author"
                className="w-10 h-10 rounded-full overflow-hidden"
              />
              <div className="pl-2 pt-1 ">
                <p className="font-bold m-0">{creatorName || "Anonymus"}</p>
                <p className="text-xs m-0">
                  {moment(createdAt).format("MMMM Do YYYY")}
                </p>
              </div>
              {router.pathname === "/myposts" && (
                <Box className="absolute right-2">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    className="z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(postId);
                    }}
                  >
                    <DeleteIcon className="text-red-500" />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditingPostId(postId);
                      setIsEditing(true);
                    }}
                  >
                    <EditIcon className="text-green-500" />
                  </IconButton>
                </Box>
              )}
            </div>
          </div>

          <img
            className="max-h-[10rem] min-h-[8rem] w-full object-contain object-center"
            src={
              imageUrl || "https://soundcloud.com/user-881955715/anonymus-edit"
            }
            alt="blog cover"
          />

          <div className="p-0 md:p-4">
            <h2 className="tracking-widest text-xs title-font font-bold text-green-600 mb-1 uppercase mt-0 md:mt-8">
              {subject || "No Subject"}
            </h2>
            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
              {title || "No Title"}
            </h1>
            <div className="flex items-center flex-wrap">
              <p className="m-0 p-0 break-words max-h-20 md:max-h-36 overflow-auto">
                {content || "No Content"}
              </p>
              <span
                className="text-gray-400 mr-3 inline-flex items-center sm:ml-auto ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-200 cursor-pointer hover:text-black"
                onClick={handleLike}
              >
                <svg
                  className={
                    liked ? "w-4 h-4 mr-1 fill-red-500" : "w-4 h-4 mr-1"
                  }
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likesCount}
              </span>
              <span
                className="likesCount text-gray-400 inline-flex items-center leading-none text-sm cursor-pointer hover:text-black"
                onClick={() => setIsCommenting(true)}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                </svg>
                {commentsCount}
              </span>
            </div>
            <CommentsBlog
              postId={postId}
              creatorName={creatorName}
              creatorPhotoUrl={creatorPhotoUrl}
              subject={subject}
              title={title}
              imageUrl={imageUrl}
              isCommenting={isCommenting}
              onClose={() => setIsCommenting(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
