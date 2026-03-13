import Links from "@/components/Links.jsx";
import FileUpload from "@/components/FileUpload.jsx";
import QRCodeComp from "@/components/QRCodeComp.jsx";
import {useState} from "react";
import VideoTitle from "@/components/VideoTitle.jsx";

export default function MainContent({ mailLink }) {

    const [title, setTitle] = useState(null);
    const [video, setVideo] = useState(null);
    const [appLink, setAppLink] = useState(null);

    return (
        <main className="flex-1 flex flex-col items-center justify-evenly gap-6 px-2">
            {title === null ?
                <VideoTitle setTitle={setTitle}/> :
                <FileUpload title={title} setVideo={setVideo} setAppLink={setAppLink}/>
            }
            {video !== null &&
                <div>
                    <Links title={'Link für App:'}/>
                    <Links title={'Link für Mail:'}/>
                    <QRCodeComp url={ mailLink }/>
                </div>
            }
        </main>
    )
}