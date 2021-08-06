import { divide } from "lodash";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React, { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { async } from "../../.next/static/chunks/main";
import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import { firestore, increment } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";
import styles from "../../styles/admin.module.css";

function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

export default AdminPostEdit;

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const { user } = useUserData();
  const postRef = firestore
    .collection("devto-clone-users")
    .doc(user.uid)
    .collection("posts")
    .doc(slug);
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm post={post} postRef={postRef} preview={preview} />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ post, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    defaultValues: post,
    mode: "onChange",
  });

  const router = useRouter();
  console.log("postData in postForm", post);

  const updatePost = async ({ content, published }) => {
    //handleSubmit already handle preventDefault,and pass us the updated defaultValues

    const res = await postRef.update({ content, published });
    reset({ content, published });

    toast.success("Post updated successfully!");
    router.push(`/${post.username}/${post.slug}`);
  };
  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader uid={post.uid} />

        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          />
          <label>Published</label>
        </fieldset>
        <button type="submit" className="btn-green">
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();
  const handleDelete = async () => {
    const res = postRef.delete();
    console.log("handleDelete", res);
    router.push("/");
  };

  return (
    <button className="btn-red" onClick={handleDelete}>
      Delete
    </button>
  );
}
