import React, { useEffect, useState } from "react";
import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let unsub;
    console.log("user", user);
    if (user) {
      const ref = firestore.collection("devto-clone-users").doc(user.uid);
      unsub = ref.onSnapshot((doc) => {
        console.log("onSnapshot");
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }
    return unsub;
  }, [user]);

  return { user, username };
}
