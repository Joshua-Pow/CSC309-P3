"use client";

import { useRouter } from "next/navigation";
import React from "react";

const About = () => {
  const router = useRouter();
  return (
    <div className="flex w-full justify-center py-6 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Scheduling Made Easy
            </h1>
            <p className="text-lg tracking-tight text-muted-foreground sm:text-xl">
              Share your availability with anyone. Set your preferences. Add
              contacts. Sync external calendars.
            </p>
            <div className="scene w-56">
              <button
                className="el"
                onClick={() => {
                  router.push("/calendars");
                }}
              >
                <span data-glow></span>
                <span className="el-content" contentEditable="true">
                  Get Started
                </span>
              </button>
              <span data-glow></span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
              <div className="flex flex-col items-center gap-1 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-8 w-8"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Share your availability easily with others.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
              <div className="flex flex-col items-center gap-1 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-8 w-8"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your time effectively with our tools.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
              <div className="flex flex-col items-center gap-1 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" x2="19" y1="8" y2="14"></line>
                  <line x1="22" x2="16" y1="11" y2="11"></line>
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Easily add new contacts to your scheduling list.
                </p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground">
              <div className="flex flex-col items-center gap-1 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-8 w-8"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sync your external calendars seamlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
