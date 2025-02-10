
"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import Alert from "./Alert";
import { HiX } from "react-icons/hi";

export default function AppWrapper({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    const appState = useSelector((state: RootState) => state.app);
    return(<div className="text-sm h-full">
        {children}
        <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-end items-center pointer-events-none">
            {appState.alerts.map((alert, index) => (
                <Alert key={index} index={index} remark={alert.remark} level={alert.level} />
            ))}
        </div>
        {appState.modal && (
            <div className="absolute z-50 top-0 left-0 h-full w-full flex justify-center items-center bg-gray-800 bg-opacity-40 pointer-events-auto">
                <div className="bg-white px-9 py-7 border rounded-md">
                    {appState.modal}
                </div>
            </div>
        )}
    </div>)
}