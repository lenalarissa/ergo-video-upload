export default function VideoProcessing({ title, removeVideo }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6 text-center">
      <p className="font-bold text-2xl break-all text-ergo-rot">{title}</p>
      <p className="font-bold">Upload abgeschlossen.</p>
      <p className="text-sm max-w-md p-4">
        Das Video wird nun verarbeitet. Die Links stehen in Kürze zur Verfügung.
        Sie können auf dieser Seite bleiben – die Links erscheinen automatisch,
        sobald sie bereit sind. Alternativ finden Sie das Video später auch in
        der Video-Übersicht, sobald alle Links zur Verfügung stehen.
      </p>
      <button
        onClick={removeVideo}
        className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-1 px-4 text-xs sm:text-sm cursor-pointer"
      >
        Neues Video hochladen
      </button>
    </div>
  );
}
