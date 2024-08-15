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
import useProfileStore from "@/stores/profile";
import { Friend } from "@/types/api";
import { FriendStatus } from "@/types/enum";
import { useEffect, useState } from "react";

const Friends = () => {
  const { profile } = useProfileStore();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friend, setFriend] = useState<Friend | null>(null);
  const [keyword, setKeyword] = useState<string>("");

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
    try {
      const res = await searchFriend(keyword);
      if (res.status === 200 && res.data) {
        setFriend(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
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
          {friend && (
            <div className="flex items-center space-x-4">
              <img
                src={friend?.friend.avatar}
                alt={friend?.friend.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold">{friend?.friend.username}</div>
                <div className="text-sm text-gray-500">
                  {friend?.friend.mobile}
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
        <CardHeader>{friends.length} Friends Request</CardHeader>
        <CardContent>
          <div className="flex flex-col h-full items-center justify-center p-6">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  key={friend.friend.id}
                  className="flex items-center space-x-4"
                >
                  <img
                    src={friend.friend.avatar}
                    alt={friend.friend.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">
                      {friend.friend.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {friend.friend.mobile}
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => handleAcceptFriend(friend.friend.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectFriend(friend.friend.id)}
                      >
                        Reject
                      </Button>
                    </div>
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
