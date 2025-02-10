// "use client";

// import Calendar from "@/components/util/Calendar";
// import { AlertLevel } from "@/lib/alertLevel";
// import { addAlert, closeModal, openModal } from "@/store/appSlice";
// import { useEffect, useState } from "react";
// import { HiAcademicCap, HiClock, HiX } from "react-icons/hi";
// import { useDispatch } from "react-redux";

// function CreateEvent({
//     selectedDay
// }: {
//     selectedDay: Date;
// }) {
//     const dispatch = useDispatch();

//     const [eventData, setEventData] = useState({
//         name: '',
//         location: '',
//         remarks: '',
//         startTime: selectedDay.toISOString(),
//         endTime: selectedDay.toISOString()
//     });

//     console.log(eventData);

//     return (<>
//         <div className="bg-white p-7 w-[32rem] rounded-md">
//             <div className="flex flex-row justify-between items-center">
//                 <span className="font-semibold text-lg">Add Event</span>
//                 <button className="text-gray-500" onClick={() => dispatch(closeModal())}><HiX /></button>
//             </div>
//             <div className="flex flex-col space-y-3 mt-3">
//                 <div className="flex flex-col space-y-1">
//                     <label className="text-xs text-black font-semibold">Event name:</label>
//                     <input type="text" placeholder="Event Name" className="p-2 px-4 text-sm bg-gray-100 rounded-md"
//                     value={eventData.name}
//                     onChange={(e) => setEventData({
//                         ...eventData,
//                         name: e.target.value,
//                     })}/>
//                 </div>
//                 <div className="flex flex-col space-y-1">
//                     <label className="text-xs text-black font-semibold">Location:</label>
//                     <input type="text" placeholder="Location here" className="p-2 px-4 text-sm bg-gray-100 rounded-md"
//                     value={eventData.location}
//                     onChange={(e) => setEventData({
//                         ...eventData,
//                         location: e.target.value,
//                     })}
//                     />
//                 </div>
//                 <div className="flex flex-col space-y-1">
//                     <label className="text-xs text-black font-semibold">Remarks:</label>
//                     <textarea placeholder="Remarks here..." className="p-2 px-4 text-sm bg-gray-100 rounded-md"
//                     value={eventData.remarks}
//                     onChange={(e) => setEventData({
//                         ...eventData,
//                         remarks: e.target.value,
//                     })}
//                     />
//                 </div>
//                 <div className="flex flex-row justify-between space-x-2 w-full flex-grow-0 shrink-0">
//                     <div className="flex flex-col space-y-1 w-full">
//                         <label className="text-xs text-black font-semibold">Start time:</label>
//                         <input type="datetime-local"
//                         value={eventData.startTime.replace('Z', '')}
//                         onChange={(e) => setEventData({
//                             ...eventData,
//                             startTime: e.target.value,
//                         })}
//                         className="p-2 px-4 text-sm bg-gray-100 rounded-md"/>
//                     </div>
//                     <div className="flex flex-col space-y-1 w-full">
//                         <label className="text-xs text-black font-semibold">End time:</label>
//                         <input type="datetime-local" 
//                         value={eventData.endTime.replace('Z', '')}
//                         onChange={(e) => setEventData({
//                             ...eventData,
//                             endTime: e.target.value,
//                         })}
//                         className="p-2 px-4 text-sm bg-gray-100 rounded-md"/>
//                     </div>
//                 </div>
//                 <button className="bg-black text-white p-2 rounded-md"
//                 onClick={() => {
//                     fetch('/api/agenda', {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             ...eventData,
//                             startTime: new Date(eventData.startTime).toUTCString(),
//                             endTime: new Date(eventData.endTime).toUTCString(),
//                         }),
//                     }).then((res) => res.json())
//                     .then((data) => {
//                         if (data.success) {
//                             dispatch(closeModal());
//                             dispatch(addAlert({
//                                 remark: 'Event added successfully',
//                                 level: AlertLevel.SUCCESS,
//                             }));
//                         } else {
//                             dispatch(addAlert({
//                                 remark: data.payload.remark,
//                                 level: AlertLevel.ERROR,
//                             }));
//                         }
//                     })
//                     .catch(() => {
//                         dispatch(addAlert({
//                             remark: 'An error occurred',
//                             level: AlertLevel.ERROR,
//                         }));
//                     });
//                 }}>
//                     Add Event
//                 </button>
//             </div>
//         </div>
//     </>);
// }


// export default function Agenda () {
//     const [weekDays, setWeekDays] = useState<Date[]>([]);
//     const [selectedDay, setSelectedDay] = useState<number>(0);
//     const [events, setEvents] = useState<any[]>([]);

//     const WEEKDAY_LABELS = [
//         'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'
//     ]

//     useEffect(() => {
//         if (!weekDays.length)   return;
//         fetch('/api/agenda', {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 weekStart: weekDays[0].toISOString(),
//                 weekEnd: weekDays[6].toISOString(),
//             }),
//         }).then((res) => res.json())
//         .then((data) => {
//             if (data.success) {
//                 setEvents(data.payload.events);
//             }
//         });
//     }, [weekDays]);


//     const dispatch = useDispatch();

//     return (
//         <div className="flex flex-row ml-12">

//             {/* sidebar */}
//             <div className="flex flex-col w-[17rem] shrink-0">
//                 <Calendar onChange={(e) => {
//                     console.log(e.week!);
//                     setWeekDays(e.week!);
//                     setSelectedDay(((new Date(Date.UTC(e.year, e.month, e.day)).getDay() - 1) > -1) ? (new Date(Date.UTC(e.year, e.month, e.day)).getDay() - 1) : 6);
//                 }}/>
//                 <span className="text-sm font-semibold my-3">Due today</span>
//                 <div className="flex flex-col space-y-3">
//                     <div className="flex flex-row items-center p-2 space-x-3">
//                         <div className="size-12 shrink-0 bg-gray-200 text-lg text-gray-500 rounded-md flex items-center justify-center">
//                             <HiAcademicCap />
//                         </div>
//                         <div className="flex flex-col space-y-1">
//                             <span className="font-semibold text-sm hover:underline">Finish the project</span>
//                             <span className="text-gray-400 text-xs">Finish the project</span>
//                         </div>
//                     </div>

//                     <div className="flex flex-row items-center p-2 space-x-3">
//                         <div className="size-12 shrink-0 bg-gray-200 text-lg text-gray-500 rounded-md flex items-center justify-center">
//                             <HiAcademicCap />
//                         </div>
//                         <div className="flex flex-col space-y-1">
//                             <span className="font-semibold text-sm hover:underline">Finish the project</span>
//                             <span className="text-gray-400 text-xs">Finish the project</span>
//                         </div>
//                     </div>

//                     <div className="flex flex-row items-center p-2 space-x-3">
//                         <div className="size-12 shrink-0 bg-gray-200 text-lg text-gray-500 rounded-md flex items-center justify-center">
//                             <HiAcademicCap />
//                         </div>
//                         <div className="flex flex-col space-y-1">
//                             <span className="font-semibold text-sm hover:underline">Finish the project</span>
//                             <span className="text-gray-400 text-xs">Finish the project</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="w-full flex flex-col space-y-3">
//                 <div className="flex flex-row ml-12">
//                     <button className="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-md"
//                     onClick={() => {
//                         dispatch(openModal(<CreateEvent selectedDay={weekDays[selectedDay]} />));
//                     }}
//                     >Add Event</button>
//                 </div>
//                 <div className="flex flex-row space-x-1 ml-5 w-full h-full mx-7 pt-5">
//                     {
//                         weekDays.map((day, index) => (
//                             <div key={index} className="flex flex-col w-[9rem] shrink-0">
//                                 <span
//                                 onClick={() => setSelectedDay(index)}
//                                 className={`hover:underline text-sm font-semibold text-center ${index == selectedDay ? 'text-black' : "text-gray-500"}`}>{WEEKDAY_LABELS[index]} <span className={`${index == selectedDay ? 'text-white px-2 rounded-full bg-black' : "text-gray-500"}`}>{day.getDate()}</span></span>
//                                 <div className="flex flex-col space-y-3 mt-8 items-center">
//                                     {
//                                         events.user?.filter((e) => new Date(e.startTime).getDate() == day.getDate()).map((e, i) => (
//                                             <div key={i} className="flex flex-row items-start space-x-3 bg-gray-100 hover:bg-gray-200 p-2 rounded-md w-full"
//                                             onClick={() => {
//                                                 dispatch(openModal(<div className="bg-white p-7 rounded-md w-[30rem]">
//                                                     <h1 className="font-semibold text-lg">{e.name}</h1>
//                                                     <div className="flex flex-row justify-between items-center mt-3">
//                                                         <span className="text-gray-400 text-xs">{e.location}</span>
//                                                         <span className="text-gray-400 text-xs">{new Date(e.startTime).toLocaleTimeString()} - {new Date(e.endTime).toLocaleTimeString()}</span>
//                                                     </div>
//                                                     <p className="text-gray-500 mt-3">{e.remarks}</p>
//                                                 </div>));
//                                             }}
//                                             >
//                                                 <div className="flex flex-col space-y-1">
//                                                     <div className="flex flex-row space-x-1 items-center">
//                                                         <span className="font-semibold text-sm hover:underline">{`${new Date(e.startTime).getHours().toString().length - 1 ? new Date(e.startTime).getHours() : '0' + new Date(e.startTime).getHours()}:${new Date(e.startTime).getMinutes().toString.length - 1 ? new Date(e.startTime).getMinutes() : '0' + new Date(e.startTime).getMinutes()} `}</span>
//                                                         <div className="size-5 shrink-0 flex justify-center items-center">
//                                                             <HiClock />
//                                                         </div>
//                                                     </div>
//                                                     <span className="text-gray-400 text-xs">{e.name}</span>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     }
//                                     {
//                                         events.class?.filter((e) => new Date(e.startTime).getDate() === day.getDate()).map((e, i) => (
//                                             <div key={i} className="flex flex-row items-center space-x-3">
//                                                 <div className="size-5 shrink-0 bg-gray-200 text-lg text-gray-500 rounded-md flex items-center justify-center">
//                                                     <HiClock />
//                                                 </div>
//                                                 <div className="flex flex-col space-y-1">
//                                                     <span className="font-semibold text-sm hover:underline">{new Date(e.startTime).toLocaleTimeString()}</span>
//                                                     <span className="text-gray-400 text-xs">{e.name}</span>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     }
//                                     {
//                                         events.user?.filter((e) => new Date(e.startTime).getDate() === day.getDate()).length === 0 && events.class?.filter((e) => new Date(e.startTime).getDate() === day.getDate()).length === 0 && (
//                                             <div className="flex flex-row justify-center space-x-3">
//                                                 <div className="text-gray-500">No events</div>
//                                             </div>
//                                         )
//                                     }
//                                 </div>
//                             </div>
//                         ))
//                     }
//                 </div>
//             </div>

//         </div>
//     );
// }