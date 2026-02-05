import { useState } from "react";
import ConversationList from "../components/ConversationList";
import ChatArea from "../components/ChatArea";
import EmptyChat from "../components/EmptyChat";
import NewMessageModal from "../components/NewMessageModal";
import type { Conversation } from "@/types/message.type";

export default function MessagePage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };

  return (
    <div className="flex h-screen bg-black">
      <ConversationList
        selectedConversationId={selectedConversation?._id || null}
        onSelectConversation={handleSelectConversation}
        onNewMessage={handleNewMessage}
      />

      {selectedConversation ? (
        <ChatArea conversation={selectedConversation} />
      ) : (
        <EmptyChat onSendMessage={handleNewMessage} />
      )}

      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSelectConversation={(conversation) => {
          setSelectedConversation(conversation);
          setShowNewMessageModal(false);
        }}
      />
    </div>
  );
}
