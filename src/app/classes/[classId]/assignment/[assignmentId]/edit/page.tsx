"use client";

import FileEdit from "@/components/class/FileEdit";
import Empty from "@/components/Empty";
import Button from "@/components/util/Button";
import Input from "@/components/util/Input";
import { Assignment, GetAssignmentResponse, UpdateAssignmentRequest } from "@/interfaces/api/Class";
import { ApiResponse, DefaultApiResponse, ErrorPayload } from "@/interfaces/api/Response";
import { AssignmentEditBodyProps } from "@/interfaces/classes";
import { AlertLevel } from "@/lib/alertLevel";
import { fileToBase64 } from "@/lib/fileToBase64";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";


export default function _Assignment({ params }: { params: { classId: string, assignmentId: string } }) {
    const [assignmentData, setAssignmentData] = useState<Assignment & UpdateAssignmentRequest & { refetch: boolean; sections: { id: string, name: string }[] } | null>(null);
    const appState = useSelector((state: RootState) => state.app);

    const [classId, setClassId] = useState<string | null> (null);
    const dispatch = useDispatch();
    const fileInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (assignmentData && !assignmentData.refetch) return;

        fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}`, {
            method: "GET",
        })
            .then(res => res.json())
            .then((data: ApiResponse<GetAssignmentResponse>) => {
                if (data.success) {
                    // @ts-ignore
                    setAssignmentData({
                        ...(data.payload as GetAssignmentResponse).assignmentData,
                        newAttachments: [],
                        removedAttachments: [],
                        refetch: false,
                    })
                    setClassId((data.payload as GetAssignmentResponse).classId);
                    dispatch(setRefetch(false));
                } else {
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: (data.payload as ErrorPayload).remark,
                    }));
                }
            })
            .catch(_ => {
                dispatch(addAlert({
                    level: AlertLevel.ERROR,
                    remark: "Please try again later",
                }));
            });
    }, [appState.refetch]);

    useEffect(() => {
        if (!assignmentData) return;

        fetch(`/api/class/${classId}/assignment`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...assignmentData,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: data.remark,
                    }))
                }
                dispatch(setRefetch(assignmentData.refetch));
            })
            .catch(_ => {
                dispatch(addAlert({
                    level: AlertLevel.ERROR,
                    remark: 'Please try again later',
                }));
            });
    }, [assignmentData])

    return (
        <div className="mx-auto">
            {assignmentData && (<div className="flex flex-col max-w-[60rem] space-y-5">
                <Input.Text
                    label="Title"
                    type="text"
                    value={assignmentData.title}
                    onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })} />
                <div className="flex flex-row justify-between space-x-5">
                    <Input.Textarea
                    className="w-full"
                        label="Instructions"
                        value={assignmentData.instructions}
                        onChange={(e) => setAssignmentData({ ...assignmentData, instructions: e.target.value })} />
                    <div className="flex flex-col space-y-3 w-[15rem] shrink-0">
                        <Input.Text
                            type="date"
                            label="Due Date"
                            value={assignmentData.dueDate!.toString().slice(0, 10)}
                            onChange={(e) => setAssignmentData({
                                ...assignmentData,
                                refetch: false,
                                dueDate: new Date(e.target.value),
                            })} />
    
                        <span className="text-sm font-semibold">Section</span>
                        <select
                        className="bg-gray-100 p-3 rounded-md outline-none"
                        onChange={(e) => {
                            setAssignmentData({
                                ...assignmentData,
                                refetch: true,
                                section: {
                                    id: e.target.value,
                                }
                            });
                        }}
                        value={assignmentData?.section?.id ? assignmentData.section.id : 'none'}
                        >
                            {assignmentData.sections.map((section, index) => (
                                <option key={index} value={section.id}>{section.name}</option>
                            ))}
                            <option value='none'>None</option>
                        </select>
                    </div>
                </div>

                <span className="text-sm font-semibold">Attachments</span>
                {assignmentData.attachments.length == 0 && (
                    <Empty message="No attachments" /> 
                )}
                {/* @description: display and attach attachments to assignment */}
                {assignmentData.attachments.map((attachment, index) => (
                        <FileEdit
                            key={index}
                            src={attachment.path.replace('/public', '')}
                            name={attachment.name}
                            type={attachment.type}
                            onDelete={() => {
                                setAssignmentData({
                                    ...assignmentData,
                                    refetch: false,
                                    attachments: [...assignmentData.attachments.filter(_attachment => _attachment.id != attachment.id)],
                                    removedAttachments: [{ id: attachment.id }],
                                })
                            }} />
                    ))}
                <div className="flex flex-row justify-end">
                    <Button.Primary className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md"
                        onClick={() => fileInput?.current?.click()}>Attach</Button.Primary>
                </div>
                <input type="file" className="hidden" ref={fileInput} onChange={(e) => {
                    if (!e.target.files || !e.target.files[0]) return;

                    fileToBase64(e.target.files[0]).then(base64 => {
                        if (!e.target.files || !e.target.files[0]) return;
                        if (!base64) return;

                        setAssignmentData({
                            ...assignmentData,
                            refetch: true,
                            newAttachments: [
                                {
                                    id: v4(),
                                    name: e.target.files[0].name,
                                    type: e.target.files[0].type,
                                    base64: base64.toString(),
                                },
                            ]
                        });
                        
                        e.target.files = null;
                        e.target.value = '';
                    });
                }} />

            </div>)}
        </div>
    )
}