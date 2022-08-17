import {
  onValue,
  orderByChild,
  orderByValue,
  query,
  ref,
} from "firebase/database";
import Post from "../src/components/Post";
import { db } from "../src/firebase-config";
import { useEffect, useRef, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Home() {
  // const myRef = useRef([]);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [parent] = useAutoAnimate(/* optional config */);
  const [value, setValue] = useState(0);

  useEffect(() => {
    onValue(ref(db, "posts"), async (snapshot) => {
      if (snapshot.exists()) {
        const posts = Object.values(await snapshot.val());
        setPosts(posts);
      }
      setIsLoading(false);
    });
  }, []);

  if (!isLoading && !posts.length) {
    return (
      <div className="my-posts text-center">
        <h1>Posts</h1>
        <p>Currently there is no post.</p>
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="my-posts text-center">
        <h1>Posts</h1>
        <p>Loading the posts...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center pb-12" ref={parent}>
      {posts && posts.map((post) => <Post key={post.postId} {...post} />)}
    </div>
  );
}
