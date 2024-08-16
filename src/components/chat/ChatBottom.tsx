import { Button } from "../ui/button";

interface ChatBottomProps {
  content: string;
  setContent: (content: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const ChatBottom = ({
  content,
  setContent,
  handleKeyPress,
  handleSendMessage,
}: ChatBottomProps) => {
  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyUp={handleKeyPress}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Type a message..."
      />
      <Button onClick={() => handleSendMessage()}>Send</Button>
    </div>
  );
};

export default ChatBottom;
