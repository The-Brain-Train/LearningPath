import React from 'react'
import '../roadMapChat.css'

type roadMapChatProps= {
  showChat: boolean;
}
function RoadMapChat({showChat}: roadMapChatProps) {
  return (
    <div className={`chat ${showChat && "chat_show"}`}>RoadMapChat</div>
  )
}

export default RoadMapChat