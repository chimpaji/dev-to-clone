import React from "react";
import toast from "react-hot-toast";

function AdminPostsPage() {
  return (
    <div>
      AdminPostsPage{" "}
      <button onClick={() => toast.success("click")}>click</button>
    </div>
  );
}

export default AdminPostsPage;
