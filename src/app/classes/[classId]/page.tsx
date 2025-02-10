"use client";

import Empty from "@/components/Empty";
import Loading from "@/components/Loading";
import Button from "@/components/util/Button";
import IconFrame from "@/components/util/IconFrame";
import Input from "@/components/util/Input";
import { Class, GetClassesResponse, GetClassResponse } from "@/interfaces/api/Class";
import { ApiResponse, ErrorPayload } from "@/interfaces/api/Response";
import { AssignmentGetBodyProps, ClassGetBodyProps } from "@/interfaces/classes";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { HiPencil, HiSpeakerphone } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

export default function ClassHome({ params }: { params: { classId: string } }) {
    const { classId } = params;
    const [classProps, setClassProps] = useState<Class | null>(null);

    const appState = useSelector((state: RootState) => state.app);

    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`/api/class/${classId}`)
            .then(res => res.json())
            .then((data: ApiResponse<GetClassResponse>) => {
                if (data.success) {
                    setClassProps((data.payload as GetClassResponse).classData);
                    setRefetch(true);
                }
                else {
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: (data.payload as ErrorPayload).remark,
                    }));
                }
            });
    }, [appState.refetch]);

    if (!classProps) {
        return <div className="w-full h-full flex items-center justify-center">
            <Loading />
        </div>;
    }

    return (
        <div>
            <div className="space-y-5 mb-5">
                <div className="text-4xl font-semibold">{classProps.name}</div>
                <div className="text-sm text-gray-500">{classProps.subject}, Section {classProps.section}</div>
            </div>
            <div className="space-y-2">

                {Array.isArray(classProps.assignments) && classProps.assignments.map((assignment, index: number) => (
                     <div key={index} className="flex flex-col bg-white py-5">
                        <div className="flex flex-row justify-between items-center">
                            <a href={`/classes/${classId}/assignments`} className="flex flex-row items-center space-x-3 hover:underline">
                                <IconFrame>
                                    <HiPencil />
                                </IconFrame>
                                <div className="flex flex-col">
                                    <div className="text-sm font-semibold">{assignment.teacher.username} posted an assignment: {assignment.title}</div>
                                    <span className="text-gray-500">{assignment.instructions.slice(0, 12) + '...'}</span>
                                </div>
                            </a>
                            <div className="text-xm text-gray-400">{new Date(assignment.dueDate!).toDateString()}</div>
                        </div>
                 </div>
                ))}
                {
                    classProps.assignments.length === 0 && (
                        <Empty />
                    )
                }
            </div>
        </div>
    );
}
