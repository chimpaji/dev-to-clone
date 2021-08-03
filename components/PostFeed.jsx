import Link from "next/link";
import React from "react";

function PostFeed({ posts, admin }) {
  // console.log("posts in postfeed comp", posts);
  return (
    posts &&
    posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />)
  );
}

function PostItem({ post, admin }) {
  console.log("posts");
  const wordCount = post.content.trim().split("").length;
  const minutesToRead = Math.ceil(wordCount / 250);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}

export default PostFeed;
