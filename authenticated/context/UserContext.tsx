import React from "react";
import { User } from "../pages";

export type UserContextType = {
  isloggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserContext = React.createContext<UserContextType>({
  isloggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});
