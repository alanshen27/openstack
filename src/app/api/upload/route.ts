import prisma from "@/lib/prisma";
import { writeFile } from "fs";

export async function POST (request: Request) {
    const body = await request.json();

    const { name, type, base64 } = body;

    if (!name || !type || !base64) {
        return Response.json({
            success: false,
            payload: {
                remark: 'Invalid file data',
            },
        });
    }


    const file = await prisma.file.create({
        data: {
            name,
            type,
        }
    });

    const filePath: string = `/public/${file.id}.${file.type.split('/')[1]}`;

    if (!file) {
        return Response.json({
            success: false,
            payload: {
                remark: 'Failed to create file',
            },
        });
    }

    writeFile(`.${filePath}}`, base64, 'base64', async (err) => {
        if (err) {
            await prisma.file.delete({
                where: {
                    id: file.id,
                },
            });

            return Response.json({
                success: false,
                payload: {
                    remark: 'Failed to write file',
                },
            });
        } else {
            await prisma.file.update({
                where: {
                    id: file.id,
                },
                data: {
                    path: filePath,
                }
            });

            return Response.json({
                success: true,
                payload: {
                    file: {
                        name,
                        type,
                        path: filePath,
                    },
                },
            });
        }
    });
}