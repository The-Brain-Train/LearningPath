import React, { SetStateAction } from 'react'
import ChatIcon from '@mui/icons-material/Chat';

type chatButtonProps = {
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
}


function ChatButton({showChat, setShowChat}: chatButtonProps) {

  const handleClick = () => {
    setShowChat(!showChat);
  }

  return (
    <>
    <button onClick={handleClick} className='width-1 bg-teal-600 rounded-3xl p-3 fixed z-15 bottom-3 right-3'>
        <ChatIcon sx={{ fontSize: 35 }}/>
    </button>
    </>
  )
}

export default ChatButton