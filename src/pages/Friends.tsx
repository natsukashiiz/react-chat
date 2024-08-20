import {
  acceptFriend,
  addFriend,
  rejectFriend,
  searchFriend,
} from "@/api/friend";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/UserAvatar";
import useAuthStore from "@/stores/auth";
import useFriendStore from "@/stores/friend";
import { Friend } from "@/types/api";
import { AxiosError } from "axios";
import { useState } from "react";

const Friends = () => {
  const { profile } = useAuthStore();
  const { friendList, removeFriendList } = useFriendStore();

  const [friend, setFriend] = useState<Friend | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  const handleSearchFriend = async (keyword: string) => {
    setNotFound(false);
    setSearching(true);
    try {
      const res = await searchFriend(keyword);
      if (res.status === 200 && res.data) {
        setFriend(res.data.data);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 417) {
          if (error.response.data.error === "friend.not.found") {
            setNotFound(true);
          }
        }
      }
    }
    setSearching(false);
  };

  const handleAddFriend = async (friendId: number) => {
    try {
      const res = await addFriend(friendId);
      if (res.status === 200 && res.data) {
        setFriend(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptFriend = async (friendId: number) => {
    try {
      const res = await acceptFriend(friendId);
      if (res.status === 200 && res.data) {
        removeFriendList(friendId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectFriend = async (friendId: number) => {
    try {
      const res = await rejectFriend(friendId);
      if (res.status === 200 && res.data) {
        removeFriendList(friendId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-h-dvh max-w-lg mx-auto mt-10 flex flex-col space-y-2">
      <Card>
        <div className="flex flex-col items-center space-x-4 space-y-4 p-6">
          <div className="flex space-x-2 w-full">
            <Input
              type="text"
              placeholder="Enter username or mobile"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button onClick={() => handleSearchFriend(keyword)}>Search</Button>
          </div>
          {searching && <div>Searching...</div>}
          {notFound && <div>Friend not found</div>}
          {friend && (
            <div className="w-full flex flex-col items-center space-y-4">
              <div className="flex space-x-4 border p-5 rounded-xl">
                <UserAvatar
                  avatar={friend.profile.avatar}
                  name={friend.profile.nickname}
                />
                <div>
                  <div className="font-semibold">{friend.profile.username}</div>
                  <div className="text-sm text-gray-500">
                    {friend.profile.mobile}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleAddFriend(friend.profile.id)}
                disabled={
                  friend.status != null || friend.profile.id === profile?.id
                }
              >
                {friend.status != null ? friend.status : "Add Friend"}
              </Button>
            </div>
          )}
        </div>
      </Card>
      <Card>
        <CardHeader>
          Friends Request ({friendList.length > 99 ? "99+" : friendList.length})
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-full items-center justify-center p-6">
            {friendList.length > 0 ? (
              friendList
                .sort((a, b) => b.profile.id - a.profile.id)
                .map((friend) => (
                  <div
                    key={friend.profile.id}
                    className="w-full flex items-center justify-between space-x-4"
                  >
                    <div className="flex space-x-4">
                      <UserAvatar
                        avatar={friend.profile.avatar}
                        name={friend.profile.nickname}
                      />
                      <div>
                        <div className="font-semibold">
                          {friend.profile.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {friend.profile.mobile}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size={"sm"}
                        onClick={() => handleAcceptFriend(friend.profile.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        size={"sm"}
                        variant={"outline"}
                        onClick={() => handleRejectFriend(friend.profile.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center">Empty friends</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Friends;
