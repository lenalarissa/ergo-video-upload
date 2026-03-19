import entfernenIcon from "@/assets/entfernen.svg";

export default function SuccessfullUpload({ title, removeVideo }) {
  return (
    <div className="relative flex flex-col items-center flex-1 justify-center gap-2 m-15 p-4 border-black bg-white border-2 rounded shadow-lg">
      <button className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white cursor-pointer">
        <img src={entfernenIcon} alt="Remove Icon" onClick={removeVideo} />
      </button>
      Erfolgreich hochgeladen:
      <p className="font-bold text-center break-all text-ergo-rot px-2">
        {title}
      </p>
    </div>
  );
}
