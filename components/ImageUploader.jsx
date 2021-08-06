import React, { useState } from "react";
import Loader from "./Loader";
import { useDownloadURL } from "react-firebase-hooks/storage";
import { storage } from "../lib/firebase";
function ImageUploader({ uid }) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");
  const [error, setError] = useState(null);
  const uploadFile = (e) => {
    const { fileName, ext } = getFileNameWithExt(e);
    console.log("preview filenamae", fileName, ext);
    const imageName = `${fileName}.${ext}`;
    console.log(imageName);

    const file = e.target.files[0];

    const imageFolderRef = storage
      .ref()
      .child(`/projects/dev-to-clone/${uid}/`);
    const imageRef = imageFolderRef.child(imageName);

    const uploadTask = imageRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //Initiate upload
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        setLoading(true);
      },
      (error) => {
        //handle error upload
        setError(error);
        console.log(error);
        setLoading(false);
      },
      () => {
        //handle successfull uploads
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setDownloadURL(downloadURL);
        });
        setLoading(false);
      }
    );
  };

  function getFileNameWithExt(event) {
    if (
      !event ||
      !event.target ||
      !event.target.files ||
      event.target.files.length === 0
    ) {
      return;
    }

    const name = event.target.files[0].name;
    const lastDot = name.lastIndexOf(".");

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);
    return { fileName, ext };
  }

  return (
    <div className="box">
      {loading && <Loader />}
      <div>upload progress:{progress}</div>
      {!loading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}
      {error && <div>{error}</div>}
      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}

export default ImageUploader;
