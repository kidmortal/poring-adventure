import { useEffect, useState } from "react";

import { auth } from "@/firebase";
import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

type LoginData = {
  accessToken?: string;
  email?: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<LoginData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    if (Capacitor.getPlatform() === "android") {
      Promise.all([
        FirebaseAuthentication.getIdToken(),
        FirebaseAuthentication.getCurrentUser(),
      ])
        .then((values) => {
          const [tokenInfo, userInfo] = values;
          setUser({
            accessToken: tokenInfo.token,
            email: userInfo.user?.email,
          });
          setIsFetching(false);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsFetching(false);
          setIsAuthenticated(false);
        });
      return;
    }

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
