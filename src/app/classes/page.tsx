"use client";

import Loading from "@/components/Loading";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { HiClipboardCheck, HiDocumentReport, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

import { AlertLevel } from "@/lib/alertLevel";
import { HiPhoto } from "react-icons/hi2";
import { GetClassesResponse } from "@/interfaces/api/Class";
import { ApiResponse, DefaultApiResponse, ErrorPayload } from "@/interfaces/api/Response";

export default function Classes() {
    const dispatch = useDispatch();
    const appState = useSelector((state: RootState) => state.app);

    const [classes, setClasses] = useState<GetClassesResponse | null>(null);

    useEffect(() => {
        fetch('/api/class')
            .then(res => res.json())
            .then((data: ApiResponse<GetClassesResponse>) => {
                if (data.success) {
                    setClasses((data.payload as GetClassesResponse));
                    if (appState.refetch) {
                        dispatch(setRefetch(false));
                    }
                } else {
                    return dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: (data.payload as ErrorPayload).remark,
                    }));
                }
            })
            .catch(_ => {
                dispatch(addAlert({
                    level: AlertLevel.ERROR,
                    remark: 'Please try again later'
                }));
            });
    }, [appState.refetch]);

    if (!classes) {
        return <div className="w-full h-full flex items-center justify-center">
            <Loading />
        </div>
    }
    return (
        <div className="flex flex-col space-y-4 w-full h-full px-40">
            <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-4xl font-semibold">Classes</h1>
            </div>

            <div className="flex flex-wrap">
                {classes && classes.teacherInClass.map((cls, index) => (
                <div key={index} className="pe-2 py-3">
                    <div className="rounded-md w-[15rem] flex flex-col space-x-2 p-2">
                        <a href={`/classes/${cls.id}`} className="flex flex-col hover:underline text-black px-4 py-5 bg-gray-100 rounded-md w-full overflow-hidden relative">
                            {/* <div className="absolute left-0 top-0 h-full w-full">
                                <img src="https://picsum.photos/300/200" className="w-full h-full object-cover bg-blend-color-burn" />
                            </div> */}
                            <div className="text-lg font-semibold text-black z-10">{cls.name}</div>
                            <div className="text-sm text-gray-800 text-nowrap z-10">Section {cls.section}, {cls.subject}</div>
                        </a>
                        <div className="flex flex-col space-y-2 px-2 py-3">
                            <span className="text-sm text-gray-500 font-semibold">Due today</span>
                            <div className="flex flex-col space-y-1 h-[5rem] overflow-y-auto">
                                {
                                    cls.dueToday.map((assignment, index) => (   
                                        <a key={index} href={`/classes/${cls.id}/assignment/${assignment.id}`} className="text-gray-500 hover:underline">{assignment.title}</a>
                                    ))
                                }
                                {
                                    cls.dueToday.length === 0 && (
                                        <span className="text-gray-500">No assignments due today</span>
                                    )
                                }

                            </div>
                        </div>
                        <div className="flex flex-row space-x-2 px-2 py-3 border-gray-200 border-t">
                            <a href={`/classes/${cls.id}/assignments`}>
                                <HiClipboardCheck className="size-5 text-gray-500 hover:text-black" />
                            </a>
                            <a href={`/classes/${cls.id}/grades`}>
                                <HiDocumentReport className="size-5 text-gray-500 hover:text-black" />
                            </a>
                            <a onClick={() => {
                                fetch(`/api/class/${cls.id}/`, {
                                    method: 'DELETE'
                                })
                                .then(res => res.json())
                                .then((res: ApiResponse<DefaultApiResponse>) => {
                                    if (!res.success)    dispatch(addAlert({
                                        level: AlertLevel.WARNING,
                                        remark: (res.payload as ErrorPayload).remark,
                                    }));
                                    else {
                                        dispatch(addAlert({
                                            level: AlertLevel.SUCCESS,
                                            remark: "Class deleted sucessfully",
                                        }));
                                        dispatch(setRefetch(true));
                                    }
                                })
                                .catch(_ => {
                                    dispatch(addAlert({
                                        level: AlertLevel.ERROR,
                                        remark: 'Please try again later.'
                                    }));
                                })
                            }}>
                                <HiTrash className="size-5 text-gray-500 hover:text-black" />                                
                            </a>
                        </div>
                    </div>
                </div>
                ))}
                
                {classes && classes.studentInClass.map((cls, index) => (
                <div key={index} className="pe-2 py-3">
                    <div className="rounded-md w-[15rem] flex flex-col space-x-2 p-2">
                        <a href={`/classes/${cls.id}`} className="flex flex-col hover:underline text-black px-4 py-5 bg-gray-100 rounded-md w-full overflow-hidden relative">
                            <div className="absolute left-0 top-0 h-full w-full">
                                <img src="https://picsum.photos/300/200" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-lg font-semibold text-black z-10">{cls.name}</div>
                            <div className="text-sm text-gray-800 text-nowrap z-10">Section {cls.section}, {cls.subject}</div>
                        </a>
                        <div className="flex flex-col space-y-2 px-2 py-3">
                            <span className="text-sm text-gray-500 font-semibold">Due today</span>
                            <div className="flex flex-col space-y-1 flex-shrink-0 h-[5rem] overflow-y-auto">
                                {
                                    cls.dueToday.map((assignment, index) => (   
                                        <a key={index} href={`/classes/${cls.id}/assignment/${assignment.id}`} className="text-gray-500 hover:underline">{assignment.title}</a>
                                    ))
                                }
                                {
                                    cls.dueToday.length === 0 && (
                                        <span className="text-gray-500">No assignments due today</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex flex-row space-x-2 px-2 py-3 border-gray-200 border-t">
                            <a href={`/classes/${cls.id}/assignments`}>
                                <HiClipboardCheck className="size-5 text-gray-500 hover:text-black" />
                            </a>
                            <a href={`/classes/${cls.id}/grades`}>
                                <HiDocumentReport className="size-5 text-gray-500 hover:text-black" />
                            </a>
                        </div>
                    </div>
                </div>
                ))}

                {classes.studentInClass.length === 0 && classes.teacherInClass.length === 0 && (
                    <div className="flex flex-col space-y-3 pt-12 pb-12 items-center justify-center w-full h-full">
                        <HiPhoto className="size-12 text-gray-500" />
                        <span className="text-gray-500">You are not attending any classes</span>
                    </div>
                )}
            </div>
        </div>
    );
}
