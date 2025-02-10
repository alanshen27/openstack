import { NextResponse } from "next/server";
import { ApiResponse, DefaultApiResponse } from "@/interfaces/api/Response";
import { getUserFromToken } from "@/lib/getUserFromToken";
import prisma from "@/lib/prisma";
import { userIsTeacherInClass } from "@/lib/userIsTeacherInClass";
import { cookies } from "next/headers";
import { Class, GetClassResponse, Submission } from "@/interfaces/api/Class";
import { SubmissionSelectArgs } from "@/interfaces/api/Class";


// GET /api/class/[classId]
// SECURITY Level 2: Class Teacher or Student
// pnk57 ljsadhfjshdkljfashdlkjmh

export async function GET(_: Request, { params }: { params: { classId: string } }): Promise<NextResponse<ApiResponse<GetClassResponse>>> {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    const userId = await getUserFromToken(token || null);

    if (!userId)
        return NextResponse.json({
            success: false,
            payload: {
                remark: "Unauthorized",
            },
        });

    if (!params || !params.classId) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: "Invalid class ID",
            },
        });
    }

    const { classId } = params;

    const classData: Class | null = await prisma.class.findUnique({
        where: {
            id: classId,
            OR: [
                {
                    teachers: {
                        some: {
                            id: userId,
                        },
                    },
                },
                {
                    students: {
                        some: {
                            id: userId,
                        },
                    },
                },
            ]
        },
        select: {
            id: true,
            name: true,
            subject: true,
            section: true,
            teachers: {
                select: {
                    id: true,
                    username: true,
                },
            },
            students: {
                select: {
                    id: true,
                    username: true,
                },
            },
            assignments: {
                select: {
                    id: true,
                    title: true,
                    instructions: true,
                    createdAt: true,
                    dueDate: true,
                    attachments: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            path: true,
                        },
                    },
                    teacher: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    section: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
            },
            sections: {
                select: {
                    id: true,
                    name: true,
                }
            }
        },
    });

    if (!classData) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: "Class not found",
            },
        });
    }

    const isTeacher = await userIsTeacherInClass(userId, classId);

    if (isTeacher) {
        return NextResponse.json({
            success: true,
            payload: {
                classData,
            },
        });
    }

    const studentAssignments: Submission[] = await prisma.submission.findMany({
        where: {
            student: {
                id: userId,
            },
            assignment: {
                class: {
                    id: classId,
                }
            }
        },
        select: {
            ...SubmissionSelectArgs,
        },
    });

    if (classData.assignments.length != studentAssignments.length) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: "Error fetching student assignments",
            },
        });
    }

    return NextResponse.json({
        success: true,
        payload: {
            classData: {
                ...classData,
                assignments: classData.assignments.map((assignment, index) => ({
                    ...assignment,
                    late: ((studentAssignments[index].submittedAt) ? new Date(new Date(studentAssignments[index].submittedAt).toISOString().slice(0, 10)) : new Date(new Date().toISOString().slice(0, 10))) > new Date(assignment.dueDate!.toISOString().slice(0, 10)),
                    submitted: studentAssignments[index].submitted,
                    returned: studentAssignments[index].returned,
                })),
            }
        },
    });
}

export async function PUT(request: Request, { params }: { params: { classId: string } }): Promise<NextResponse<DefaultApiResponse>> {
    const classId = params.classId;

    const body = await request.json();

    const cookieStore = cookies();

    if (!body.name || !body.subject || !body.section) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Invalid class data',
            }
        });
    }

    const token = cookieStore.get("token")?.value;

    const userId = await getUserFromToken(token || null);

    if (!userId)
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Unauthorized',
            }
        });

    const classToChange = await prisma.class.findFirst({
        where: {
            id: classId,
            teachers: {
                some: {
                    id: userId,
                }
            }
        },
    });

    if (!classToChange) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Class not found',
            }
        });
    }

    await prisma.class.update({
        where: {
            id: classId,
        },
        data: {
            name: body.name,
            subject: body.subject,
            section: parseInt(body.section),
        },
    });

    return NextResponse.json({
        success: true,
        payload: {
            remark: 'Class updated',
        },
    });
}


export async function DELETE(
    request: Request,
    { params }: { params: { classId: string } }
): Promise<NextResponse<ApiResponse<any>>> {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const userId = await getUserFromToken(token || null);

    if (!userId)
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Unauthorized',
            }
        });

    const classId = params.classId;

    const classToDelete = await prisma.class.findFirst({
        where: {
            id: classId,
            teachers: {
                some: {
                    id: userId,
                }
            }
        },
    });

    if (!classToDelete) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Class not found',
            }
        });
    }

    await prisma.class.delete({
        where: {
            id: classId,
        },
    });

    return NextResponse.json({
        success: true,
        payload: {
            remark: 'Class deleted',
        },
    });
}