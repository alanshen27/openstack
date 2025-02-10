"use client";

import FileDownload from "@/components/class/FileDownload";
import Empty from "@/components/Empty";
import Button from "@/components/util/Button";
import { Submission } from "@/interfaces/api/Class";
import { AssignmentGetBodyProps, AttachmentGetBodyProps, SubmissionCreateBodyProps, SubmissionGetBodyProps } from "@/interfaces/classes";
import { AlertLevel } from "@/lib/alertLevel";
import { fileToBase64 } from "@/lib/fileToBase64";
import { addAlert, setRefetch } from "@/store/appSlice";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { HiDownload, HiTrash } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";

export default function Assignment({ params }: { params: { classId: string, assignmentId: string } }) {
    const [assignmentProps, setAssignmentProps] = useState<AssignmentGetBodyProps | null>(null);

    const [submissionData, setSubmissionData] = useState<SubmissionCreateBodyProps & { refetch: boolean } | null>(null);

    const [submissionsData, setSubmissionsData] = useState<Submission[] | null>(null);

    const dispatch = useDispatch();

    const appState = useSelector((state: RootState) => state.app);

    const fileInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}`, {
            method: "GET",
        })
            .then(res => res.json())
            .then((data) => {
                if (data.success) {
                    setAssignmentProps(data.payload.assignmentData)
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
                    remark: "Please try again later",
                }));
            });
    }, [appState.user.teacher])


    useEffect(() => {
        if (appState.user.student) return;
        fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}/submissions`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSubmissionsData(data.payload.submissions);
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
    }, [appState.user.teacher])

    useEffect(() => {
        if (appState.user.teacher) return;

        fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}/submission`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSubmissionData({
                        ...data.payload.submissionData,
                        refetch: false,
                        newAttachments: [],
                        removedAttachments: [],
                    });
                    dispatch(setRefetch(false));
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
    }, [appState.user.student, appState.refetch]);

    useEffect(() => {
        if (appState.user.teacher) return;
        if (!submissionData) return;

        fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}/submission`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submissionData),
        })
            .then(res => res.json())
            .then(data => {
                dispatch(setRefetch(submissionData.refetch));
                if (!data.success) {
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

    }, [submissionData])

    console.log(submissionData?.submitted)

    return (
        <div className="mx-auto">
            {assignmentProps && (
                <div className="flex flex-col space-y-9">
                    <div className="rounded-lg flex flex-col space-y-9">
                        <span className="text-4xl font-semibold">{assignmentProps.title}</span>
                        <div className="flex flex-row justify-between space-x-5">
                            <span className="flex-shrink">{assignmentProps.instructions}</span>
                            <span className="text-gray-500 text-nowrap">{assignmentProps.dueDate.slice(0, 10)}</span>
                        </div>

                        {/* @description: show submissions */}
                        {appState.user.teacher && (
                            <>
                                <div className="flex flex-col space-y-5 p-6 border rounded-md">
                                    <span className="text-lg font-semibold">Submissions</span>
                                    {submissionsData && submissionsData.length === 0 && (
                                        <Empty message="No submissions" />
                                    )}
                                    {submissionsData && submissionsData.length > 0 && submissionsData.length && submissionsData.map((submission, index) => (
                                        <div key={index} className="flex flex-row justify-between bg-white rounded-md">
                                            <div className="flex flex-row items-center space-x-3">
                                                <div className="flex flex-col space-y-2">
                                                    <span className="font-semibold flex flex-row items-center space-x-4">
                                                        <div className="size-8 rounded-full bg-gray-500" />
                                                        <span className="flex flex-col space-y-2">
                                                            <div className="flex flex-row space-x-2 items-center">
                                                                <div>{submission.student.username} </div>
                                                                {submission.late && <span className={`bg-red-100 text-red-500 px-2.5 py-0.5 rounded`}>Late</span>}
                                                                {submission.submitted && !submission.returned && <span className={`bg-green-100 text-green-500 px-2.5 py-0.5 rounded`}>Submitted</span>}
                                                                {submission.returned && <span className={`bg-blue-100 text-blue-500 px-2.5 py-0.5 rounded`}>Returned</span>}
                                                                {!submission.submitted && !submission.returned && <span className={`bg-red-100 text-red-500 px-2.5 py-0.5 rounded`}>Not submitted</span>}
                                                            </div>
                                                            <span className="text-gray-500 text-xs">
                                                                {submission.attachments.length} {submission.attachments.length > 1 ? 'items' : 'item'}
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <a href={`/classes/${params.classId}/assignment/${params.assignmentId}/submission/${submission.id}`} className="text-blue-500 hover:text-blue-700">View</a>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* @description: show attachments */}
                        {assignmentProps && (<>
                            <div className="flex flex-col space-y-5 p-6 rounded-md border">
                                <div className="text-lg font-semibold">Attachments</div>
                                {
                                    assignmentProps.attachments.length <= 0 && (<Empty message="No attachments" />)
                                }
                                {
                                    assignmentProps.attachments.map((attachment: AttachmentGetBodyProps, index) => (
                                        <FileDownload
                                            key={index}
                                            name={attachment.name}
                                            src={attachment.path.replace('/public', '')}
                                            type={attachment.type}
                                        />
                                    ))
                                }
                            </div>
                        </>)}
                    </div>

                    {
                        appState.user.student && submissionData?.returned && (
                            <>
                                <div className="flex flex-col space-y-3">
                                    <span className="text-lg font-semibold">Feedback</span>
                                    <div className="flex flex-col space-y-7">
                                        {submissionData.annotations.length === 0 && (
                                            <Empty message="No feedback" />
                                        )}
                                        {
                                            submissionData.annotations.map((annotation, index) => (
                                                <div key={index} className="flex flex-row justify-between">
                                                    <div className="flex flex-row items-center space-x-3">
                                                        <img src={annotation.path.replace('/public', '')} className="w-10 h-10 rounded-md" />
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold">
                                                                {annotation.name}
                                                            </span>
                                                            <span className="text-gray-500 text-xs">
                                                                {annotation.type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button.SM href={annotation.path} download className="text-blue-500 hover:text-blue-700">
                                                        <HiDownload />
                                                    </Button.SM>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                    {/* @description: show submit/unsubmit button to student + file uploads */}
                    {appState.user.student && submissionData && (
                        <div className="flex flex-col space-y-3">
                            <span className="text-lg font-semibold">Submission</span>
                            {!submissionData.attachments.length && (<Empty message="No attachments" />)}
                            {submissionData.attachments.length > 0 && (<div className="flex flex-col space-y-7"
                            >{submissionData.attachments.map((attachment: AttachmentGetBodyProps, index) => (
                                <div key={index} className="flex flex-row justify-between">
                                    <div className="flex flex-row items-center space-x-3">
                                        <img src={attachment.path.replace('/public', '')} className="w-10 h-10 rounded-md" />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">
                                                {attachment.name}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {attachment.type}
                                            </span>
                                        </div>
                                    </div>
                                    {!submissionData.submitted && (
                                        <Button.SM className="text-red-500" onClick={() => {
                                            setSubmissionData({
                                                ...submissionData,
                                                refetch: false,
                                                attachments: submissionData.attachments.filter(a => a.id !== attachment.id),
                                                removedAttachments: (attachment.id) ? [{ id: attachment.id }] : [],
                                            });
                                        }}><HiTrash /></Button.SM>
                                    )}
                                </div>
                            ))}
                            </div>
                            )}
                            <div className="flex flex-row justify-end space-x-2">
                                <input type="file" className="hidden" ref={fileInput} onChange={(e) => {
                                    if (!e.target.files || !e.target.files[0]) return;
                                    fileToBase64(e.target.files[0])
                                        .then((base64: string) => {
                                            if (!e.target.files || !e.target.files[0]) return;

                                            setSubmissionData({
                                                ...submissionData,
                                                refetch: true,
                                                newAttachments: [{
                                                    name: e.target.files[0].name,
                                                    type: e.target.files[0].type,
                                                    base64: base64,
                                                    id: v4(),
                                                }],
                                            })
                                        })
                                        .catch(_ => {
                                            dispatch(addAlert({
                                                level: AlertLevel.ERROR,
                                                remark: "Please try again later",
                                            }));
                                        });
                                }} />
                                {!submissionData.submitted ? (<>
                                    <Button.Light onClick={() => fileInput?.current?.click()}>
                                        Attach
                                    </Button.Light>
                                    <Button.Primary
                                        onClick={() => {
                                            fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}/submission`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    submit: true,
                                                }),
                                            })
                                                .then(res => res.json())
                                                .then(data => {
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
                                                }
                                                )
                                        }}
                                    >
                                        Submit
                                    </Button.Primary>
                                </>) : (<div className="flex flex-row items-center space-x-3">
                                    <Button.Primary
                                        onClick={() => {
                                            fetch(`/api/class/${params.classId}/assignment/${params.assignmentId}/submission`, {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    submit: true,
                                                }),
                                            })
                                                .then(res => res.json())
                                                .then(data => {
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
                                                }
                                                )
                                        }}
                                    >
                                        Unsubmit
                                    </Button.Primary>
                                    <span className="text-gray-500">Submitted</span>
                                </div>)}
                            </div>
                        </div>)}

                </div>)}
        </div>
    )
}