"use client";

import { openModal } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import CreateClass from "./class/CRUD/CreateClass";
import JoinClass from "./class/CRUD/JoinClass";
import Button from "./util/Button";

export default function Navbar() {
    const appState = useSelector((state: RootState) => state.app);
    const dispatch = useDispatch();

    if (!appState.user.loggedIn) {
        return (
            <nav className="bg-white p-4 w-full flex flex-row items-center px-7 border-b">
                <div className="flex-1">
                    <a href="/" className="flex flex-row items-center space-x-1">
                    <img src="/internal/favicon.svg" alt="logo" className="w-9" />
                    <h1 className="text-lg font-semibold">Open<span className="font-bold text-primary-500">Stack</span></h1>
                    </a>
                </div>
                <div className="flex-1">
                    <div className="flex flex-row justify-end space-x-7">
                        <a href='/login'>Login</a>
                    </div>
                </div>
            </nav>
        );
    }
    return (
        <nav className="bg-white p-4 w-full flex flex-row items-center px-7 border-b">
            <div className="flex-1">
                <a href="/" className="flex flex-row items-center space-x-1">
                <img src="/internal/favicon.svg" alt="logo" className="w-9" />
                <h1 className="text-lg font-semibold">Open<span className="font-bold text-primary-500">Stack</span></h1>
                </a>
            </div>
                <div className="flex flex-row items-center justify-end space-x-2">
                    <div className="flex flex-row space-x-6 mx-4">
                        <a href='/classes'>Classes</a>
                    </div>
                    <Button.Light onClick={() => dispatch(openModal(<JoinClass />))}>
                        Join
                    </Button.Light>
                    <Button.Primary onClick={() => dispatch(openModal(<CreateClass />))}>
                        Create
                    </Button.Primary>
                </div>
        </nav>
    );
}