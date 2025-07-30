import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { FaChevronDown as Down } from "react-icons/fa";

interface MainDropDownProps {
    triggerName: string;
}

export default function MainDropDown(props: MainDropDownProps) {
    const { triggerName } = props;

    return (
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
                    <DropdownMenuItem
                    >Create Category</DropdownMenuItem>
                    <DropdownMenuItem>Create Channel</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
