// TBF: This file is not in use, it is just a placeholder for future development

// import prisma from "@/lib/prisma";
// import { cookies } from "next/headers";

// export async function PUT(request: Request) {
//     const cookieStore = cookies();
//     const body = await request.json();

//     const weekStart = new Date(new Date(body.weekStart).toUTCString());
//     const weekEnd = new Date(new Date(body.weekEnd).toUTCString());

//     console.log(weekStart, weekEnd);

//     if (!cookieStore.get('token')) {
//         return Response.json({
//             success: false,
//             payload: {
//                 remark: 'Unauthorized',
//             },
//         });
//     }

//     const session = await prisma.session.findFirst({
//         where: {
//             id: cookieStore.get('token')!.value,
//         },
//     });

//     if (!session || !session.userId) {
//         return Response.json({
//             success: false,
//             payload: {
//                 remark: "Session doesn't exist",
//             },
//         });
//     }

//     const user = await prisma.user.findFirst({
//         where: {
//             sessions: {
//                 some: {
//                     id: session.id
//                 },
//             }
//         },
//     });

//     if (!user) {
//         return Response.json({
//             success: false,
//             payload: {
//                 remark: 'User not found',
//             },
//         });
//     }

//     const userEvents = await prisma.event.findMany({
//         where: {
//             userId: user.id,
//             startTime: {
//                 gte: weekStart,
//                 lte: weekEnd,
//             },
//         },
//     });


//     const userClasses = await prisma.class.findMany({
//         where: {
//             students: {
//                 some: {
//                     id: user.id
//                 }
//             }
//         }
//     });

//     const classEvents = await prisma.event.findMany({
//         where: {
//             classId: {
//                 in: userClasses.map((c) => c.id)
//             },
//             startTime: {
//                 gte: weekStart,
//                 lte: weekEnd
//             }
//         }
//     });

//     const events = {
//         user: userEvents,
//         class: classEvents
//     };

//     return Response.json({
//         success: true,
//         payload: {
//             events,
//         },
//     });
// }

// export async function POST(request: Request) {
//     const cookieStore = cookies();
//     const body = await request.json();


//     if (!cookieStore.get('token')) {
//         return Response.json({
//             success: false,
//             payload: {
//                 remark: 'Unauthorized',
//             },
//         });
//     }

//     const session = await prisma.session.findFirst({
//         where: {
//             id: cookieStore.get('token')!.value,
//         },
//     });

//     if (!session || !session.userId) {
//         return Response.json({
//             success: false,
//             payload: {
//                 remark: "Session doesn't exist",
//             },
//         });
//     }

//     const user = await prisma.user.findFirst({
//         where: {
//             sessions: {
//                 some: {
//                     id: session.id
//                 },
//             }
//         },
//     });

//     if (!user) {
//         return Response.json({
//             success: false,
//             payload: {
//                 remark: 'User not found',
//             },
//         });
//     }

//     console.log(body.startTime)
    
//     const event = await prisma.event.create({
//         data: {
//             userId: user.id,
//             ...body,
//             startTime: new Date(new Date(body.startTime).toUTCString()),
//             endTime: new Date(new Date(body.endTime).toUTCString()),
//         },
//     });

//     return Response.json({
//         success: true,
//         payload: {
//             event: {
//                 ...event,
//                 startTime: event.startTime.toUTCString(),
//                 endTime: event.endTime.toUTCString(),
//             }
//         },
//     });
// }