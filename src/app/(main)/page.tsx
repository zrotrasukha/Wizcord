import { ModeToggle } from "@/components/ui/themeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {


  return (
    <div className="h-screen w-screen">
      <UserButton />
      <ModeToggle />
    </div>

  );
}
