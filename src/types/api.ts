import { AxiosResponse } from "axios";
import { FriendStatus, MessageAction, MessageType, RoomType } from "./enum";

export type ServerResponse<T> = Promise<AxiosResponse<ApiResponse<T>>>;

export interface ApiResponse<T> {
  status: number;
  data: T;
  total: number;
  timestamp: Date;
}

export interface Pagination {
  page?: number;
  size?: number;
  sort?: string;
}

export interface TokenPayload {
  sub: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

export interface SignUpBody {
  username: string;
  mobile: string;
  password: string;
}

export interface LoginBody {
  identifier: string;
  password: string;
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface Profile {
  id: number;
  username: string;
  mobile: string;
  nickname: string;
  avatar?: string;
  lastSeenAt: Date;
}

export interface UpdateProfileBody {
  username: string;
  mobile: string;
  password: string;
  nickname: string;
  avatar: string;
}

export interface Message {
  id: number;
  action: MessageAction;
  type: MessageType;
  content: string;
  sender: Profile;
  room: Room;
  mention: Profile;
  replyTo: Message;
  createdAt: Date;
}

export interface Room {
  id: number;
  type: RoomType;
  name: string | null;
  image: string | null;
  members: GroupMember[];
  friend: Profile;
  messages: Message[];
  messageCount: number | null;
  unreadCount: number | null;
}

export interface Inbox {
  id: number;
  room: Room;
  lastMessage: Message;
  unreadCount: number;
}

export interface AddMemberGroupBody {
  memberIds: number[];
}

export interface GroupMember {
  id: number;
  username: string;
  mobile: string;
  nickname: string;
  avatar: string;
  lastSeenAt: Date;
  owner?: boolean;
}

export interface CreateGroupBody {
  name: string;
  image: string;
  memberIds: number[];
}

export interface UpdateGroupPhotoBody {
  photo: string;
}

export interface UpdateGroupNameBody {
  name: string;
}

export interface SendMessageBody {
  type: MessageType;
  content: string;
}
export interface ReplyMessageBody {
  type: MessageType;
  content: string;
  replyToId: number;
}

export interface Friend {
  friend: Profile;
  status: FriendStatus;
}
