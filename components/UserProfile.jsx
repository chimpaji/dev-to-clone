import React from "react";

function UserProfile({ user }) {
  return (
    <div className="box-center">
      <img src={user.photoURL || "/hacker.png"} className="card-img-center" />
      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayname || "Anonymous User"}</h1>
    </div>
  );
}

export default UserProfile;
