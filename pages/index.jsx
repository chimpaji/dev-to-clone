import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { useState } from "react";
import { firestore, fromMillis, postToJson } from "../lib/firebase";
import PostFeed from "../components/PostFeed";

const LIMIT = 2;

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup("posts")
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJson);

  return { props: { posts } };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setloading] = useState(false);
  const [postend, setPostend] = useState(false);

  async function getMorePosts() {
    setloading(true);
    const last = posts[posts.length - 1];
    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;
    console.log(cursor);
    const newPostsQuery = firestore
      .collectionGroup("posts")
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);
    const newPosts = (await newPostsQuery.get()).docs.map(postToJson);
    // console.log("newPosts", newPosts);
    setPosts([...posts, ...newPosts]);
    if (newPosts.length < LIMIT) {
      setPostend(true);
    } else {
      setPostend(false);
    }
    // console.log("updated posts", posts);
    setloading(false);
  }

  return (
    <main>
      <PostFeed posts={posts} />
      {loading && <Loader />}
      {!loading && !postend && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      {postend && "You have reached the end!"}
    </main>
  );
}
