"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface SessionProviderWrapperProps {
    children: ReactNode;
    session: Session | null;
}

export default function SessionProviderWrapper({
    children,
    session,
}: SessionProviderWrapperProps) {
    return <SessionProvider session={session}> {children} </SessionProvider>;
}
