import { removeAlert, type Alert } from "@/store/appSlice";
import { HiInformationCircle, HiX } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { AlertLevel } from "@/lib/alertLevel";
import { useEffect } from "react";

export default function Alert({
    remark,
    level,
    index,
}: Readonly<Alert & {
    index: number;
    remark: string;
    level: AlertLevel;
}>) {
    const dispatch = useDispatch();
    
    let color = ''
    let exclamation = ''

    switch (level) {
        case AlertLevel.INFO:
            color = 'text-blue-800 bg-blue-100';
            exclamation = 'Info!';
            break;
        case AlertLevel.SUCCESS:
            color = 'text-green-800 bg-green-100';
            exclamation = 'Success!';
            break;
        case AlertLevel.WARNING:
            color = 'text-yellow-800 bg-yellow-100';
            exclamation = 'Warning!';
            break;
        case AlertLevel.ERROR:
            color = 'text-red-800 bg-red-100';
            exclamation = 'Error!';
            break;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeAlert(index));
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (<div className={`flex flex-row space-x-3 items-center p-4 mb-4 text-sm ${color} rounded-md pointer-events-auto`} role="alert">
        <HiInformationCircle className="size-4" />
        <div>
          <span className="font-medium">{exclamation}</span> {remark}
        </div>
        <HiX className="size-4 cursor-pointer" onClick={() => {
            dispatch(removeAlert(index));
        }}/>
      </div>)
}