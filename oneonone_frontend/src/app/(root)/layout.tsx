"use client";
import CustomNavbar from "@/components/CustomNavbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, userDetails } = useAuth();
  return (
    <section>
      <CustomNavbar isLoggedIn={isLoggedIn} userDetails={userDetails} />

      {children}
    </section>
  );
}
