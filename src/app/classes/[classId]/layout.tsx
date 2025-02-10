"use client";

import { AlertLevel } from "@/lib/alertLevel";
import { addAlert, setTeacher } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassSidebar from "@/components/class/ClassSidebar";
import { GetClassResponse } from "@/interfaces/api/Class";
import { ApiResponse, ErrorPayload } from "@/interfaces/api/Response";
import { User } from "@/interfaces/api/Auth";

export default function ClassWrappper({ children, params }: {
    children: React.ReactNode;
    params: {
        classId: string;
    };
}) {
    const classId = params.classId;

    const dispatch = useDispatch();

    // @todo fix
    
    const [teachers, setTeachers] = useState<User[] | null>(null);
    const [loaded, setLoaded] = useState(false);

    const appState = useSelector((state: RootState) => state.app);

    useEffect(() => {
        if (!teachers)  return;

        const teacher = teachers.find((teacher: any) => teacher.username === appState.user?.username);

        if (teacher) {
            dispatch(setTeacher(true));
            setLoaded(true);

        }
        else {
            dispatch(setTeacher(false));
            setLoaded(true);
        }
    }, [teachers]);


    useEffect(() => {
        fetch(`/api/class/${classId}`)
            .then(res => res.json())
            .then((data: ApiResponse<GetClassResponse>) => {
                if (data.success) {
                    setTeachers([...(data.payload as GetClassResponse).classData.teachers]);
                }
                else {
                    dispatch(addAlert({
                        level: AlertLevel.ERROR,
                        remark: (data.payload as ErrorPayload).remark,
                    }));
                }
            });
    }, [appState.refetch]);


if (!loaded) {
    return <div>Loading...</div>;
}
    return (
        
        <div className="flex flex-row mx-5 space-x-7 h-full">
            <ClassSidebar teacher={appState.user.teacher} classId={classId} />
            <div className="h-full pt-7 overflow-y-scroll flex-grow pe-7">
                <div>
                    {children}
                </div>      
            </div>  
        </div>
    );
}