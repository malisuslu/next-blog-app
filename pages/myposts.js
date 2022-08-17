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
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (!isSignedIn) {
      onAuthStateChanged(auth, async (user) => {
        setIsSignedIn(user);
        if (user) {
          const postsSnapshot = await get(ref(db, "posts"));
          if (postsSnapshot.exists()) {
            const posts = Object.values(await postsSnapshot.val());
            const myPosts = posts.filter(
              (post) => post.creatorUid === user.uid
            );
            setMyPosts(myPosts);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        }
      });
    } else {
      onValue(ref(db, "posts"), async (snapshot) => {
        if (snapshot.exists()) {
          const posts = Object.values(snapshot.val());
          const myPosts = posts.filter(
            (post) => post.creatorUid === auth.currentUser.uid
          );
          setMyPosts(myPosts);
          setIsLoading(false);
          setIsSignedIn(auth.currentUser);
        } else {
          setIsLoading(false);
        }
      });
    }
  }, [isLoading, isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="my-posts text-center">
        <h1>My Posts</h1>
        <p>You must login to see your posts.</p>
      </div>
    );
  } else if (isSignedIn && isLoading) {
    return (
      <div className="my-posts text-center">
        <h1>My Posts</h1>
        <p>Loading your posts...</p>
      </div>
    );
  } else if (isSignedIn && !isLoading && myPosts.length === 0) {
    return (
      <div className="my-posts text-center">
        <h1>My Posts</h1>
        <p>You have no posts.</p>
      </div>
    );
  }

  // myRef.current = myRef.current.filter(
  //   (value, index, self) =>
  //     index === self.findIndex((t) => t.postId === value.postId)
  // );

  console.log(myPosts);

  return (
    <div className="flex flex-wrap justify-center" ref={parent}>
      {(myPosts &&
        myPosts.map((myPost) => <Post key={myPost.postId} {...myPost} />)) || (
        <div className="my-posts text-center">
          <h1>My Posts</h1>
          <p>You have not posted anything yet.</p>
        </div>
      )}
    </div>
  );
}
