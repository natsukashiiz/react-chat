import type { ServerResponse, Room } from "@/types/api";
import client from "@/api/request";

export const getMessages = (roomId: number): ServerResponse<Room> => {
  return client.get("/v1/messages/" + roomId);
};
