import { Profile } from "@/types/api";
import { create } from "zustand";
import { getProfile } from "@/api/profile";

interface ProfileState {
  profile: Profile | null;
  loadProfile: () => Promise<void>;
  removeProfile: () => void;
}

const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loadProfile: async () => {
    console.log("loadProfile");
    try {
      const res = await getProfile();
      if (res.status === 200 && res.data) {
        set({ profile: res.data.data });
      }
    } catch (error) {
      console.error(error);
    }
  },
  removeProfile: () => {
    console.log("removeProfile");
    set({ profile: null });
  },
}));

export default useProfileStore;
