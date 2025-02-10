"use client";

import { openModal } from "@/store/appSlice";
import { HiClipboard, HiHome, HiPencil, HiUserGroup } from "react-icons/hi";
import { useDispatch } from "react-redux";
import InviteCode from "./CRUD/InviteCode";
import Button from "../util/Button";

export default function ClassSidebar({ teacher, classId }: { teacher: boolean, classId: string }) {
    const dispatch = useDispatch();

    return (<div className="flex flex-col h-full w-[17rem]">
        <span className="mb-3 font-semibold">Classroom</span>
        <Button.Select href={`/classes/${classId}`} className="flex flex-row items-center space-x-3">
            <HiHome className="size-5" />
            <span className="text-gray-800">Home</span>
        </Button.Select>
        <Button.Select href={`/classes/${classId}/assignments`} className="flex flex-row items-center space-x-3">
            <HiClipboard className="size-5" />
            <span className="text-gray-800">Assignments</span>
        </Button.Select>
        <Button.Select href={`/classes/${classId}/members`} className="flex flex-row items-center space-x-3">
            <HiUserGroup className="size-5" />
            <span className="text-gray-800">Members</span>
        </Button.Select>
        {teacher && (<>
            <Button.Select href={`/classes/${classId}/settings`} className="flex flex-row items-center space-x-3">
                <HiPencil className="size-5" />
                <span className="text-gray-800">Settings</span>
            </Button.Select>
        </>)}
        {teacher && (
            <div className="mt-auto">
                <Button.Primary className="w-full flex justify-center items-center font-semibold" onClick={() => {
                    dispatch(openModal(<><InviteCode classId={classId} /></>))
                }}>Invite</Button.Primary>
            </div>
        )}

    </div>)
}