import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { UploadRouter } from "./core";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();
