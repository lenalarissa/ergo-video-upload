import { useNavigate } from "react-router-dom";
import { login } from "eqmod-ts-userlogin";
import { REGISTER_CLIENT, USER_CLIENT } from "@/auth/auth.js";
import useAuth from "@/auth/useAuth.js";

export default function SignIn() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function signIn(formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const result = await login(email, password, REGISTER_CLIENT, USER_CLIENT);
    localStorage.setItem("result", JSON.stringify(result));
    setUser(result.user);
    return result;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      await signIn(formData);
      navigate("/upload");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center content-center w-full max-w-sm m-4 h-56 border-2 rounded border-black p-4 gap-2"
      >
        <div className="flex flex-col gap-2 justify-around px-4">
          <label htmlFor="email" className="font-bold">
            e-mail:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="px-2 w-full border border-black"
          ></input>
        </div>
        <div className="flex flex-col gap-2 justify-around px-4">
          <label htmlFor="password" className="font-bold">
            Passwort:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className="px-2 w-full border border-black"
          ></input>
        </div>
        <div className="flex justify-end px-4 pt-2">
          <button
            type="submit"
            className="text-center bg-gray-300 text-black shadow rounded-sm border border-black p-2 text-xs sm:text-sm cursor-pointer"
          >
            Anmelden
          </button>
        </div>
      </form>
    </div>
  );
}
