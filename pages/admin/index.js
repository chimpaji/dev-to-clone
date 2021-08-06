import React, { useState } from "react";
import {
  useCollection,
  useCollectionData,
  useCollectionDataOnce,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import {
  auth,
  firestore,
  postToJson,
  serverTimestamp,
} from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";
import { kebabCase } from "lodash";
import styles from "../../styles/Admin.module.css";
import { useRouter } from "next/dist/client/router";

function AdminPostsPage() {
  //This component wont use servider side rendering prevent content grabed by SEO

  return (
    <div>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </div>
  );
}

export default AdminPostsPage;

function PostList() {
  const { user } = useUserData();
  //This component wont use servider side rendering prevent content grabed by SEO
  const ref = firestore
    .collection("devto-clone-users")
    .doc(user.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt", "desc");
  //actually we can use useCollectionData but I want to convert data to json, so snapshot is suit with this method
  const [postQuery] = useCollection(query);
  const postData = postQuery?.docs.map((doc) => doc.data());
  console.log("postDOcs", postData);
  return <div>{postData && <PostFeed posts={postData} admin />}</div>;
}

function CreateNewPost() {
  const { user, username } = useUserData();
  const uid = user.uid;
  const [title, setTitle] = useState("");
  const slug = encodeURI(kebabCase(title));
  console.log("user.uid", user.uid);
  const router = useRouter();
  const data = {
    title,
    slug,
    uid,
    username,
    published: false,
    content: "# hello world!",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    heartCount: 0,
  };
  async function createPost(e) {
    console.log("createPost clicked");
    e.preventDefault();
    const newPostRef = firestore
      .collection("devto-clone-users")
      .doc(uid)
      .collection("posts")
      .doc(slug);
    const res = await newPostRef.set(data);
    console.log("createPostResponse=>", res);

    toast.success("Created a post");

    router.push(`/admin/${slug}`);
  }
  const isValid = title.length > 3 && title.length < 100;

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
