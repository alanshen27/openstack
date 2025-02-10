"use client";

import { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

export default function Shelf({ label, content, children }: { label: React.ReactNode | string, content: React.ReactNode, children: React.ReactNode }) {

    const [opened, setOpened] = useState(false);

    return (
        <div className="flex flex-col space-y-1 select-none border px-3 rounded-md">
            <div className="flex justify-between py-3 ">
                <div className="flex flex-row space-x-4 items-center" onClick={() => {
                setOpened(!opened);
        }}>
                    {
                        opened ?
                            <BiChevronDown className="text-gray-700 size-5" />
                            :
                            <BiChevronRight className="text-gray-700 size-5" />
                    }
                    <div className="flex flex-col space-y-2">
                        <a
                            className="font-bold">{label}</a>
                    </div>
                </div>
                {content}
            </div>
            <div className="ml-8">
                {opened && children}
            </div>
        </div>
    )
}