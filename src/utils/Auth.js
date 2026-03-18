import { getActualizedToken } from "eqmod-ts-userlogin";

const USER_CLIENT = {
  tokenUrl: import.meta.env.VITE_AUTH_HOST + "/oauth/token",
  clientId: import.meta.env.VITE_USER_CLIENT_ID,
  clientSecret: import.meta.env.VITE_USER_CLIENT_SECRET,
  scopes: (import.meta.env.VITE_USER_SCOPES || "")
    .split(/\s+/)
    .filter(Boolean),
};

export default async function getAccessToken() {
    const stored = localStorage.getItem("result");
    if (!stored) return null;
    
    let auth;
    try {
        auth = JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse stored auth result:", e);
        return null;
    }

    try {
        const updatedAuth = await getActualizedToken(auth, USER_CLIENT);
        localStorage.setItem("result", JSON.stringify(updatedAuth));
        return updatedAuth.access_token;
    } catch (e) {
        console.error("Failed to update access token:", e);
        return null;
    }
}