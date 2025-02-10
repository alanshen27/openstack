// import { useState } from "react";
// import Button from "../util/Button";
// import Input from "../util/Input";

// export default function CreateAnnouncement({ classId }: { classId: string }) {
//     const [announcementProps, setAnnouncementProps] = useState({
//         contents: "",
//         classId: ""
//     });



//     return (<div className="flex flex-row space-x-3">
//         <Input.Text
//             value={"asd"}
//             placeholder="Class name" 
//             className="w-full"
//         />
//         {/* <HiSpeakerphone /> */}
//         <Button.Primary onClick={() => {
//             fetch(`/api/class/${classId}/announcement`, {
                
//             })

//         }}>Announce</Button.Primary>
//     </div>)
// }