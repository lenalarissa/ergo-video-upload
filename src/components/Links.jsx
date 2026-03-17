import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import { useRef } from "react";
import copy from "copy-to-clipboard";

export default function Links({ title, link }) {
  const textRef = useRef();

  return (
    <div className="flex flex-col gap-2 justify-between w-full max-w-lg py-2">
      <h1 className="font-bold">{title}</h1>
      <div className="flex justify-between items-center gap-4 wrap-anywhere">
        <p ref={textRef}>{link}</p>

        <button
          className="flex gap-3 text-center bg-gray-300 shadow rounded-sm border border-black p-2 cursor-pointer"
          onClick={() => copy(link)}
          type="button"
        >
          <img className="w-4 h-4" src={copyIcon} alt="Kopieren Icon" />
        </button>
      </div>
    </div>
  );
}
