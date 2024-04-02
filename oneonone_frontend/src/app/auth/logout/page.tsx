"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push("/auth/login"); // Redirect to login page after logout
  }, [logout, router]);

  return null; // Render nothing or a loading indicator
};

export default LogoutPage;
