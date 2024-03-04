import { useEffect, useState } from "react";
import { auth } from "../firebase";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsFetching(false);
        setIsAuthenticated(true);
        // auth.signOut();
      } else {
        setIsFetching(false);
        setIsAuthenticated(false);
      }
    });

    return () => unsub();
  }, []);

  return { isAuthenticated, isFetching };
}
