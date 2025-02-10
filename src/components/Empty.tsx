import { HiPhoto } from "react-icons/hi2";

export default function Empty({ message }: { message?: string }) {
    return <div className="w-full h-full flex justify-center items-center bg-gray-100 border-4 border-dotted border-gray-200 rounded-md p-5">
        <div className="flex flex-col space-y-3 pt-12 pb-12 items-center justify-center h-[10rem]">
            <HiPhoto className="size-20 text-gray-500" />
            <span className="text-gray-500">{message ? message : 'Nothing to see here yet, something amazing is coming though...'}</span>
        </div>
    </div>;
}