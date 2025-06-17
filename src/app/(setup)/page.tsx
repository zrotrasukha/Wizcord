import InitialModal from "@/components/modals/initial_modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      Members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-background">
      <InitialModal />
    </div>
  );
}

export default SetupPage;
