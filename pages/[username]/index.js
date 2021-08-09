import { useRouter } from "next/dist/client/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { auth, getUserDocWithUsername } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";

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

function Index({ user, posts }) {
  const router = useRouter();
  const { user: checkIfSignIn } = useUserData();

  const handleSignout = () => {
    console.log("im out");
    auth.signOut();
    router.push("/");
  };
  return (
    <main>
      <UserProfile user={user} />
      {checkIfSignIn && <button onClick={handleSignout}>Sign out</button>}
      <PostFeed posts={posts} />
    </main>
  );
}

export default Index;
