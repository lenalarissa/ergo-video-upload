import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import downloadIcon from "@/assets/datei-download.svg";
import QRCode from "react-qr-code";

export default function QRCodeComp({ mailLink }) {

    return (
        <div className="flex flex-col gap-2 w-full max-w-sm p-4">
            <h1 className="font-bold">QR-Code für Mail:</h1>
            <div className="flex flex-row xl:flex-col justify-around gap-4 ">
                <div className="w-100 lg:w-full px-2">
                    <QRCode value={mailLink} size={80}/>
                </div>
                <div className="flex flex-col justify-between gap-4 w-full">
                    <button
                        className="flex w-full justify-between items-center text-xs sm:text-sm p-2 bg-gray-300 text-black pr-2 shadow rounded-sm border border-black cursor-pointer">
                        Kopieren
                        <div className="w-5 h-5">
                            <img src={copyIcon} alt="Kopieren Icon"/>
                        </div>
                    </button>
                    <button
                        className="flex w-full justify-between items-center text-xs sm:text-sm p-2 bg-gray-300 text-black pr-2 shadow rounded-sm border border-black cursor-pointer">
                        SVG herunterladen
                        <div className="w-5 h-5">
                            <img src={downloadIcon} alt="Kopieren Icon"/>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}