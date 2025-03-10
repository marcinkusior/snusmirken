import { createRouteHandler } from "uploadthing/next";

import { UploadFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: UploadFileRouter,
});
