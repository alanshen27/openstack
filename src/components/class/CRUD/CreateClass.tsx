"use client";

import { useState } from "react";
import { addAlert, closeModal } from "@/store/appSlice";
import { useDispatch } from "react-redux";
import { AlertLevel } from "@/lib/alertLevel";
import { HiX } from "react-icons/hi";
import Button from "../../util/Button";
import Input from "../../util/Input";
import { CreateClassRequest } from "@/interfaces/api/Class";
import { DefaultApiResponse } from "@/interfaces/api/Response";

export default function CreateClass() {
    const dispatch = useDispatch();

    const [classData, setClassData] = useState({
        name: '',
        subject: '',
        section: 1,
    });

    return (<div className="w-[30rem]">
        <div className="flex flex-row w-full justify-between items-center">
            <span className="text-xl font-semibold">Create class</span>
            <HiX
                onClick={() => dispatch(closeModal())}
                className="size-5 text-gray-500 hover:text-gray-800" />
        </div>
        <form onSubmit={(e) => {
            e.preventDefault();
        
            setClassData({ name: '', subject: '', section: 1 });

            fetch('/api/class', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(classData as CreateClassRequest),
            })
                .then(res => res.json())
                .then((data: DefaultApiResponse) => {
                    if (data.success) {
                        dispatch(addAlert({
                            level: AlertLevel.SUCCESS,
                            remark: data.payload.remark,
                        }));
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
        }}>
            <div className="w-full flex flex-col space-y-3 mt-4">
                <Input.Text
                    label="Name" 
                    type="text"
                    value={classData.name} 
                    onChange={(e) => setClassData({ ...classData, name: e.target.value })} />
                <Input.Text
                    label="Subject"
                    type="text"
                    value={classData.subject}
                    onChange={(e) => setClassData({ ...classData, subject: e.target.value })} />
                <Input.Text
                    label="Section"
                    type="number"
                    min="1"
                    value={classData.section}
                    onChange={(e) => setClassData({ ...classData, section: Number(e.target.value) })} />
            </div>
            <Button.Primary className="mt-5">Create</Button.Primary>
        </form>
    </div>)
}