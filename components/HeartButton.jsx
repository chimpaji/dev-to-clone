import React, { useContext, useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { UserContext } from "../lib/context";
import { firestore, increment } from "../lib/firebase";

function HeartButton({ path }) {
  const { user, username } = useContext(UserContext);
  const uid = user.uid;
  const postRef = firestore.doc(path);
  const heartRef = firestore.doc(path).collection("hearts").doc(uid);
  const [heartDoc] = useDocument(heartRef);

  const addHeart = () => {
    const batch = firebase.batch();

    batch.update(postRef, { heartCount: increment(1) });
  };

  const removeHeart = () => {};

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}

export default HeartButton;
