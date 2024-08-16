import { Room } from "@/types/api";
import { create } from "zustand";

interface RoomState {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room) => void;
  removeCurrentRoom: () => void;
}

const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  setCurrentRoom: (room) => {
    console.log("setCurrentRoom", room.id);
    set({ currentRoom: room });
  },
  removeCurrentRoom: () => {
    console.log("removeCurrentRoom");
    set({ currentRoom: null });
  },
}));

export default useRoomStore;
