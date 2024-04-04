"use client";
import React, { useState, useEffect } from "react";
import FriendsList from "@/components/FriendsList";
import IncomingList from "@/components/IncomingList";
import OutgoingList from "@/components/OutgoingList";
import AddContacts from "@/components/AddContacts";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Props = {};

const Contacts = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isLoggedIn, router]);
  const [activeList, setActiveList] = useState<
    "friends" | "outgoing" | "incoming"
  >("friends");
  const [showAddContactsModal, setShowAddContactsModal] = useState(false);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="sticky top-0 z-10 w-full">
        <main className="flex flex-1 flex-col items-center justify-start p-4">
          <div className="w-full max-w-2xl justify-center rounded-xl border bg-card p-4 shadow">
            <h3 className="mb-1 text-center text-2xl font-bold">Contacts</h3>
            <p className="mb-4 text-center text-sm">
              Manage all your contacts here.
            </p>
            <div className="mb-4 flex justify-center space-x-2">
              <button
                className={`rounded-md px-4 py-2 transition-colors duration-300 ease-in-out ${
                  activeList === "friends"
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary hover:bg-primary/10"
                }`}
                onClick={() => setActiveList("friends")}
              >
                Friends
              </button>
              <button
                className={`rounded-md px-4 py-2 transition-colors duration-300 ease-in-out ${
                  activeList === "outgoing"
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary hover:bg-primary/10"
                }`}
                onClick={() => setActiveList("outgoing")}
              >
                Outgoing
              </button>
              <button
                className={`rounded-md px-4 py-2 transition-colors duration-300 ease-in-out ${
                  activeList === "incoming"
                    ? "bg-primary text-white"
                    : "bg-transparent text-primary hover:bg-primary/10"
                }`}
                onClick={() => setActiveList("incoming")}
              >
                Incoming
              </button>
            </div>
            {activeList === "friends" && <FriendsList />}
            {activeList === "outgoing" && <OutgoingList />}
            {activeList === "incoming" && <IncomingList />}
            <div className="flex justify-center">
              <button
                className="mt-4 rounded-full bg-primary px-16 py-2 text-white shadow-lg hover:bg-primary/90"
                onClick={() => setShowAddContactsModal(true)}
              >
                Add Contacts
              </button>
            </div>
          </div>
        </main>
      </div>
      {showAddContactsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow ">
            <AddContacts />
            <div className="mt-4 flex justify-center">
              <button
                className="align-center mt-4 rounded-md bg-primary px-16 py-2 text-white"
                onClick={() => setShowAddContactsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
