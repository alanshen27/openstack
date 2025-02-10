"use client";

import { RootState, store } from "@/store/store";
import { Provider, useSelector } from "react-redux";
import { HiCalendar, HiClipboard, HiInbox, HiUserGroup } from "react-icons/hi";
import { redirect } from 'next/navigation'

export default function Home() {
    const appState = useSelector((state: RootState) => state.app);
    if (!appState.user) {
        redirect("/login");
    } else {
        redirect("/classes");
    }
}