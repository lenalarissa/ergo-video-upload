import Links from "@/components/Links.jsx";
import FileUpload from "@/components/FileUpload.jsx";
import QRCodeComp from "@/components/QRCodeComp.jsx";
import { useState } from "react";
import VideoTitle from "@/components/VideoTitle.jsx";

export default function MainContent({ mailLink, pollForMailLink }) {
  const [title, setTitle] = useState(null);
  const [video, setVideo] = useState(null);
  const [appLink, setAppLink] = useState("");
  const [videoId, setVideoId] = useState(null);

  return (
    <main className="flex-1 flex flex-col items-center justify-evenly gap-6">
      {title === null ? (
        <VideoTitle setTitle={setTitle} />
      ) : (
        <FileUpload
          title={title}
          setVideo={setVideo}
          setAppLink={setAppLink}
          pollForMailLink={pollForMailLink}
          setVideoId={setVideoId}
          setTitle={setTitle}
        />
      )}
      {video !== null && (
        <div className="w-full max-w-lg">
          <Links title={"Link für App:"} link={appLink} />
          <Links title={"Link für Mail:"} link={mailLink} />
          <QRCodeComp url={mailLink} videoId={videoId} />
        </div>
      )}
    </main>
  );
}
