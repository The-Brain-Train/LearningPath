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
  const [error, setError] = useState<string | null>(null);

  const containsOnlyNonAlphabet = (input: string) => {
    return /^[^a-zA-Z]*$/.test(input);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || containsOnlyNonAlphabet(userMessage)) {
      setError("Please enter a valid topic");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setTopic(userMessage);
    const chatHistory = [...messages, { role: "user", content: userMessage }];
    setMessages(chatHistory);
    setUserMessage("");
    toggleChat();
  };

  return (
    <>
      <div className="pt-4 mb-2  flex justify-center items-center ">
        <div className="relative flex max-w-2xl" style={{ minWidth: "325px" }}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter Topic!"
            className="rounded-l-md	 w-full focus:outline-none focus:placeholder-gray-400 text-center text-gray-600 placeholder-gray-60 py-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <div className="rounded-r-md bg-white">
            <SendIcon
              onClick={handleSendMessage}
              sx={{ fontSize: 35, marginTop: "4px" }}
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 font-bold">{error}</p>}
    </>
  );
}
