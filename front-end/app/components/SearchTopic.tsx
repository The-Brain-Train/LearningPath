import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";

type Message = {
  role: string;
  content: string;
};

type roadMapChatProps = {
  toggleChat: () => void;
  setTopic: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function SearchTopic({
  toggleChat,
  setTopic,
}: roadMapChatProps) {
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = async () => {
    setTopic(userMessage);
    const chatHistory = [...messages, { role: "user", content: userMessage }];
    setMessages(chatHistory);
    setUserMessage("");
    toggleChat();
  };

  return (
    <div className="pt-4 mb-2  flex justify-center items-center ">
      <div className="relative flex max-w-2xl" style={{ minWidth: "325px" }}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Enter Topic!"
          className="rounded-l-md	 w-full focus:outline-none focus:placeholder-gray-400 text-center text-gray-600 placeholder-gray-600 bg-gray-200  py-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <div className="rounded-r-md bg-gray-200">
          <SendIcon
            onClick={handleSendMessage}
            sx={{ fontSize: 35, marginTop: "4px" }}
          />
        </div>
      </div>
    </div>
  );
}
