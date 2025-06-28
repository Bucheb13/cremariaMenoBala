import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload completo:", file.url);
      // Aqui você pode salvar a URL no MongoDB ou onde quiser
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
