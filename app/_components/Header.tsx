"use client";
import React, { useState, useEffect } from "react";
import Title from "./Title";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function Header() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full px-8 py-4 transition-all duration-300 backdrop-blur-md z-50",
        scrolling ? "bg-white/90 shadow-md" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex items-center justify-between">
        <Link href={"/"}>
          <Title />
        </Link>
        <nav>
          <ul className="text-sm flex items-center space-x-4">
            <li>
              <Link href={"/solutions"}>Our Solutions</Link>
            </li>
            <li>
              <Link href={"/pricing"}>Pricing</Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center focus:outline-none">
                    Resources <ChevronDown size={14} className="ml-1" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem>
                    <Link
                      href="/components/resources/tickets"
                      className="w-full"
                    >
                      Tickets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/components/resources/inquiries"
                      className="w-full"
                    >
                      Enquiries
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link href={"/contact"}>Contact Us</Link>
            </li>
            <Button className="bg-green-600 hover:bg-green-900">
              <Link href={"/dashboard"}>Get Started</Link>
            </Button>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
