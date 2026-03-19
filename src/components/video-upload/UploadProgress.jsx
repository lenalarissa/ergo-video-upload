export default function UploadProgress({ title, uploadProgress }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6">
      <p className="font-bold text-center break-all text-ergo-rot">{title}</p>
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
  );
}
