import VideoCard from "@/components/VideoCard.jsx";
import copy from "copy-to-clipboard";
import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import downloadIcon from "@/assets/datei-download.svg";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

export default function VideoGallery({ createMailLink }) {
  const [videos, setVideos] = useState([]);
  const [mailLinks, setMailLinks] = useState({});
  const [appLinks, setAppLinks] = useState({});
  const [qrCodeLinks, setQrCodeLinks] = useState({});

  const [page, setPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    const offset = (page - 1) * pageSize;
    async function fetchVideos() {
      try {
        const response = await fetch(
          `https://ergopro-ecloud.equeo.de/rest/v1/videos?tags=ergo,ergo%20pro&limit=50&offset=${offset}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          },
        );
        const result = await response.json();
        const list = Array.isArray(result)
          ? result
          : Array.isArray(result?.media)
            ? result.media
            : Array.isArray(result?.video)
              ? result.video
              : Array.isArray(result?.data)
                ? result.data
                : [];
        setVideos(list);
        setTotalVideos(Number(result.total || 0));
      } catch (e) {
        console.error(e);
      }
    }

    fetchVideos();
  }, [page]);

  const qrCodeRefs = useRef({});

  async function handleLoadMailLink(videoId) {
    if (mailLinks[videoId]) return;

    try {
      const link = await createMailLink(videoId);

      setMailLinks((prev) => ({
        ...prev,
        [videoId]: link,
      }));
    } catch (e) {
      console.error(e);
      setMailLinks((prev) => ({
        ...prev,
        [videoId]: "-",
      }));
    }
  }

  async function handleGetQRCodeLink(videoId) {
    if (qrCodeLinks[videoId]) return;

    let link = mailLinks[videoId];

    if (!link) {
      link = await createMailLink(videoId);
    }
    if (!link || link === "-") return;
    setQrCodeLinks((prev) => ({
      ...prev,
      [videoId]: link,
    }));
  }

  function handleDownloadQRCode(videoId) {
    const container = qrCodeRefs.current[videoId];
    const svgElement = container?.querySelector("svg");
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgText = serializer.serializeToString(svgElement);
    const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${videoId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function convertDuration(totalMinutes) {
    const totalSeconds = Math.round(totalMinutes * 60);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  }

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const formattedDate = Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    const formattedTime = Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }).format(date);

    return { formattedDate, formattedTime };
  }

  function createThumbnailLink(id) {
    return `https://cdn.jwplayer.com/thumbs/${id}.jpg`;
  }

  const totalPages = Math.max(1, Math.ceil(totalVideos / pageSize));

  function setPageClamped(targetPage) {
    const clamped = Math.min(Math.max(1, targetPage), totalPages);
    setPage(clamped);
  }

  function createAppLink(videoId) {
    if (appLinks[videoId]) return;

    try {
      const link = `https://cdn.equeo.de/manifests/${videoId}.m3u8`;

      setAppLinks((prev) => ({
        ...prev,
        [videoId]: link,
      }));
    } catch (e) {
      console.error(e);
      setAppLinks((prev) => ({
        ...prev,
        [videoId]: "-",
      }));
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1">
        <div className="w-full hidden lg:block overflow-x-auto">
          <div className="w-full px-4">
            {videos.length !== 0 && (
              <table className="table-fixed w-full text-xs sm:text-sm text-left rtl:text-right text-body">
                <colgroup>
                  <col className="w-5/15" />
                  <col className="w-1/15" />
                  <col className="w-1/15" />
                  <col className="w-2/15" />
                  <col className="w-2/15" />
                  <col className="w-2/15" />
                  <col className="w-2/15" />
                </colgroup>
                <thead className="text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                  <tr>
                    <th className="px-6 py-3">Titel</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Länge</th>
                    <th className="px-6 py-3">Upload</th>
                    <th className="px-6 py-3 min-w-65">App Link</th>
                    <th className="px-6 py-3 min-w-65">Mail Link</th>
                    <th className="px-6 py-3">QR Code</th>
                  </tr>
                </thead>
                <tbody className="bg-neutral-primary border-b border-default">
                  {videos.map((video) => {
                    const key = video.id;
                    const title = video?.metadata?.title;
                    const status = video.status;
                    const duration = convertDuration(video.duration);
                    const created = formatDateTime(video.created);
                    const mailLink = mailLinks[key];
                    const appLink = appLinks[key];
                    const qrCodeLink = qrCodeLinks[key];

                    return (
                      <tr
                        key={key}
                        className="align-middle even:bg-white odd:bg-gray-100"
                      >
                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                          <div className="flex items-center gap-3 min-w-88">
                            <img
                              className="w-32 flex-none"
                              src={createThumbnailLink(key)}
                              alt=""
                            />
                            <p className="min-w-0 flex-1 wrap-anywhere pr-8">
                              {title}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          {status}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                          {duration}
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4 align-middle">
                          <div className="flex flex-col ">
                            <p className="whitespace-nowrap">
                              {created.formattedDate}
                            </p>
                            <p className="whitespace-nowrap">
                              {created.formattedTime}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                          {!appLink && (
                            <button
                              type="button"
                              className="underline cursor-pointer hover:text-blue-400"
                              onClick={() => createAppLink(key)}
                            >
                              anzeigen
                            </button>
                          )}
                          {appLink && (
                            <div className="flex items-center gap-3 min-w-0">
                              <a
                                href={appLink}
                                target="_blank"
                                rel="noreferrer"
                                className="min-w-0 flex-1 wrap-anywhere"
                              >
                                {appLink}
                              </a>
                              <button
                                className="w-4 h-4 cursor-pointer flex-none"
                                onClick={() => copy(appLink)}
                                type="button"
                              >
                                <img src={copyIcon} alt="Kopieren Icon" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                          {!mailLink && (
                            <button
                              type="button"
                              className="underline cursor-pointer hover:text-blue-400"
                              onClick={() => handleLoadMailLink(key)}
                            >
                              anzeigen
                            </button>
                          )}
                          {mailLink && (
                            <div className="flex items-center gap-3 min-w-0">
                              <a
                                href={mailLink}
                                target="_blank"
                                rel="noreferrer"
                                className="min-w-0 flex-1 wrap-anywhere"
                              >
                                {mailLink}
                              </a>
                              <button
                                className="w-4 h-4 cursor-pointer flex-none"
                                onClick={() => copy(mailLink)}
                                type="button"
                              >
                                <img src={copyIcon} alt="Kopieren Icon" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-4 sm:px-6 py-2 sm:py-4">
                          {!qrCodeLink && (
                            <button
                              type="button"
                              className="underline cursor-pointer hover:text-blue-400"
                              onClick={() => handleGetQRCodeLink(key)}
                            >
                              anzeigen
                            </button>
                          )}
                          {qrCodeLink && (
                            <div
                              ref={(el) => {
                                if (el) qrCodeRefs.current[key] = el;
                              }}
                              className="flex items-center justify-between gap-1"
                            >
                              <QRCode value={qrCodeLink} size={80} />
                              <button
                                className="w-8 h-8 p-1 cursor-pointer"
                                onClick={() => handleDownloadQRCode(key)}
                                type="button"
                                aria-label="SVG herunterladen"
                              >
                                <img src={downloadIcon} alt="Download Icon" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="w-full p-2 block lg:hidden">
          <div>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                convertDuration={convertDuration}
                formatDateTime={formatDateTime}
                createThumbnailLink={createThumbnailLink}
                mailLinks={mailLinks}
                appLinks={appLinks}
                qrCodeLinks={qrCodeLinks}
                handleLoadMailLink={handleLoadMailLink}
                handleGetQRCodeLink={handleGetQRCodeLink}
                handleDownloadQRCode={handleDownloadQRCode}
                createAppLink={createAppLink}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center p-4">
        <button
          type="button"
          onClick={() => setPageClamped(page - 1)}
          disabled={page <= 1}
          className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
        >
          Zurück
        </button>
        <span>
          Seite {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPageClamped(page + 1)}
          disabled={page >= totalPages}
          className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
