import Image from "next/image";
import React from "react";

function UserProfile({ user }) {
  return (
    <div className="box-center">
      <div>
        <div className="img-profile">
          <Image
            src={user.photoURL || "/hacker.png"}
            alt="profile-pic"
            className="card-img-center"
            layout="fill"
          />
        </div>
      </div>
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayname || "Anonymous User"}</h1>
    </div>
  );
}

export default UserProfile;
