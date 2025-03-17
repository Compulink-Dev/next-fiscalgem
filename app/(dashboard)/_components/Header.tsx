"use client";
import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "./Drowpdown";

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const notifications = [
    {
      id: 1,
      title: "Notification 1",
      message: "This is the first notification",
    },
    {
      id: 2,
      title: "Notification 2",
      message: "This is the second notification",
    },
    {
      id: 3,
      title: "Notification 3",
      message: "This is the third notification",
    },
  ];

  const handleConfirmSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setIsModalOpen(false);
  };

  const getUserInitials = (name: string) => {
    const names = name.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join("");
  };

  return (
    <div className="w-full bg-green-900 shadow-lg p-4 flex items-center justify-between">
      <div className="border rounded flex items-center gap-2 px-2 py-1 text-sm text-white">
        <Search size={14} />
        <input
          className="border-none outline-none bg-transparent text-white placeholder:text-gray-300"
          placeholder="Search..."
        />
      </div>
      <div className="flex gap-4 text-white items-center">
        <NotificationDropdown />
        {session && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-green-900 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              title="Sign out"
            >
              <span className="text-green-900 text-xs font-bold">
                {getUserInitials(session.user.name)}
              </span>
            </div>
            <Dialog open={isModalOpen}>
              <DialogTrigger asChild>
                <div></div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h3>Sign out</h3>
                </DialogHeader>
                <p>Are you sure you want to sign out?</p>
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-gray-200 text-green-900 px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-700 text-white px-4 py-2 rounded"
                    onClick={handleConfirmSignOut}
                  >
                    Sign out
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
