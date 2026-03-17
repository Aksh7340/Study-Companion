import ChatMessage from "./ChatMessage";

export default function ChatList({ chats = [] }) {

  if (chats.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center">
        No chats yet
      </p>
    );
  }

  return (

    <div className="space-y-4">

      {chats.map((chat, index) => (

        <ChatMessage
          key={chat._id || index}
          chat={chat}
        />

      ))}

    </div>

  );

}