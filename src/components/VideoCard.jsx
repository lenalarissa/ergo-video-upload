import { useState, useRef } from "react";
import QRCode from "react-qr-code";
import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import downloadIcon from "@/assets/datei-download.svg";
import copy from "copy-to-clipboard";

export default function VideoCard({
  video,
  convertDuration,
  formatDateTime,
  createThumbnailLink,
  mailLinks = {},
  appLinks = {},
  qrCodeLinks = {},
  handleLoadMailLink = () => {},
  handleGetQRCodeLink = () => {},
  handleDownloadQRCode = () => {},
  createAppLink = () => {},
}) {
  const mailLink = mailLinks?.[video.id];
  const appLink = appLinks?.[video.id];
  const qrCodeLink = qrCodeLinks?.[video.id];

  const [open, setOpen] = useState(false);

  const { formattedDate, formattedTime } = formatDateTime(video.created);

  const qrCodeRefs = useRef({});

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm my-2 mr-2 ">
      <button
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <img
            className="w-16 flex-none rounded"
            src={createThumbnailLink(video.id)}
            alt=""
          />
          <p className="text-xs font-semibold min-w-0 wrap-break-word">
            {video.metadata.title}
          </p>
        </div>
        <span className="text-xl leading-none select-none">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="flex flex-col gap-2 px-4 pb-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Status</span>
            {video.status}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Länge</span>
            {convertDuration(video.duration)}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Upload</span>
            <p className="whitespace-nowrap">
              {formattedDate}, {formattedTime} Uhr
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">App-Link</span>
            {!appLink && (
              <button
                type="button"
                className="underline cursor-pointer hover:text-blue-400"
                onClick={() => createAppLink(video.id)}
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
                  className="min-w-0 flex-1 wrap-anywhere text-right"
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
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Mail-Link</span>
            {!mailLink && (
              <button
                type="button"
                className="underline cursor-pointer hover:text-blue-400"
                onClick={() => handleLoadMailLink(video.id)}
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
                  className="min-w-0 flex-1 wrap-anywhere text-right"
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
          </div>
          <div className="flex items-start  justify-between gap-3">
            <span className="text-gray-500">QR-Code</span>
            {!qrCodeLink && (
              <button
                type="button"
                className="underline cursor-pointer hover:text-blue-400"
                onClick={() => handleGetQRCodeLink(video.id)}
              >
                anzeigen
              </button>
            )}
            {qrCodeLink && (
              <div
                ref={(el) => {
                  if (el) qrCodeRefs.current[video.id] = el;
                }}
                className="flex items-center justify-between gap-3"
              >
                <QRCode value={qrCodeLink} size={80} />
                <button
                  className="w-6 h-6 p-1 cursor-pointer"
                  onClick={() => handleDownloadQRCode(video.id)}
                  type="button"
                  aria-label="SVG herunterladen"
                >
                  <img src={downloadIcon} alt="Download Icon" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
