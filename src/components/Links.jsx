import copyIcon from "@/assets/kopieren-und-einfugen.svg";
import { useRef } from "react";
import copy from 'copy-to-clipboard';

export default function Links({title}) {

    const textRef = useRef();

    return (
        <div className="flex flex-col gap-2 justify-around w-full max-w-sm p-4">
            <h1 className="font-bold">{title}</h1>
            <div className="flex justify-between items-center gap-4 border rounded border-gray-400 px-2 py-1">
                <p ref={textRef}>https://bsplink.de</p>
                <button className="w-4 h-4 cursor-pointer" onClick={() => copy(textRef.current.textContent)}>
                    <img src={copyIcon} alt="Kopieren Icon"/>
                </button>
            </div>
        </div>
    )
}