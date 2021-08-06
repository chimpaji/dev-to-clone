import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";

function AuthCheck({ fallback, children }) {
  const { user, username } = useContext(UserContext);
  console.log("useUserData=>", user, username);
  if (username) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  return <Link href="/enter">Please login before continue</Link>;
}

export default AuthCheck;
