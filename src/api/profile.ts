import type { ServerResponse, Profile, UpdateProfileBody } from "@/types/api";
import client from "@/api/request";

export const getProfile = (): ServerResponse<Profile> => {
  return client.get("/v1/profile");
};

export const updateProfile = (
  data: UpdateProfileBody
): ServerResponse<Profile> => {
  return client.put("/v1/profile", data);
};
