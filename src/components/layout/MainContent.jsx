import Link from "@/components/video-upload/Link.jsx";
import VideoUpload from "@/components/video-upload/VideoUpload.jsx";
import QrCode from "@/components/video-upload/QrCode.jsx";
import { useState } from "react";
import VideoTitle from "@/components/video-upload/VideoTitle.jsx";

export default function MainContent({ mailLink, pollForMailLink }) {
  const [title, setTitle] = useState(null);
  const [appLink, setAppLink] = useState("");
  const [videoId, setVideoId] = useState(null);

  return (
    <main className="flex-1 flex flex-col items-center justify-evenly gap-6">
      {title === null ? (
        <VideoTitle setTitle={setTitle} />
      ) : (
        <VideoUpload
          title={title}
          setAppLink={setAppLink}
          pollForMailLink={pollForMailLink}
          setVideoId={setVideoId}
          setTitle={setTitle}
        />
      )}
      {videoId !== null && (
        <div className="w-full max-w-lg">
          <Link title={"Link für App:"} link={appLink} />
          <Link title={"Link für Mail:"} link={mailLink} />
          <QrCode url={mailLink} videoId={videoId} />
        </div>
      )}
    </main>
  );
}
