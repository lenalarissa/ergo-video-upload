import uploadIcon from '@/assets/datei-upload.svg';
import videoIcon from '@/assets/video.svg';
import entfernenIcon from '@/assets/entfernen.svg';
import {useState} from "react";

export default function FileUpload({ title, setVideo, setAppLink }) {

    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

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

    async function uploadVideo(uploadLink, file) {
        /*try {
            const response = await fetch(uploadLink, {
                method: "PUT",
                duplex: "half",
                body: file,
            })
            if (!response.ok) {
                const text = await response.text();
                console.error("Upload failed:", response.status, text);
                throw new Error("Upload failed");
            }

            console.log("Upload erfolgreich");
            setVideo(file);
        } catch (e) {
            console.log(e);
        }*/
        try {
            setUploadedVideo(file);
            setIsUploading(true);
            setUploadProgress(0);

            await uploadWithProgress(uploadLink, file);

            setVideo(file);
            setUploadProgress(100);
            setIsUploading(false);
        } catch (e) {
            console.log(e);
            setIsUploading(false);
            setUploadProgress(0);
        }
    }

    async function uploadTitle(title, type, file) {
        try {
            const response = await fetch("https://ergopro-ecloud.equeo.de/videos/createMedia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, type })
            });
            const result = await response.json();
            console.log(result.upload_link);
            uploadVideo(result.upload_link, file)
        } catch (e) {
            console.log(e);
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    }
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) return;
        uploadTitle(title, file.type, file);
    };

    async function onFileUpload(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        uploadTitle(title, file.type, file);
    }

    function removeVideo() {
        setUploadedVideo(null);
    }

    return (
        <div
            className={`flex flex-col min-h-60 w-full max-w-sm bg-gray-50 border-gray-400 border-2 rounded border-dashed
            ${isDragging ? "border-ergo-rot bg-gray-100" : "border-gray-400"}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {isUploading ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6">
                    <p className="text-sm text-center break-all">{title}</p>
                    <div className="w-full max-w-xs">
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-ergo-rot transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-sm text-center mt-2">
                            Upload läuft... {uploadProgress}%
                        </p>
                    </div>
                </div>
            ) : uploadedVideo ? (
                <div
                    className="relative flex flex-col items-center flex-1 justify-center gap-2 m-15 border-ergo-rot border-2 rounded shadow-lg">
                    <button
                        className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white cursor-pointer">
                        <img src={entfernenIcon} alt="Remove Icon" onClick={removeVideo}/>
                    </button>
                    <div className="max-w-10">
                        <img src={videoIcon} alt="Video Icon"/>
                    </div>
                    <p className="text-sm text-center">{uploadedVideo.name}</p>
                </div>
            ) : (
                <div className="min-h-60 flex flex-col items-center w-full max-w-sm text-center">
                    <div className="flex-1 flex items-center justify-center flex-col gap-4">
                        <div className="max-w-10">
                            <img src={uploadIcon} alt="File Upload Icon"/>
                        </div>
                        <p className="font-bold ">Drag & Drop Video hier.</p>
                    </div>
                    <hr className="w-full border border-gray-400 border-dashed"/>
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
            )
            }
        </div>
    )
}