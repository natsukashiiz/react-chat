/* eslint-disable react-hooks/exhaustive-deps */

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import InboxLayout from "@/components/inbox/InboxLayout";
import ChatLayout from "@/components/chat/ChatLayout";

const Chat = () => {
  return (
    <div className="h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full border"
      >
        <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
          <InboxLayout />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          <ChatLayout />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Chat;
