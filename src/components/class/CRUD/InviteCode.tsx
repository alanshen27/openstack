"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, closeModal } from "@/store/appSlice";
import { useEffect, useState } from "react";
import { HiClipboard, HiX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Button from "../../util/Button";
import { ClassInviteResponse } from "@/interfaces/api/Class";
import { ApiResponse, DefaultApiResponse, ErrorPayload } from "@/interfaces/api/Response";

export default function InviteCode({ classId }: { classId: string }) {
    const dispatch = useDispatch();

    const [inviteCode, setInviteCode] = useState<string>('');

    useEffect(() => {
        fetch(`/api/class/${classId}/invite`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then((data: ApiResponse<ClassInviteResponse>) => {
                if (data.success) {
                    setInviteCode((data.payload as ClassInviteResponse).session.id);
                }
                else {
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: (data.payload as ErrorPayload).remark,
                    }));
                }
            })
            .catch(_ => {
                dispatch(addAlert({
                    level: AlertLevel.ERROR,
                    remark: 'Please try again later.',
                }));
            });
    }, []);

    return <>
        <div className="flex flex-col w-[30rem]">
            <div className="flex flex-row justify-end">
                <HiX className="size-5 text-gray-500 hover:text-gray-800" onClick={() => dispatch(closeModal())} />
            </div>
            <div className="flex flex-col space-y-5">
                <span className="text-black text-sm">Class code</span>
                <span 
                onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                    dispatch(addAlert({
                        level: AlertLevel.INFO,
                        remark: 'Copied to clipboard',
                    }));
                }}
                className="text-black cursor-pointer hover:text-gray-400 text-4xl font-semibold flex flex-row items-center space-x-2">
                    <span>{inviteCode.toString()}</span>
                    <HiClipboard className="size-5" />
                </span>
                <div>
                    <Button.Primary 
                    onClick={() => {
                        fetch(`/api/class/${classId}/invite`, {
                            method: 'POST',
                        })
                            .then(res => res.json())
                            .then((data: ApiResponse<ClassInviteResponse>) => {
                                if (data.success) {
                                    setInviteCode((data.payload as ClassInviteResponse).session.id);
                                }
                                else {
                                    dispatch(addAlert({
                                        level: AlertLevel.ERROR,
                                        remark: (data.payload as ErrorPayload).remark,
                                    }));
                                }
                            })
                            .catch(_ => {
                                dispatch(addAlert({
                                    level: AlertLevel.ERROR,
                                    remark: 'Please try again later.',
                                }));
                            });
                    }}
                    >
                        Regenerate
                    </Button.Primary>
                </div>
            </div>
        </div>
    </>
}