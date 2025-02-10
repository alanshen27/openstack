"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, closeModal, setRefetch } from "@/store/appSlice";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Input from "../../util/Input";
import Button from "../../util/Button";
import { ApiResponse, DefaultApiResponse } from "@/interfaces/api/Response";
import { JoinClassRequest } from "@/interfaces/api/Class";

export default function JoinClass() {
    const [classCode, setClassCode] = useState<string>('');
    const dispatch = useDispatch();

    return (<div className="flex flex-col space-y-3">
        <div className="flex flex-row justify-between items-center">
            <div className="font-semibold text-sm">Join class</div>
            <HiX onClick={() => dispatch(closeModal())} className="size-3 text-gray-500 hover:text-gray-800" />
        </div>
        <div className="flex flex-row space-x-2 text-sm">
            <Input.Text
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder="Class code here..." />
            <Button.Primary onClick={() => {
                fetch('/api/class/join', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ code: classCode } as JoinClassRequest),
                })
                    .then(res => res.json())
                    .then((data: DefaultApiResponse) => {
                        if (data.success) {
                            dispatch(addAlert({
                                level: AlertLevel.SUCCESS,
                                remark: data.payload.remark,
                            }));
                            dispatch(setRefetch(true));
                        } else {
                            dispatch(addAlert({
                                level: AlertLevel.ERROR,
                                remark: data.payload.remark,
                            }));
                        }
                    })
                    .catch(_ => {
                        dispatch(addAlert({
                            level: AlertLevel.ERROR,
                            remark: 'Please try again later'
                        }));
                    });
            }}>Join</Button.Primary>
        </div>
    </div>);
}