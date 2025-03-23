import { createContext } from "react";

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  currentUser: { id: string; email: string | null } | null;
  setIsAuthenticated: (value: boolean) => void;
  setCurrentUser: (user: { id: string; email: string | null } | null) => void;
}>({
  isAuthenticated: false,
  currentUser: null,
  setIsAuthenticated: () => {},
  setCurrentUser: () => {},
});
