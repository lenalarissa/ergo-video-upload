import { useContext } from "react";
import AuthContext from "@/components/auth/AuthContext.jsx";

export default function useAuth() {
  const context = useContext(AuthContext);
  return context;
}