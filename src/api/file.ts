import type { ServerResponse, FileUpload } from "@/types/api";
import client from "@/api/request";

export const uploadFile = (form: FormData): ServerResponse<FileUpload> =>
  client.post("/v1/files/upload", form);
