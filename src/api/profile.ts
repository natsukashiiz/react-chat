import type { ServerResponse, Profile } from "@/types/api";
import client from "@/api/request";

export const getProfile = (): ServerResponse<Profile> => {
  return client.get("/v1/profile");
};
