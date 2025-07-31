import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import CreateCategory from "./createCategory";
import { FaChevronDown as Down } from "react-icons/fa";
import type { ChannelType } from "./secondSidebar";
import { useState } from "react";

interface MainDropDownProps {
    triggerName: string;
}

export default function MainDropDown(props: MainDropDownProps) {
    const { triggerName } = props;
    const randomId = Math.random().toString(36).substring(2, 15); // Generate a random ID for the new channel
    const [createCategory, setCreateCategory] = useState(false);

    const handleCreateCategoryComplete = () => {
        setCreateCategory(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="text-2xl text-white w-full text-start hover:bg-zinc-600/50 data-[state=open]:bg-zinc-600/50 hover:p-2 data-[state=open]:p-2 transition-all rounded-md flex justify-between items-center bg-transparent border-none outline-none">
                        {triggerName}
                        <Down className="text-white" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 text-white bg-gray-900 border-[1px]" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            Invite
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => { setCreateCategory(true) }}
                        >Create Category
                        </DropdownMenuItem>
                        <DropdownMenuItem >
                            Create Channel
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Create Category Dialog */}
            {createCategory && (
                <CreateCategory
                    onComplete={handleCreateCategoryComplete}
                    onCancel={handleCreateCategoryComplete}
                />
            )}
        </>
    )
}
