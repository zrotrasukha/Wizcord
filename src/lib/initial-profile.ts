import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const profile = await db.profile.findUnique({
    where: {
      userId: user?.id
    }
  });

  if (profile) return profile;

  const newProfile = await db.profile.create({
    data: {
      email: user!.emailAddresses[0].emailAddress,
      name: `${user?.firstName} ${user?.lastName}`,
      userId: user!.id,
      imageURL: user?.imageUrl,


    }
  });
  return newProfile;
}
