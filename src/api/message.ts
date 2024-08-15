import type {
  ServerResponse,
  Room,
  SendMessageBody,
  Message,
  Pagination,
} from "@/types/api";
import client from "@/api/request";

export const getMessages = (
  roomId: number,
  params: Pagination
): ServerResponse<Room> => {
  return client.get(`/v1/messages/${roomId}`, { params });
};

export const sendMessage = (
  roomId: number,
  body: SendMessageBody
): ServerResponse<Message> => {
  return client.post(`/v1/messages/${roomId}/send`, body);
};
