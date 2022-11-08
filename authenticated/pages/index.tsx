import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import UserPage from "../components/UserPage";
import LoginPage from "../components/LoginPage";
import { UserContext, UserContextType } from "../context/UserContext";

export type User = {
  username: string;
};

// TODO: after login authentication, change isLoggedIn and user state
const Home: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const userContextValue: UserContextType = {
    isloggedIn: isLoggedIn,
    setIsLoggedIn: setIsLoggedIn,
    user: user,
    setUser: setUser,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <div>
        <Head>
          <title>Authenticated</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {!isLoggedIn && <LoginPage />}
        {isLoggedIn && <UserPage />}
      </div>
    </UserContext.Provider>
  );
};

export default Home;
