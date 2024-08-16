import {
  acceptFriend,
  addFriend,
  getFriends,
  rejectFriend,
  searchFriend,
} from "@/api/friend";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/UserAvatar";
import useAuthStore from "@/stores/auth";
import { Friend } from "@/types/api";
import { FriendStatus } from "@/types/enum";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const Friends = () => {
  const { profile } = useAuthStore();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res = await getFriends(FriendStatus.Apply);
        if (res.status === 200 && res.data) {
          setFriends([...res.data.data]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadFriends();
  }, []);

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
        setFriends(friends.filter((friend) => friend.friend.id !== friendId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRejectFriend = async (friendId: number) => {
    try {
      const res = await rejectFriend(friendId);
      if (res.status === 200 && res.data) {
        setFriends(friends.filter((friend) => friend.friend.id !== friendId));
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
                  avatar={friend.friend.avatar}
                  name={friend.friend.nickname}
                />
                <div>
                  <div className="font-semibold">{friend?.friend.username}</div>
                  <div className="text-sm text-gray-500">
                    {friend?.friend.mobile}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleAddFriend(friend.friend.id)}
                disabled={
                  friend.status != null || friend.friend.id === profile?.id
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
          Friends Request ({friends.length > 99 ? "99+" : friends.length})
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-full items-center justify-center p-6">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.friend.id}
                  className="w-full flex items-center justify-between space-x-4"
                >
                  <div className="flex space-x-4">
                    <UserAvatar
                      avatar={friend.friend.avatar}
                      name={friend.friend.nickname}
                    />
                    <div>
                      <div className="font-semibold">
                        {friend.friend.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {friend.friend.mobile}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size={"sm"}
                      onClick={() => handleAcceptFriend(friend.friend.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => handleRejectFriend(friend.friend.id)}
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
