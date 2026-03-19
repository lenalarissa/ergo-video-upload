import VideoCard from "@/components/video-table/VideoCard.jsx";
import copy from "copy-to-clipboard";
import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import downloadIcon from "@/assets/datei-download.svg";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import handleDownloadQRCode from "@/utils/handleDownloadQRCode.js";
import useAuth from "@/auth/useAuth.js";
import {
  convertDuration,
  formatDateTime,
  createThumbnailLink,
} from "@/utils/videoTableUtilities.js";

export default function VideoTable({ createMailLink }) {
  const { getAccessToken } = useAuth();

  const [videos, setVideos] = useState([]);
  const [mailLinks, setMailLinks] = useState({});
  const [appLinks, setAppLinks] = useState({});
  const [qrCodeLinks, setQrCodeLinks] = useState({});

  const [page, setPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [notice, setNotice] = useState(null);

  const [sortBy, setSortBy] = useState("created");
  const [sortOrder, setSortOrder] = useState("dsc");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const qrCodeRefs = useRef({});

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(totalVideos / pageSize));

  function setPageClamped(targetPage) {
    const clamped = Math.min(Math.max(1, targetPage), totalPages);
    setPage(clamped);
  }

  function sortTable(column) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "dsc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
    setPage(1);
  }

  function getSortIndicator(column) {
    if (sortBy === column) {
      return sortOrder === "asc" ? " ↑" : " ↓";
    }
  }

  useEffect(() => {
    const offset = (page - 1) * pageSize;

    const query = search ? `&search=${encodeURIComponent(search)}` : "";

    async function fetchVideos() {
      try {
        const token = await getAccessToken();
        if (!token) {
          return;
        }

        // default: sort=created und order=dsc
        // sort, but no order: asc als default
        // order, but nor sort: created als default
        const response = await fetch(
          `https://ergopro-ecloud.equeo.de/rest/v1/videos?tags=ergo,ergo%20pro&limit=50&offset=${offset}&sort=${sortBy}&order=${sortOrder}${query}`,
          {
            headers: {
              Authorization: "Bearer " + token,
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
  }, [page, sortBy, sortOrder, search, getAccessToken]);

  function showNotice(message) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  async function handleLoadMailLink(videoId) {
    if (mailLinks[videoId]) return;

    try {
      const link = await createMailLink(videoId);

      if (!link || link === "") {
        showNotice(
          "Die Mail-Link-Generierung ist noch nicht abgeschlossen. Bitte versuchen Sie es in einigen Minuten erneut.",
        );
      }

      setMailLinks((prev) => ({
        ...prev,
        [videoId]: link,
      }));
    } catch (e) {
      console.error(e);
      setMailLinks((prev) => ({
        ...prev,
        [videoId]: "",
      }));
    }
  }

  async function handleGetQRCodeLink(videoId) {
    if (qrCodeLinks[videoId]) return;

    let link = mailLinks[videoId];

    if (!link) {
      link = await createMailLink(videoId);
    }
    if (!link || link === "") {
      showNotice(
        "Die Mail-Link-Generierung ist noch nicht abgeschlossen. Bitte versuchen Sie es in einigen Minuten erneut.",
      );
    }

    if (!link || link === "") return;
    setQrCodeLinks((prev) => ({
      ...prev,
      [videoId]: link,
    }));
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
      {notice && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded border border-black bg-white px-4 py-3 shadow-lg text-sm">
          {notice}
        </div>
      )}
      <div className="flex flex-1">
        <div className="w-full hidden lg:block overflow-x-auto">
          <div className="w-full px-4">
            {videos.length !== 0 && (
              <div>
                <div className="p-4 w-full">
                  <label for="search" className="sr-only">
                    Titel suchen
                  </label>
                  <div className="relative">
                    <div className="absolute flex items-center pointer-events-none"></div>
                    <input
                      type="text"
                      id="search"
                      className="block w-full ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand px-3 shadow-xs placeholder:text-body"
                      placeholder="Titel suchen"
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSearch(searchInput);
                          setPage(1);
                        }
                      }}
                    />
                  </div>
                </div>
                <table className="table-fixed w-full text-xs sm:text-sm text-left rtl:text-right text-body">
                  <colgroup>
                    <col className="w-5/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                    <col className="w-2/15" />
                  </colgroup>
                  <thead className="text-body bg-neutral-secondary-soft border-b rounded-base border-default">
                    <tr>
                      <th
                        className="px-6 py-3 cursor-pointer"
                        onClick={() => sortTable("title")}
                      >
                        Titel{getSortIndicator("title")}
                      </th>
                      <th
                        className="px-6 py-3 cursor-pointer"
                        onClick={() => sortTable("duration")}
                      >
                        Länge{getSortIndicator("duration")}
                      </th>
                      <th
                        className="px-6 py-3 cursor-pointer"
                        onClick={() => sortTable("created")}
                      >
                        Upload{getSortIndicator("created")}
                      </th>
                      <th className="px-6 py-3 min-w-65">App Link</th>
                      <th className="px-6 py-3 min-w-65">Mail Link</th>
                      <th className="px-6 py-3">QR Code</th>
                    </tr>
                  </thead>
                  <tbody className="bg-neutral-primary border-b border-default">
                    {videos.map((video) => {
                      const key = video.id;
                      const title = video?.metadata?.title;
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
                                alt="Thumbnail"
                              />
                              <p className="min-w-0 flex-1 wrap-anywhere pr-8">
                                {title}
                              </p>
                            </div>
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
                                  onClick={() =>
                                    handleDownloadQRCode(
                                      qrCodeRefs.current[key],
                                      key,
                                    )
                                  }
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
              </div>
            )}
          </div>
        </div>
        <div className="w-full p-2 block lg:hidden">
          <div>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
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
