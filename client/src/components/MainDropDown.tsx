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
import { useContext, useState } from "react";
import type { Category } from "@/types/app.types";
import { MainContext } from "@/routes";

interface MainDropDownProps {
  serverId: string; 
  triggerName: string;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function MainDropDown(props: MainDropDownProps) {
  const { triggerName } = props;
  const [createCategory, setCreateCategory] = useState(false);

  const handleCreateCategoryComplete = () => {
    setCreateCategory(false);
  };
  
  const ctx = useContext(MainContext);
  if(!ctx) throw new Error("MainContext is not available");
  const { setShowChannelCreateDialogue, setChannelCreationContext } = ctx;

  const handleCreateOrphanChannel = () => {
    setShowChannelCreateDialogue(true)
    setChannelCreationContext({serverId: props.serverId}) 
  }
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
            <DropdownMenuItem 
            >Create Category
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => { handleCreateOrphanChannel() }}
            >
              Create Channel
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Category Dialog */}
      {createCategory && (
        <CreateCategory

          setCategories={props.setCategories}
          onComplete={handleCreateCategoryComplete}
          onCancel={handleCreateCategoryComplete}
          categories={props.categories}

        />
      )}
    </>
  )
}
