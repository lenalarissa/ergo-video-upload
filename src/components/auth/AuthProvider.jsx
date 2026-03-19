import { clearAuth, refreshAccessToken, getUser } from "@/auth/auth.js";
import { useMemo, useState, useCallback } from "react";
import AuthContext from "@/components/auth/AuthContext.jsx";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const getAccessToken = useCallback(async () => {
    const result = await refreshAccessToken();

    if (result.invalidGrant) {
      logout();
      return null;
    }

    return result.accessToken;
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      getAccessToken,
    }),
    [user, logout, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
