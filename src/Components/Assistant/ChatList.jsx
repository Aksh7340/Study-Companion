import ChatMessage from "./ChatMessage";

export default function ChatList({ chats = [] }) {

  if (chats.length === 0) {
    return <p>No chats yet</p>;
  }

  return (

    <div>

      {chats.map((chat, index) => (

        <ChatMessage
          key={chat._id || index}
          chat={chat}
        />

      ))}

    </div>

  );

}