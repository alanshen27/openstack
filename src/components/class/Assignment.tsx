import { HiBookmark, HiPencil, HiTrash } from "react-icons/hi";
import IconFrame from "../util/IconFrame";
import Button from "../util/Button";
import { addAlert, setRefetch } from "@/store/appSlice";
import { AlertLevel } from "@/lib/alertLevel";
import { useDispatch } from "react-redux";
import { DeleteAssignmentRequest } from "@/interfaces/api/Class";
import { DefaultApiResponse } from "@/interfaces/api/Response";

export default function Assignment({
    // type
    title,
    date,
    isTeacher,
    classId,
    assignmentId,
    late,
    returned,
    submitted,
}: {
    title: string,
    date: string | Date,
    isTeacher: boolean,
    classId: string,
    assignmentId: string,
    late: boolean,
    returned: boolean,
    submitted: boolean,
}) {
    const dispatch = useDispatch();

    return (<div className="bg-white py-3 flex justify-between">
        <div className="flex flex-row space-x-4 items-center">
            <IconFrame>
                <HiBookmark />
            </IconFrame>
            <div className="flex flex-col space-y-2">
                <a
                    href={`/classes/${classId}/assignment/${assignmentId}`}
                    className="font-bold hover:underline cursor-pointer">{title}</a>
                <span className="text-gray-400 pr-5">{new Date(date).toDateString()}</span>
            </div>
        </div>
        {!isTeacher && (
            <div className="flex flex-row space-x-3 items-center">
                {late && <span className="bg-red-100 text-red-500 px-2.5 py-0.5 rounded">Late</span>}
                {submitted && !returned &&<span className="bg-green-100 text-green-500 px-2.5 py-0.5 rounded">Submitted</span>}
                {returned && <span className="bg-blue-100 text-blue-500 px-2.5 py-0.5 rounded">Returned</span>}
            </div>
        )}
        {isTeacher && (
            <div className="flex flex-row space-x-3 items-center">
                
                <Button.SM href={`/classes/${classId}/assignment/${assignmentId}/edit`}><HiPencil /></Button.SM>
                <Button.SM className="hover:text-red-400" onClick={() => {
                    fetch(`/api/class/${classId}/assignment`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: assignmentId
                        } as DeleteAssignmentRequest),
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
                                remark: "Please try again later",
                            }));
                        });
                }}><HiTrash /></Button.SM>
            </div>)}
    </div>)
}