"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, closeModal, setRefetch } from "@/store/appSlice";
import { useState } from "react";
import { HiX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Button from "../../util/Button";
import Input from "../../util/Input";
import { CreateSectionRequest } from "@/interfaces/api/Class";
import { DefaultApiResponse } from "@/interfaces/api/Response";

export default function CreateSection({ classId }: Readonly<{
    classId: string,
}>) {
    const [name, setName] = useState<string>('');
    const dispatch = useDispatch();

    return (<div className="flex flex-col space-y-3">
        <div className="flex flex-row justify-between items-center">
            <div className="font-semibold text-sm">Create section</div>
            <HiX onClick={() => dispatch(closeModal())} className="size-5 text-gray-500 hover:text-gray-800" />
        </div>
        <div className="flex flex-row space-x-2">
            <Input.Text
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Section name here..." />
            <Button.Primary onClick={() => {
                fetch(`/api/class/${classId}/section`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ name: name } as CreateSectionRequest),
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
            }}>Create</Button.Primary>
        </div>
    </div>);
}