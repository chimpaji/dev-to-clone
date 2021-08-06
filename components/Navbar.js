import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserContext } from "../lib/context";
function Navbar() {
  const { user, username } = useContext(UserContext);
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link passHref href="/">
            <button className="btn-logo">DEV</button>
          </Link>
        </li>
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <Image
                  width={50}
                  height={50}
                  alt="profile-pic"
                  src={user.photoURL}
                />
              </Link>
            </li>
          </>
        )}
        {!username && (
          <li>
            <Link href="/enter" className="btn-blue">
              Signin
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
