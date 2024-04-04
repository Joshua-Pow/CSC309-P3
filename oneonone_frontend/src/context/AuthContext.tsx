import { RegisterUser } from "@/app/auth/register/page";
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserDetails = Omit<RegisterUser, "password" | "password2">;

interface AuthStateLoggedIn {
  isLoggedIn: true;
  userDetails: UserDetails; // userDetails is always present when isLoggedIn is true
  login: (
    accessToken: string,
    refreshToken: string,
    userDetails: UserDetails,
  ) => void;
  logout: () => void;
}

interface AuthStateLoggedOut {
  isLoggedIn: false;
  userDetails: null; // userDetails is null when isLoggedIn is false
  login: (
    accessToken: string,
    refreshToken: string,
    userDetails: UserDetails,
  ) => void;
  logout: () => void;
}

type AuthContextType = AuthStateLoggedIn | AuthStateLoggedOut;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    window.addEventListener("refreshTokenFailed", logout);

    return () => {
      window.removeEventListener("refreshTokenFailed", logout);
    };
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userDetailsString = localStorage.getItem("userDetails");
    const userDetails = userDetailsString
      ? JSON.parse(userDetailsString)
      : null;
    setIsLoggedIn(!!accessToken);
    setUserDetails(userDetails);
  }, []);

  const login = (
    accessToken: string,
    refreshToken: string,
    userDetails: UserDetails,
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    setUserDetails(userDetails);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userDetails");
    setUserDetails(null);
    setIsLoggedIn(false);
  };

  const contextValue = isLoggedIn
    ? ({ isLoggedIn, login, logout, userDetails } as AuthStateLoggedIn)
    : ({ isLoggedIn, login, logout, userDetails: null } as AuthStateLoggedOut);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
