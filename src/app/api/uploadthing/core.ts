import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(async ({ file }) => {
    console.log("Upload completo:", file.url);
    // Aqui você deve salvar file.url no seu banco de dados (MongoDB)
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
