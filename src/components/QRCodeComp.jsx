import downloadIcon from "@/assets/datei-download.svg";
import QRCode from "react-qr-code";
import { useRef } from "react";
import handleDownloadQRCode from "@/utils/HandleDownloadQRCode.js";

export default function QRCodeComp({ url, videoId }) {
  const qrCodeRef = useRef(null);

  return (
    <div className="flex flex-col gap-2 w-full max-w-lg py-2">
      <h1 className="font-bold">QR-Code für Mail:</h1>
      <div className="flex flex-row xl:flex-col justify-around gap-4 ">
        <div className="flex flex-col justify-between gap-4 w-full">
          <div
            ref={(el) => {
              if (el) qrCodeRef.current = el;
            }}
            className="flex items-end justify-between gap-1"
          >
            <QRCode value={url} size={140} />
            <button
              className="flex gap-3 text-center bg-gray-300 text-black shadow rounded-sm border border-black p-1 px-4 text-xs sm:text-sm cursor-pointer"
              type="button"
              aria-label="SVG herunterladen"
              onClick={() => handleDownloadQRCode(qrCodeRef.current, videoId)}
            >
              Herunterladen
              <img className="w-4 h-4" src={downloadIcon} alt="Download Icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
