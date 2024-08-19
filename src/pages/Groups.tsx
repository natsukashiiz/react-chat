import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createGroup } from "@/api/group";
import { toast } from "sonner";
import { uploadFile } from "@/api/file";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { getFriends } from "@/api/friend";
import { Friend } from "@/types/api";
import { FriendStatus } from "@/types/enum";
import UserAvatar from "@/components/UserAvatar";
import { useNavigate } from "react-router";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is 1-20 characters")
    .max(20, "Group name is 1-20 characters"),
  image: z.string().optional(),
  memberIds: z.array(z.number()).min(0),
});

const Groups = () => {
  const navigate = useNavigate();

  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupMembers, setGroupMembers] = useState<number[]>([]);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      memberIds: [],
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      memberIds: [],
    });
    setGroupImage(null);
    setGroupMembers([]);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const res = await createGroup(values);
      if (res.status === 200 && res.data) {
        toast.success("Group created successfully");
        resetForm();
        navigate("/chat");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await uploadFile(formData);
        if (res.status === 200 && res.data) {
          form.setValue("image", res.data.data.url);
          setGroupImage(res.data.data.url);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res = await getFriends(FriendStatus.Friend);
        if (res.status === 200 && res.data) {
          setFriendList(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadFriends();
  }, []);

  const handleSelectFriend = (id: number) => {
    if (groupMembers.includes(id)) {
      setGroupMembers((prev) => prev.filter((i) => i !== id));
      form.setValue(
        "memberIds",
        groupMembers.filter((i) => i !== id)
      );
    } else {
      setGroupMembers((prev) => [...prev, id]);
      form.setValue("memberIds", [...groupMembers, id]);
    }
  };

  return (
    <div className="max-h-dvh max-w-lg mx-auto pt-20 flex flex-col space-y-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Group</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2 justify-items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadFile}
                    className="hidden"
                  />
                  <Avatar
                    className="w-24 h-24 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {groupImage ? (
                      <AvatarImage src={groupImage} alt="Group image" />
                    ) : (
                      <AvatarImage
                        src="https://via.placeholder.com/150"
                        alt="Group image"
                      />
                    )}
                  </Avatar>
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {friendList.length > 0 ? (
                      friendList
                        .sort((a, b) => b.friend.id - a.friend.id)
                        .map((friend) => (
                          <div
                            key={friend.friend.id}
                            className={`w-full flex items-center justify-between space-x-4 p-2 rounded-xl cursor-pointer hover:bg-accent ${
                              groupMembers.includes(friend.friend.id) &&
                              "bg-blue-100"
                            }`}
                            onClick={() => handleSelectFriend(friend.friend.id)}
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
                          </div>
                        ))
                    ) : (
                      <div className="text-center">Empty friends</div>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button type="submit">Create</Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Groups;
