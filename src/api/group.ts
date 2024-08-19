import type {
  ServerResponse,
  Room,
  CreateGroupBody,
  UpdateGroupNameBody,
  UpdateGroupPhotoBody,
  AddMemberGroupBody,
} from "@/types/api";
import client from "@/api/request";

export const getGroups = (): ServerResponse<Room[]> => {
  return client.get(`/v1/groups`);
};

export const getGroup = (roomId: number): ServerResponse<Room> => {
  return client.get(`/v1/groups/${roomId}`);
};

export const createGroup = (body: CreateGroupBody): ServerResponse<Room> => {
  return client.post(`/v1/groups`, body);
};

export const updateGroupName = (
  roomId: number,
  body: UpdateGroupNameBody
): ServerResponse<Room> => {
  return client.put(`/v1/groups/${roomId}/name`, body);
};

export const updateGroupPhoto = (
  roomId: number,
  body: UpdateGroupPhotoBody
): ServerResponse<Room> => {
  return client.put(`/v1/groups/${roomId}/photo`, body);
};

export const addMemberGroup = (
  roomId: number,
  body: AddMemberGroupBody
): ServerResponse<Room> => {
  return client.post(`/v1/groups/${roomId}/members`, body);
};

export const removeMemberGroup = (
  roomId: number,
  userId: number
): ServerResponse<Room> => {
  return client.delete(`/v1/groups/${roomId}/members/${userId}`);
};
