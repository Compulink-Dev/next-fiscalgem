"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function NotificationDropdown() {
    const notifications = [
        { id: 1, title: 'Notification 1', message: 'This is the first notification' },
        { id: 2, title: 'Notification 2', message: 'This is the second notification' },
        { id: 3, title: 'Notification 3', message: 'This is the third notification' },
        { id: 4, title: 'Notification 4', message: 'This is the third notification' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="bg-green-900 p-2 rounded-full hover:bg-green-700 relative">
                    <Bell size={16} />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {notifications.length}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                    <DropdownMenuCheckboxItem key={notification.id}>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm font-bold">{notification.title}</div>
                            <div className="text-xs text-gray-500">{notification.message}</div>
                        </div>
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}