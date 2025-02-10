import { HiTrash } from "react-icons/hi";

export default function FileEdit({
    src,
    name,
    type,
    onDelete,
}: {
    src: string,
    name: string,
    type: string,
    onDelete: () => void,
}) {
    return (<div className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-3">
            <img src={src} className="w-10 h-10 rounded-md" />
            <div className="flex flex-col">
                <span className="font-semibold">
                    {name}
                </span>
                <span className="text-gray-500 text-xs">
                    {type}
                </span>
            </div>
        </div>
        <HiTrash className="text-red-500 size-4 cursor-pointer ms-auto" onClick={() => onDelete()} />
    </div>)
}