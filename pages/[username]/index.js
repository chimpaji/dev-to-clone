import React from "react";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { getUserDocWithUsername } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserDocWithUsername(username);

  let user;
  let posts;

  if (userDoc) {
    user = userDoc.data();
    // ref => query => snapshot => snapshot.docs => doc.data()
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc");

    posts = (await postsQuery.get()).docs.map((doc) => {
      console.log("doc data", doc.data());

      //updatedAt,createdAt contain timeStamp object which cant turn to json, so we turn it to millis before..
      return {
        ...doc.data(),
        updatedAt: doc.data().updatedAt.toMillis(),
        createdAt: doc.data().createdAt.toMillis(),
      };
    });

    // const postsQuery = userDoc
    //   .collection("posts")
    //   .get((snapshot) => console.log(snapshot));
    console.log("postsdata", posts);
  }
  // console.log("userDOc", userDoc);
  console.log("user", user);

  return {
    props: { user: userDoc.data(), posts },
  };
}

function index({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

export default index;
