import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const body = await request.json();
    const cookieStore = cookies();

    console.log(body)

    const token = cookieStore.get('token')?.value;

    if (!token) {
        return Response.json({
            success: false,
            payload: {
                remark: 'Unauthorized',
            },
        }, { status: 401 });
    }

    const userSession = await prisma.session.findUnique({
        where: {
            id: token,
        },
    });

    if (!userSession || !userSession.userId) {
        return Response.json({
            success: false,
            payload: {
                remark: 'Session does not exist',
            },
        }, { status: 401 });
    }

    const { files }: { files: { name: string; type: string; base64: string; }[] } = body;

    if (!files) {
        return Response.json({
            success: true,
            payload: {
                remark: 'No files provided',
                files: [],
            },
        }, { status: 400 });
    }

    const uploadedFiles: { id: string, name: string, type: string, path: string }[] = [];

    try {
        await Promise.all(files.map(async (file) => {
            const newFile = await prisma.file.create({
                data: {
                    name: file.name,
                    type: file.type,
                    path: '/public',
                },
            });

            const filePath: string = `/public/${newFile.id}.${newFile.type.split('/')[1]}`;

            uploadedFiles.push({
                id: newFile.id,
                path: filePath,
                name: file.name,
                type: file.type,
            });

            try {

                await writeFile(`.${filePath}`, file.base64.split(',')[1], 'base64');

                await prisma.file.update({
                    where: {
                        id: newFile.id,
                    },
                    data: {
                        path: filePath,
                    },
                });
            } catch (err) {
                await prisma.file.delete({
                    where: {
                        id: newFile.id,
                    },
                });
                throw new Error('Failed to write file');
            }
        }));

        return Response.json({
            success: true,
            payload: {
                files: uploadedFiles
            },
        }, { status: 200 });
    } catch (err) {
        throw err;
        return Response.json({
            success: false,
            payload: {
                remark: 'Failed to upload files',
            },
        }, { status: 500 });
    }
}

// export default function DELETE(request)