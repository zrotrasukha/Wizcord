import { maxHeaderSize } from "node:http";
import { FileRouter } from "uploadthing/types";
import { f, handleAuth } from "./core";
import { metadata } from "@/app/layout";

import { uploadRouter } from "./core";
import { createRouteHandler } from "uploadthing/next";


// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
