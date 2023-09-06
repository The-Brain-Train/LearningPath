import React from 'react'
import ChatIcon from '@mui/icons-material/Chat';

function ChatButton() {
  return (
    <>
    <button className='width-1 bg-teal-600 rounded-3xl p-3 fixed z-15 bottom-3 right-3'>
        <ChatIcon sx={{ fontSize: 35 }}/>
    </button>
    </>
  )
}

export default ChatButton