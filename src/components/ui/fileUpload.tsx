"use client"

import React from 'react'
import { UploadDropzone } from '@/app/api/uploadthing/uploadthing';
import { NextResponse } from 'next/server';

interface FileUploadProps {
  onChange?: (url?: string) => void;
  value?: string;
  endpoint?: "messageFile" | "serverImage";
}

interface UploadFileResponse extends NextResponse{
  name: string
  size: number
  key: string
  url: string
  customId: string | null
  // The data returned from the `onUploadComplete` callback on
  // the file route. Note that if `RouteOptions.awaitServerData`
  // isn't enabled this will be `null`.
}

export default function FileUpload({
  onChange,
  value,
  endpoint = "serverImage"
}: FileUploadProps) {
  return (
    <UploadDropzone
      className='ut-upload-icon:size-20 ut-button:text-black '
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange?.(res[0]?.ufsUrl);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error: ", error);
      }}
    />

  )
}
