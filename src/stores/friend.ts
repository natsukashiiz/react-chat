import { Friend } from "@/types/api";
import { create } from "zustand";

interface FriendState {
  friendList: Friend[];
  setFriendList: (friends: Friend[]) => void;
  addFriendList: (friend: Friend) => void;
  removeFriendList: (friendId: number) => void;
}

const useFriendStore = create<FriendState>((set) => ({
  friendList: [],
  setFriendList: (friendList) => set({ friendList }),
  addFriendList: (friend) =>
    set((state) => ({ friendList: [...state.friendList, friend] })),
  removeFriendList: (friendId) =>
    set((state) => ({
      friendList: state.friendList.filter(
        ({ profile }) => profile.id !== friendId
      ),
    })),
}));

export default useFriendStore;
