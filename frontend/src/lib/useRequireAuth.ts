import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireAuth(): boolean {
  const navigate = useNavigate();
  // No SSR here, so localStorage can be read straight through during render.
  const hasToken = localStorage.getItem("token") !== null;

  useEffect(() => {
    if (!hasToken) {
      navigate("/login", { replace: true });
    }
  }, [hasToken, navigate]);

  return hasToken;
}
