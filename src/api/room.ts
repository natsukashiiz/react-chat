import type { ServerResponse } from "@/types/api";
import client from "@/api/request";

export const muteRoom = (roomId: number): ServerResponse<void> => {
  return client.post(`/v1/rooms/${roomId}/mute`);
};

export const unmuteRoom = (roomId: number): ServerResponse<void> => {
  return client.post(`/v1/rooms/${roomId}/unmute`);
};
