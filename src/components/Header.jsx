import logOutIcon from "@/assets/ausloggen.svg";
import archiveIcon from "@/assets/archiv.svg";
import uploadIcon from "@/assets/hochladen.svg";
import { useLocation, useHistory } from "react-router-dom";

export default function Header({ user, setUser }) {
  const location = useLocation();
  const history = useHistory();

  const src = location.pathname === "/upload" ? archiveIcon : uploadIcon;
  const targetPath = location.pathname === "/upload" ? "/gallery" : "/upload";
  const alt =
    location.pathname === "/upload" ? "Archive Icon" : "Video Upload Icon";

  function signOut() {
    localStorage.removeItem("result");
    setUser(null);
    history.push("/signIn");
  }

  return (
    <header className="grid grid-cols-3 items-center h-20 px-4 bg-gray-300">
      {user !== null && (
        <button
          className="flex items-center justify-center justify-self-start sm p-2 pl-2 cursor-pointer"
          onClick={() => history.push(targetPath)}
        >
          <div className="w-10 h-10">
            <img src={src} alt={alt} />
          </div>
        </button>
      )}
      <h1 className="pl-6 sm:pl-0 text-xl sm:text-3xl md:text-4xl font-bold tracking-wider sm:text-center text-ergo-rot">
        Video Upload
      </h1>
      {user !== null && (
        <button
          className="flex items-center justify-center justify-self-end p-2 text-black pr-2 shadow rounded-sm border border-black cursor-pointer"
          onClick={signOut}
        >
          <div className="w-5 h-5">
            <img src={logOutIcon} alt="Log Out Icon" />
          </div>
        </button>
      )}
    </header>
  );
}
