"use client";

import Loading from "@/components/Loading";
import Button from "@/components/util/Button";
import Input from "@/components/util/Input";
import { UserProps } from "@/interfaces";
import { GetClassResponse, MemberRequest } from "@/interfaces/api/Class";
import { ApiResponse, DefaultApiResponse, ErrorPayload } from "@/interfaces/api/Response";
import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react"
import { HiInbox, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

export default function Members({ params }: { params: { classId: string } }) {
    const { classId } = params;

    const [members, setMembers] = useState<{
        teachers: UserProps[],
        students: UserProps[],
    }>();

    const [query, setQuery] = useState<string>("");

    const appState = useSelector((state: RootState) => state.app);

    const dispatch = useDispatch();

    useEffect(() => {
        fetch(`/api/class/${classId}`)
            .then(res => res.json())
            .then((data: ApiResponse<GetClassResponse>) => {
                if (data.success) {
                    setMembers({
                        teachers: (data.payload as GetClassResponse).classData.teachers,
                        students: (data.payload as GetClassResponse).classData.students,
                    });
                }
                else {
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: (data.payload as ErrorPayload).remark,
                    }));
                }
            });
    }, [appState.refetch]);

    if (!members) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Loading />
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col space-y-3">
                <div className="w-full flex flex-col space-y-3">
                    <div className="font-semibold text-4xl">Members</div>
                    <span className="text-gray-500">{members?.teachers.length + members?.students.length} members</span>
                    <Input.Text placeholder="Search for members" onChange={(e) => setQuery(e.currentTarget.value)} value={query} />
                </div>
                {members && members.teachers.filter((teacher) => query ? teacher.username == query : true).map((teacher: any, index: number) => (
                    <div key={index} className="flex flex-row justify-between items-center py-3 rounded-md bg-white">
                        <div className="flex flex-row items-center space-x-3">
                            <div className="size-7 bg-gray-500 rounded-full" />
                            <div className="font-semibold">{teacher.username}</div>
                        </div>
                 
                        {appState.user.teacher && appState.user.username !== teacher.username ? (
                            <div className="flex flex-row items-center space-x-4">
                                <select className="p-3 bg-transparent outline-none" onChange={(e) => {
                                    const type = e.target.value === 'teacher' ? 'teacher' : 'student';

                                    fetch(`/api/class/${classId}/member`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id: teacher.id,
                                            type,
                                        } as MemberRequest),
                                    })
                                    .then(res => res.json())    
                                    .then(data => {
                                        if (data.success) {
                                            dispatch(addAlert({
                                                level: AlertLevel.SUCCESS,
                                                remark: data.payload.remark
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
                                }}>
                                    <option value="teacher" selected>Teacher</option>
                                    <option value="student">Student</option>
                                </select>
                                <Button.SM><HiInbox /></Button.SM>
                                <Button.SM onClick={() => {
                                    fetch(`/api/class/${classId}/member`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id: teacher.id,
                                            type: 'teacher',
                                        }),
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            dispatch(addAlert({
                                                level: AlertLevel.SUCCESS,
                                                remark: 'User deleted successfully',
                                            }));
                                            dispatch(setRefetch(true));
                                        } else {
                                            dispatch(addAlert({
                                                level: AlertLevel.ERROR,
                                                remark: data.remark,
                                            }));
                                        }
                                    })
                                    .catch(_ => {
                                        dispatch(addAlert({
                                            level: AlertLevel.ERROR,
                                            remark: 'Please try again later'
                                        }));
                                    });
                                }} className="hover:text-red-500"><HiTrash /></Button.SM>
                            </div>)
                            : <>
                            {appState.user.username === teacher.username ? <div className="text-gray-500">You</div> : <div className="flex flex-row space-x-4">
                                <div className="text-gray-500">Teacher</div>
                                <Button.SM><HiInbox /></Button.SM>
                            </div>}
                            </>}
                    </div>
                ))}
                {members && members.students.filter(student => query ? student.username == query : true).map((student: any, index: number) => (
                    <div key={index} className="flex flex-row justify-between items-center py-3 rounded-md bg-white">
                        <div className="flex flex-row items-center space-x-3">
                            <div className="size-7 bg-gray-500 rounded-full" />
                            <div className="font-semibold">{student.username}</div>
                        </div>
                        {appState.user.teacher ? (
                            <div className="flex flex-row items-center space-x-4">
                                <select className="p-3 bg-transparent outline-none" onChange={(e) => {
                                    const type = e.target.value === 'teacher' ? 'teacher' : 'student';

                                    fetch(`/api/class/${classId}/member`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id: student.id,
                                            type,
                                        } as MemberRequest),
                                    })
                                    .then(res => res.json())    
                                    .then(data => {
                                        if (data.success) {
                                            dispatch(addAlert({
                                                level: AlertLevel.SUCCESS,
                                                remark: data.payload.remark
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
                                }}>
                                    <option value="teacher">Teacher</option>
                                    <option value="student" selected>Student</option>
                                </select>
                                <Button.SM><HiInbox /></Button.SM>
                                <Button.SM onClick={() => {
                                     fetch(`/api/class/${classId}/member`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id: student.id,
                                            type: 'student',
                                        } as MemberRequest),
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            dispatch(addAlert({
                                                level: AlertLevel.SUCCESS,
                                                remark: 'User deleted successfully',
                                            }));
                                            dispatch(setRefetch(true));
                                        } else {
                                            dispatch(addAlert({
                                                level: AlertLevel.ERROR,
                                                remark: data.remark,
                                            }));
                                        }
                                    })
                                    .catch(_ => {
                                        dispatch(addAlert({
                                            level: AlertLevel.ERROR,
                                            remark: 'Please try again later'
                                        }));
                                    });
                                }} className="hover:text-red-500"><HiTrash /></Button.SM>
                            </div>)
                            : <div className="flex flex-row space-x-4">
                            <div className="text-gray-500">Student</div>
                            <Button.SM><HiInbox /></Button.SM>
                        </div>}
                    </div>
                ))}
            </div>
        </div>)
}