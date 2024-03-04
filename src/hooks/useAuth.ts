import { useEffect, useState } from "react";

import { User } from "firebase/auth";
import { auth } from "@/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
        setIsFetching(false);
        setIsAuthenticated(true);
      } else {
        setIsFetching(false);
        setIsAuthenticated(false);
      }
    });

    return () => unsub();
  }, []);

  return { isAuthenticated, isFetching, user };
}
