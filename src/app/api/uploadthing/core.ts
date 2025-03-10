import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const UploadFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    // This code RUNS ON YOUR SERVER after upload
    console.log("Upload complete for userId:", metadata.userId);

    console.log("file url", file.url);

    // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    return { uploadedBy: metadata.userId };
  }),
} satisfies FileRouter;

export type UploadFileRouter = typeof UploadFileRouter;
