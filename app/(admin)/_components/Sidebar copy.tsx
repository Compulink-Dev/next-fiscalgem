"use client";
import Title from "@/app/_components/Title";
import {
  DoorOpen,
  FolderSearch,
  FolderTree,
  LogOut,
  Server,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import InvoiceDropdown from "./InvoiceDropDown";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

function Sidebar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, status } = useSession();

  // Helper function to determine if a route is active
  const isActive = (path: string) => pathname === path;

  const handleConfirmSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 border-r border-green-700 h-screen w-42 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <Link
          href={"/dashboard"}
          className="flex items-center w-full pl-4 mb-6"
        >
          <Title />
        </Link>
        <div className="flex flex-col gap-4 text-green-900">
          <Button
            asChild
            variant={isActive("/dashboard") ? undefined : "outline"}
            className={isActive("/dashboard") ? "bg-green-700 text-white" : ""}
          >
            <Link
              href={"/dashboard"}
              className="flex items-center justify-between"
            >
              <DoorOpen />
              <p>Open Day</p>
            </Link>
          </Button>
          <InvoiceDropdown />
          <Button
            asChild
            variant={isActive("/dashboard/storage") ? undefined : "outline"}
            className={
              isActive("/dashboard/storage") ? "bg-green-700 text-white" : ""
            }
          >
            <Link
              href={"/dashboard/storage"}
              className="flex items-center justify-between"
            >
              <FolderTree />
              <p className="text-sm">Storage</p>
            </Link>
          </Button>
          <Button
            asChild
            variant={isActive("/dashboard/saved") ? undefined : "outline"}
            className={
              isActive("/dashboard/saved") ? "bg-green-700 text-white" : ""
            }
          >
            <Link
              href={"/dashboard/saved"}
              className="flex items-center justify-between"
            >
              <FolderSearch />
              <p>Saved</p>
            </Link>
          </Button>
          <Button
            asChild
            variant={isActive("/dashboard/device") ? undefined : "outline"}
            className={
              isActive("/dashboard/device") ? "bg-green-700 text-white" : ""
            }
          >
            <Link
              href={"/dashboard/device"}
              className="flex items-center justify-between"
            >
              <Server />
              <p>Device</p>
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      {session && (
        <div className="flex items-center gap-2">
          <div
            className="flex gap-2 items-center justify-center rounded-full bg-white text-green-900 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
            title="Sign out"
          >
            <LogOut size={17} />
            <p className="text-sm">Sign out</p>
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
                <Button
                  className="bg-gray-200 text-green-900d"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-700 text-white"
                  onClick={handleConfirmSignOut}
                >
                  Sign out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
