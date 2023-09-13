import React, { SetStateAction } from "react";
import ChatIcon from "@mui/icons-material/Chat";

type chatButtonProps = {
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
};

function ChatButton({ showChat, setShowChat }: chatButtonProps) {
  const handleClick = () => {
    setShowChat(!showChat);
  };

  return (
    
    !showChat && (
      <div
        className={`fixed z-15 bottom-3 right-3 transition-all duration-700`}
      >
        <button
          onClick={handleClick}
          className={`width-1 bg-teal-600 rounded-3xl p-3 opacity-100`}
        >
          <ChatIcon sx={{ fontSize: 35 }} />
        </button>
      </div>
    )
    
  );
}

export default ChatButton;
