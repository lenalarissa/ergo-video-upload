import { getActualizedToken } from "eqmod-ts-userlogin";

export const AUTH_HOST = import.meta.env.VITE_AUTH_HOST;

export const REGISTER_CLIENT = {
    tokenUrl: `${AUTH_HOST}/oauth/token`,
    clientId: import.meta.env.VITE_REGISTER_CLIENT_ID,
    clientSecret: import.meta.env.VITE_REGISTER_CLIENT_SECRET,
    scopes: ["authUser:read", "authUser:register"],
  };


export const USER_CLIENT = {
  tokenUrl: import.meta.env.VITE_AUTH_HOST + "/oauth/token",
  clientId: import.meta.env.VITE_USER_CLIENT_ID,
  clientSecret: import.meta.env.VITE_USER_CLIENT_SECRET,
  scopes: (import.meta.env.VITE_USER_SCOPES || "")
    .split(/\s+/)
    .filter(Boolean),
};

export function clearAuth() {
    localStorage.removeItem("result");
}

function getStoredAuth() {
  const stored = localStorage.getItem("result");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function refreshAccessToken() {
    const auth = getStoredAuth();
    if (!auth) return { accessToken: null, invalidGrant: false };

    try {
        const updatedAuth = await getActualizedToken(auth, USER_CLIENT);
        localStorage.setItem("result", JSON.stringify(updatedAuth));

        return {
            accessToken: updatedAuth.access_token,
            invalidGrant: false,
        };
    } catch (e) {
        console.error(e);

        const invalidGrant =
            e?.response?.data?.error === "invalid_grant" ||
            e?.error === "invalid_grant";

        if (invalidGrant) {
            clearAuth();
        }

        return {
            accessToken: null,
            invalidGrant,
        };
    }
}

export function getUser() {
    const userData = localStorage.getItem("result");

    try {
        const user = userData ? JSON.parse(userData).user : null;
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}