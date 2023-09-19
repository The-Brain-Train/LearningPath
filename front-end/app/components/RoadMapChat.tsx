import "../css/roadMapChat.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

type Message = {
  role: string;
  content: string;
};

type roadMapChatProps = {
  showChat: boolean;
  toggleChat: () => void;
  setTopic: React.Dispatch<React.SetStateAction<string | null>>;
};

function RoadMapChat({ showChat, toggleChat, setTopic }: roadMapChatProps) {
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! What would you like to learn about today?",
    },
  ]);

  const handleSendMessage = async () => {
    setTopic(userMessage);
    const chatHistory = [...messages, { role: "user", content: userMessage }];

    setMessages(chatHistory);
    setUserMessage("");
    toggleChat();
  };

  return (
    <div className={`chat ${showChat && "chat_show"}`}>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-[90vh]">
        <div className="flex sm:items-center justify-around py-3 border-b-2 border-gray-200">
          <div className="relative flex items-center space-x-4">
            <div className="flex flex-col leading-tight">
              <div className="text-xl mt-1 flex items-center">
                <span className="text-gray-700 mr-3">Path Generating AI</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleChat}
              type="button"
              className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
            >
              <KeyboardArrowDownIcon />
            </button>
          </div>
        </div>
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages.map((message) => {
            if (message.role == "user") {
              return (
                <div className="chat-message">
                  <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                          {message.content}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="chat-message">
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {message.content}
                        </span>
                      </div>
                    </div>
                    <img
                      src="/learningpath-logo-cropped.png"
                      alt="LearningPath logo"
                      className="w-6 h-6 rounded-full order-1"
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Write your message!"
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <div className="bg-white">
              <SendIcon
                onClick={handleSendMessage}
                sx={{ fontSize: 35, marginTop: "4px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadMapChat;
