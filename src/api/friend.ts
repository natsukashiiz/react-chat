import type { ServerResponse, Friend } from "@/types/api";
import client from "@/api/request";
import { FriendStatus } from "@/types/enum";

export const getFriends = (status: FriendStatus): ServerResponse<Friend[]> => {
  return client.get("/v1/friends", { params: { status } });
};

export const searchFriend = (identifier: string): ServerResponse<Friend> => {
  return client.get(`/v1/friends/search`, { params: { identifier } });
};

export const addFriend = (friendId: number): ServerResponse<Friend> => {
  return client.post(`/v1/friends/${friendId}/apply`);
};

export const acceptFriend = (friendId: number): ServerResponse<Friend> => {
  return client.post(`/v1/friends/${friendId}/accept`);
};

export const rejectFriend = (friendId: number): ServerResponse<Friend> => {
  return client.post(`/v1/friends/${friendId}/reject`);
};

export const blockFriend = (friendId: number): ServerResponse<Friend> => {
  return client.post(`/v1/friends/${friendId}/block`);
};

export const unblockFriend = (friendId: number): ServerResponse<Friend> => {
  return client.post(`/v1/friends/${friendId}/unblock`);
};

export const unfriend = (friendId: number): ServerResponse<Friend> => {
  return client.post(`/v1/friends/${friendId}/unfriend`);
};
