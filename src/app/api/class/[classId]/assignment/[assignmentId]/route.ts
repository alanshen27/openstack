import { Assignment, GetAssignmentResponse } from "@/interfaces/api/Class";
import { ApiResponse, DefaultApiResponse } from "@/interfaces/api/Response";
import { getUserFromToken } from "@/lib/getUserFromToken";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


// GET /api/assignment/[assignmentId]
// SECURITY Level 3: Class Teacher or Student
export async function GET (request: Request, params: { params: { assignmentId: string }}): Promise<NextResponse<ApiResponse<GetAssignmentResponse>>> {
    const assignmentId = params.params.assignmentId;

    const cookieStore = cookies();

    const token = cookieStore.get('token')?.value;

    const userId = await getUserFromToken(token || null);

    if (!userId) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Unauthorized',
            },
        });
    }
    
    const requestedAssignment = await prisma.assignment.findUnique({
        where: {
            id: assignmentId,
        },
    });

    const requestedClass = await prisma.class.findFirst({
        where: {
            assignments: {
                some: {
                    id: requestedAssignment?.id,
                }
            }
        },
        select: {
            id: true,
            students: {
                select: {
                    id: true,
                },
            },
            teachers: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!requestedClass) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Class not found',
            },
        })
    }

    if (!requestedClass?.students.filter(student => student.id == userId).length && !requestedClass?.teachers.filter(teacher => teacher.id == userId).length) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Unauthorized',
            }
        });
    }

    const assignmentProps = await prisma.assignment.findUnique({
        where: {
            id: assignmentId,
        },
        select: {
            id: true,
            title: true,
            dueDate: true,
            createdAt: true,
            instructions: true,
            attachments: {
                select: {
                    path: true,
                    name: true,
                    type: true,
                    id: true,
                }
            },
            section: {
                select: {
                    id: true,
                    name: true,
                },
            },
            teacher: {
                select: {
                    username: true,
                }
            },
        }
    });

    const sections = await prisma.section.findMany({
        where: {
            classId: requestedClass.id,
        },
        select: {
            id: true,
            name: true,
        }
    });

    

    return NextResponse.json({
        success: true,
        payload: {
            remark: 'Get assignment successful',
            assignmentData: {
                ...assignmentProps,
                sections: sections,
            },
            classId: requestedClass.id,
        }
    });
}