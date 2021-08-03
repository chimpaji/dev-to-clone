import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNwOoZHeNEP-0SjZf2bVVprqHsb-Fq0Ig",
  authDomain: "kieng-ddb81.firebaseapp.com",
  databaseURL: "https://kieng-ddb81.firebaseio.com",
  projectId: "kieng-ddb81",
  storageBucket: "kieng-ddb81.appspot.com",
  messagingSenderId: "756304258143",
  appId: "1:756304258143:web:2b1199e62cb6ccfb2a27ea",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export async function getUserDocWithUsername(username) {
  const ref = firestore.collection("devto-clone-users");
  const query = ref.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  console.log("userDoc", userDoc);
  return userDoc;
}

export function postToJson(doc) {
  return {
    ...doc.data(),
    updatedAt: doc.data().updatedAt.toMillis(),
    createdAt: doc.data().createdAt.toMillis(),
  };
}
