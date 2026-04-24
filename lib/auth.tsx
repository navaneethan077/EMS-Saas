"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for auth state
    const auth = localStorage.getItem("ems_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = (email: string) => {
    localStorage.setItem("ems_auth", "true");
    localStorage.setItem("ems_user", email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("ems_auth");
    localStorage.removeItem("ems_user");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
