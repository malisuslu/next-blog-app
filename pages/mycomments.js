import {
  equalTo,
  get,
  onValue,
  orderByChild,
  orderByValue,
  query,
  ref,
} from "firebase/database";
import Post from "../src/components/Post";
import { auth, db } from "../src/firebase-config";
import React, { useEffect, useRef, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { onAuthStateChanged } from "firebase/auth";

export default function MyPosts() {
  const [parent] = useAutoAnimate(/* optional config */);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [myCommentedPosts, setMyCommentedPosts] = useState([]);
  // const myRef = useRef([]);

  useEffect(() => {
    if (!isSignedIn) {
      onAuthStateChanged(auth, async (user) => {
        setIsSignedIn(user);
        if (user) {
          const commentsSnapshot = await get(ref(db, "comments"));
          if (commentsSnapshot.val()) {
            const comments = Object.values(await commentsSnapshot.val());
            const mcPosts = comments
              .filter((comment) => comment.creatorUid === user.uid)
              .map((comment) => comment.postId)
              .filter(
                (value, index, self) =>
                  index === self.findIndex((t) => t === value)
              )
              .map(async (postId) => {
                let post = await (await get(ref(db, "posts/" + postId))).val();
                return post;
              });
            Promise.all(mcPosts).then((post) => {
              setMyCommentedPosts(post);
              setIsLoading(false);
            });
          } else {
            setIsLoading(false);
          }
        }
      });
    } else {
      onValue(ref(db, "comments"), async (snapshot) => {
        if (snapshot.exists()) {
          const comments = Object.values(await snapshot.val());
          const mcPosts = comments
            .filter((comment) => comment.creatorUid === auth.currentUser.uid)
            .map((comment) => comment.postId)
            .filter(
              (value, index, self) =>
                index === self.findIndex((t) => t === value)
            )
            .map(async (postId) => {
              let post = await (await get(ref(db, "posts/" + postId))).val();
              return post;
            });
          Promise.all(mcPosts).then((post) => {
            setMyCommentedPosts(post);
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      });
    }
  }, []);

  if (!isSignedIn) {
    return (
      <div className="my-posts text-center">
        <h1>My Comments</h1>
        <p>You must login to see the posts which you put commented.</p>
      </div>
    );
  } else if (isSignedIn && isLoading) {
    return (
      <div className="my-posts text-center">
        <h1>My Comments</h1>
        <p>Loading the posts commented by you...</p>
      </div>
    );
  } else if (isSignedIn && !isLoading && myCommentedPosts.length === 0) {
    return (
      <div className="my-posts text-center">
        <h1>My Comments</h1>
        <p>You currently have no comments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center" ref={parent}>
      {myCommentedPosts.map((myPost) => (
        <Post key={myPost.postId} {...myPost} />
      )) || (
        <div className="my-posts text-center">
          <h1>My Posts</h1>
          <p>You have not posted anything yet.</p>
        </div>
      )}
    </div>
  );
}
