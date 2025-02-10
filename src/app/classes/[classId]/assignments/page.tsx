"use client";

import { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { openModal, setRefetch } from "@/store/appSlice";
import Loading from "@/components/Loading";
import CreateAssignment from "@/components/class/CRUD/CreateAssignment";
import Empty from "@/components/Empty";
import CreateSection from "@/components/class/CRUD/CreateSection";

import Button from "@/components/util/Button";
import Assignment from "@/components/class/Assignment";
import AssignmentGroup from "@/components/class/AssignmentGroup";
import { ApiResponse } from "@/interfaces/api/Response";
import { Assignment as AssignmentType, GetClassResponse } from "@/interfaces/api/Class";

export default function AssignmentListPage({ params }: { params: { classId: string } }) {
    const classId = params.classId;

    const appState = useSelector((state: RootState) => state.app);
    const dispatch = useDispatch();

    const [assignments, setAssignments] = useState<AssignmentType[] | null>(null);
    const [sections, setSections] = useState<any>(null);

    useEffect(() => {
        fetch(`/api/class/${classId}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then((data: ApiResponse<GetClassResponse>) => {
                if (data.success) {
                    setAssignments([...(data.payload as GetClassResponse).classData.assignments])
                    setSections([...(data.payload as GetClassResponse).classData.sections])
                }
            })
        dispatch(setRefetch(false));
    }, [appState.refetch])

    if (!assignments) {
        return <div className="flex justify-center items-center h-full w-full">
            <Loading />
        </div>
    }

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex flex-row justify-between items-center mb-5">
                <div className="font-semibold text-4xl">Assignments</div>
                {
                    appState.user.teacher && (
                        <div className="flex flex-row space-x-2">
                            <Button.Light
                                onClick={() => dispatch(openModal(<CreateSection classId={classId} />))}
                                >Add section</Button.Light>
                            <Button.Primary
                                onClick={() => dispatch(openModal(<CreateAssignment classId={classId} sections={sections} />))}
                                >Add assignment</Button.Primary>
                        </div>
                    )
                }
            </div>
            {
                assignments && !assignments.length && sections && !sections.length && (
                    <Empty />
                )
            }
            {
                sections && sections.map((section: any, index: number) => (
                    <AssignmentGroup
                        section={section}
                        assignments={assignments.filter((assignment: any) => assignment && assignment.section && assignment.section.id == section.id)}
                        key={index}
                        classId={classId}
                        isTeacher={appState.user.teacher}
                    />
                ))
            }
            {
                assignments && assignments.filter(assignment => assignment && !assignment.section).map((assignment: AssignmentType, index: number) => (
                    <Assignment
                        key={index}
                        title={assignment.title}
                        date={assignment.dueDate!}
                        isTeacher={appState.user.teacher}
                        classId={classId}
                        assignmentId={assignment.id}
                        late={assignment.late}
                        submitted={assignment.submitted}
                        returned={assignment.returned}
                    />
                ))
            }
        </div>
    )
}