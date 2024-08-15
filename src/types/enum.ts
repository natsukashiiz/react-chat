export enum FriendStatus {
  Apply = "Apply",
  Friend = "Friend",
  BlockBySelf = "BlockBySelf",
  BlockByFriend = "BlockByFriend",
}

export enum MessageAction {
  SendMessage = "SendMessage",
  ReplyMessage = "ReplyMessage",
  EditMessage = "EditMessage",
  JoinChat = "JoinChat",
  LeaveChat = "LeaveChat",
  BlockUser = "BlockUser",
  UnblockUser = "UnblockUser",
  CreateGroupChat = "CreateGroupChat",
  RenameGroupChat = "RenameGroupChat",
  ChangeGroupChatPhoto = "ChangeGroupChatPhoto",
  RemoveGroupMember = "RemoveGroupMember",
  AddGroupMember = "AddGroupMember",
}

export enum MessageType {
  Text = "Text",
  Image = "Image",
  Audio = "Audio",
  Video = "Video",
  File = "File",
}

export enum RoomType {
  Friend = "Friend",
  Group = "Group",
}
