"use client"; // redundant

import { AssignmentCreateBodyProps } from "@/interfaces/classes";
import { AlertLevel } from "@/lib/alertLevel";
import { fileToBase64 } from "@/lib/fileToBase64";
import { addAlert, closeModal, setRefetch } from "@/store/appSlice";
import { useRef, useState } from "react";
import { HiTrash, HiX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { v4 } from "uuid";
import Button from "../../util/Button";
import Input from "../../util/Input";
import FileEdit from "../FileEdit";
import { CreateAssignmentRequest } from "@/interfaces/api/Class";

export default function CreateAssignment({ classId, sections }: { classId: string, sections: any }) {
    const dispatch = useDispatch();

    const fileInput = useRef<HTMLInputElement>(null);

    const [assignmentData, setAssignmentData] = useState<CreateAssignmentRequest>({
        files: [],
        dueDate: new Date(),
        instructions: '',
        title: ''
    });

    return (<div
        className="w-[50rem] flex flex-col space-y-5">
        <div className="flex flex-row items-center justify-between space-x-3">
            <span className="text-xl font-semibold">Create assignment</span>
            <HiX
                onClick={() => dispatch(closeModal())}
                className="size-5 text-gray-500 hover:text-gray-800" />
        </div>
        <Input.Text 
            label="Title"
            type="text"
            value={assignmentData.title}
            onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
            required />
        <div className="flex flex-row space-x-5">
            <div className="flex flex-col space-y-4 w-2/3">
                <Input.Textarea
                    label="Instructions"
                    value={assignmentData.instructions}
                    onChange={(e) => setAssignmentData({ ...assignmentData, instructions: e.target.value })}
                    required />
            </div>
            <div className="flex flex-col space-y-4 bg-white w-1/3 shrink-0">
                <div className="flex flex-col space-y-3">
                    <Input.Text
                        label="Due Date"
                        onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: new Date(e.target.value) })}
                        value={assignmentData.dueDate.toISOString().split('T')[0]}
                        type="date" />
                </div>
                <div className="flex flex-col space-y-3">
                    <label className="text-xs text-gray-800 font-bold">Section</label>
                    <select
                        className="rounded-md bg-gray-100 px-2 py-3 text-sm"
                        onChange={(e) => setAssignmentData({ ...assignmentData, sectionId: e.target.value == 'none' ? undefined : e.target.value })}
                        value={assignmentData.sectionId || 'none'}
                        >
                        {
                            sections.map((section: any, index: number) => (
                                <option key={index} value={section.id}>{section.name}</option>
                            ))
                        }
                        <option value="none">No section</option>

                    </select>
                </div>
            </div>
        </div>
        <div className="flex flex-col space-y-3">
            <label className="text-sm text-gray-800 font-bold">files</label>
            {assignmentData.files.map((attachment: any, index) => (
                <FileEdit 
                    key={index}
                    name={attachment.name}
                    type={attachment.type}
                    src={attachment.base64}
                    onDelete={() => setAssignmentData({ ...assignmentData, files: assignmentData.files.filter((f: any) => f.id !== attachment.id) })}
                />
            ))}
            {!assignmentData.files.length && (
                <div className="p-3 text-sm">No files attached</div>
            )}
            <input
                onChange={(e) => {
                    console.log('file')
                    if (!e.target.files || !e.target.files[0]) return;
                    fileToBase64(e.target.files[0])
                        .then(base64 => {
                            if (!e.target.files || !e.target.files[0]) return;

                            setAssignmentData({
                                ...assignmentData,
                                files: [...assignmentData.files, {
                                    id: v4(),
                                    name: e.target.files[0].name,
                                    type: e.target.files[0].type,
                                    base64: base64,
                                }],
                            });

                            e.target.files = null;
                            e.target.value = '';
                        })
                        .catch(_ => {
                            dispatch(addAlert({
                                level: AlertLevel.ERROR,
                                remark: 'Failed to attach file',
                            }));
                        });
                }}
                type="file" ref={fileInput} className="hidden" />
                
                <div className="flex flex-row items-center justify-end space-x-3 text-sm">
                    <Button.Light
                    onClick={() => fileInput.current?.click()}
                    >Add File</Button.Light>
                   
                    <Button.Primary type="submit"
                    className="bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md"
                    onClick={() => {
                        dispatch(addAlert({
                            level: AlertLevel.SUCCESS,
                            remark: 'Creating assignment',
                        }))
            
                        fetch(`/api/class/${classId}/assignment`, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                ...assignmentData,
                                files: assignmentData.files,
                            } as CreateAssignmentRequest),
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    dispatch(addAlert({
                                        level: AlertLevel.SUCCESS,
                                        remark: data.payload.remark,
                                    }));
                                    dispatch(setRefetch(true));
                                    dispatch(closeModal());
                                    setAssignmentData({
                                        files: [],
                                        dueDate: new Date(),
                                        instructions: '',
                                        title: '',
                                    })
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
                    }}
                    >Create</Button.Primary>
                </div>
        </div>
    </div>);
}