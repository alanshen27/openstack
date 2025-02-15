import { SubmissionSelectArgs } from "@/interfaces/api/Class";
import { ApiResponse } from "@/interfaces/api/Response";
import { getUserFromToken } from "@/lib/getUserFromToken";
import prisma from "@/lib/prisma";
import { userIsTeacherInClass } from "@/lib/userIsTeacherInClass";
import { Submission } from "@/interfaces/api/Class";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type GetSubmissionRequest = {
    submissions: Submission[];
}

// GET /api/assignment/[assignmentId]/submissions
// SECURITY Level 3: Class Teacher

export async function GET (_: Request, { params }: { params: { assignmentId: string } }): Promise<NextResponse<ApiResponse<GetSubmissionRequest>>> {
    const cookieStore = cookies();
    const assignmentId = params.assignmentId;

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

    if (!assignmentId) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Invalid assignment ID',
            },
        });
    }

    const classId = (await prisma.assignment.findFirst({
        where: {
            id: params.assignmentId,
        },
        select: {
            classId: true,
        },
    }))?.classId;

    if (!classId) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Assignment not found',
            },
        });
    }

    const teacherInClass = userIsTeacherInClass(userId, classId);

    if (!teacherInClass) {
        return NextResponse.json({
            success: false,
            payload: {
                remark: 'Unauthorized',
            },
        });
    }
    
    const submissions: Submission[] = await prisma.submission.findMany({
        where: {
            assignmentId,
        },
        select: {               
            ...SubmissionSelectArgs,
        }
    });

    return NextResponse.json({
        success: true,
        payload: {
            submissions,
        },
    });
}