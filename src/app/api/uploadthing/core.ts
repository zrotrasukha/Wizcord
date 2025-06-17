import { auth } from '@clerk/nextjs/server';
import { createUploadthing, FileRouter } from 'uploadthing/next';


export const f = createUploadthing();

export const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  return { userId }
}


export const uploadRouter = {
  serverImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    }
  })
    .middleware(() => handleAuth())
    .onUploadComplete(() => console.log("Upload complete!")),

  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => console.log("Upload complete!")),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter;
