import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import React from "react";
import debounce from "lodash.debounce";
import Image from "next/image";

function Enter() {
  const { user, username } = useContext(UserContext);

  // 1. user signed out SignInButton
  // 2. user signed in, but missing username UsernameForm
  // 3. user signed in, has username <singoutButton>

  return !user ? (
    <>
      <SignInButton />
    </>
  ) : username ? (
    <SignOutButton />
  ) : (
    <>
      <UsernameForm />
      <SignOutButton />
    </>
  );
}

export default Enter;

function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };
  return (
    <div className="btn-signin-container">
      <button
        className="btn-google"
        onClick={() => {
          signInWithGoogle();
        }}
      >
        <div className="img-google-login">
          <Image alt="google-logo" src="/google.png" layout="fill" />
        </div>
        Login with Google
      </button>
    </div>
  );
}

function UsernameForm() {
  const [loading, setloading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [formValue, setFormValue] = useState("");

  const { username, user } = useContext(UserContext);

  const onChange = (e) => {
    //Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    //Only set form value easy for the first 3 letter then if it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setloading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsValid(false);
      setloading(true);
    }
  };

  //useEffect to check the username by calling checkUsername
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  //checkUsername function
  //Hit the database for userame match after each debounced change
  //useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`devto-clone-usernames/${username}`);
        const { exists } = await ref.get();
        // const res = await ref.get();
        // console.log("res", res);
        console.log("Firestore react executed ");
        setIsValid(!exists);
        setloading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    //Create refs for both documents
    const userDocs = firestore.doc(`devto-clone-users/${user.uid}`);
    const usernameDocs = firestore.doc(`devto-clone-usernames/${formValue}`);

    //Commit both docs together as a batch write
    const batch = firestore.batch();
    batch.set(userDocs, {
      username: formValue,
      photoURL: user.photoURL,
      displayname: user.displayName,
    });
    batch.set(usernameDocs, { uid: user.uid });

    //Should wrap with trycatch
    try {
      await batch.commit();
      console.log("done biatch");
    } catch (error) {
      return error;
    }

    return;
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function SignOutButton() {
  return (
    <button
      onClick={() => {
        auth.signOut();
      }}
    >
      Sign Out
    </button>
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
