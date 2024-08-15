import { Message, Room } from "@/types/api";
import RCRoomProfile from "./RCRoomProfile";

const RCMessageBox = ({ message }: { message: Message }) => {
  const isMe = message.sender.id === 1;

  return (
    <div className="flex items-start space-x-2 space-y-2">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-white border-2 border-white rounded-full ${
              isMe ? "bottom-1 right-1" : "bottom-0 right-0"
            }`}
          />
        </div>
      </div>
      <div
        className={`p-2 bg-gray-100 rounded-lg ${
          isMe ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

const RCChat = ({ room }: { room: Room | null }) => {
  return (
    <>
      {room ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <RCRoomProfile room={room} />
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-2 overflow-y-scroll">
            {room.messages.map((message) => (
              <RCMessageBox key={message.id} message={message} />
            ))}
          </div>
          <div className="flex items-center p-2 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 p-2 bg-gray-100 border border-transparent rounded-full focus:outline-none"
            />
            <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          Select a room to start chatting
        </div>
      )}
    </>
  );
};

export default RCChat;
