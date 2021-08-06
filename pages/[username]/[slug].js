import styles from "../../styles/Post.module.css";
import React, { useContext } from "react";
import Metatags from "../../components/Metatags";
import PostContent from "../../components/PostContent";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import {
  firestore,
  getUserDocWithUsername,
  postToJson,
} from "../../lib/firebase";
import { UserContext } from "../../lib/context";

function PostPage(props) {
  const path = props.path;

  const { user: currentUser } = useContext(UserContext);
  const [realtimePost] = useDocumentData(firestore.doc(path));
  console.log("realtimePost", realtimePost);
  const post = realtimePost || props.post;
  console.log("check post", post);
  return (
    <main className={styles.container}>
      <Metatags title={post.title} description={post.title} />

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          {/* <div>hi</div> */}
          <HeartButton path={path} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}

export async function getStaticProps(context) {
  const { username, slug } = context.params;

  const userDoc = await getUserDocWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);

    post = postToJson(await postRef.get());
    path = postRef.path;
  }

  console.log("path=>", path);
  // const ref = userDoc.ref.collection("posts");
  // const query = ref.where("slug", "==", slug);

  // const postDoc = (await query.get()).docs;
  // const postRef = (await query.get()).docs[0].path;

  //we will give postRef to heartButton so it can find the heart collection that contain inside post document

  return { props: { post, path }, revalidate: 3600 };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();
  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();
    return { params: { username, slug } };
  });

  return { paths, fallback: "blocking" };
}

export default PostPage;
