import uploadIcon from "@/assets/datei-upload.svg";
import { useState } from "react";
import useAuth from "@/auth/useAuth.js";
import UploadProgress from "@/components/video-upload/UploadProgress.jsx";
import SuccessfullUpload from "./SuccessfullUpload";
import VideoProcessing from "./VideoProcessing.jsx";

export default function VideoUpload({
  title,
  setAppLink,
  pollForMailLink,
  setVideoId,
  setTitle,
}) {
  const { getAccessToken } = useAuth();
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const [isDragging, setIsDragging] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  function onProgress(percent) {
    setUploadProgress(Math.round(percent));
  }

  function uploadWithProgress(url, file) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && typeof onProgress === "function") {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error("Upload failed: " + xhr.status));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(file);
    });
  }

  async function uploadVideo(uploadLink, file, id) {
    try {
      setUploadedVideo(file);
      setIsUploading(true);
      setIsProcessing(false);
      setUploadProgress(0);

      await uploadWithProgress(uploadLink, file);
      setUploadProgress(100);
      setIsProcessing(true);
      setIsUploading(false);

      const mailUrl = await pollForMailLink(id);
      if (mailUrl && mailUrl !== "") {
        setAppLink(`https://cdn.equeo.de/manifests/${id}.m3u8`);
        setVideoId(id);
        setIsUploading(false);
        setIsProcessing(false);
      } else {
        setIsUploading(false);
      }
    } catch (e) {
      console.error(e);
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  }

  async function uploadTitle(title, type, file) {
    try {
      const token = await getAccessToken();
      if (!token) {
        return;
      }
      const response = await fetch(
        "https://ergopro-ecloud.equeo.de/rest/v1/videos/createMedia",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ title, type }),
        },
      );
      const result = await response.json();

      uploadVideo(result.upload_link, file, result.id);
    } catch (e) {
      console.error(e);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) return;
    uploadTitle(title, file.type, file);
  };

  async function onFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadTitle(title, file.type, file);
  }

  function removeVideo() {
    setUploadedVideo(null);
    setVideoId(null);
    setAppLink("");
    setIsUploading(false);
    setIsProcessing(false);
    setUploadProgress(0);
    setTitle(null);
  }

  return (
    <div
      className={`flex flex-col min-h-60 w-full max-w-lg bg-gray-50 border-gray-400 border-2 rounded border-dashed
            ${isDragging ? "border-ergo-rot bg-gray-100" : "border-gray-400"}
            `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {isUploading ? (
        <UploadProgress title={title} uploadProgress={uploadProgress} />
      ) : isProcessing ? (
        <VideoProcessing title={title} removeVideo={removeVideo} />
      ) : uploadedVideo ? (
        <SuccessfullUpload title={title} removeVideo={removeVideo} />
      ) : (
        <div className="min-h-60 flex flex-col items-center w-full max-w-lg text-center">
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="max-w-10">
              <img src={uploadIcon} alt="File Upload Icon" />
            </div>
            <p className="font-bold ">Drag & Drop Video hier.</p>
          </div>
          <hr className="w-full border border-gray-400 border-dashed" />
          <div className="h-max flex-1 flex flex-col gap-4 items-center justify-center">
            <input
              id="file"
              type="file"
              multiple={false}
              className="hidden"
              accept="video/*"
              onChange={onFileUpload}
            />

            <label
              htmlFor="file"
              className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-2 text-xs sm:text-sm cursor-pointer"
            >
              Datei auswählen
            </label>
            <p className=" text-sm">MP4 und WebM sind erlaubt.</p>
          </div>
        </div>
      )}
    </div>
  );
}
