'use client';

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";

export default function UploadImagem() {
  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Upload completo no cliente:", res);
        // Salve res[0].url no seu banco de dados aqui se quiser
      }}
      onUploadError={(error) => {
        alert(`Erro ao enviar: ${error.message}`);
      }}
    />
  );
}
