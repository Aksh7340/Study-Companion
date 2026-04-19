import { useEffect } from "react";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";

import api from "../../Api/api";

export default function AssistantChat({
  chapter,
  subjectId,
  chapterId,
  subjectName,
  updateChapter
}) {


  /* =========================
     Load Chat History
  ========================= */

  useEffect(() => {

    async function loadChats() {

      try {

        const res = await api.get(
          `/subjects/${subjectId}/chapters/${chapterId}/chats`
        );

        const updatedChapter = {
          ...chapter,
          assistantChats: res.data
        };

        updateChapter(subjectId, chapterId, updatedChapter);

      } catch (error) {

        console.error("Failed to load chats", error);

      }

    }

    if (chapterId) loadChats();

  }, [chapterId]);


  /* =========================
     Ask AI
  ========================= */

  async function askAI(question) {

    try {

      const aiRes = await api.post("/ai/assistant", {
        question,
        chapterName: chapter.name,
        subjectName
      });

      const answer = aiRes.data.answer;

      const saveRes = await api.post(
        `/subjects/${subjectId}/chapters/${chapterId}/chats`,
        {
          question,
          answer
        }
      );

      const newChat = saveRes.data;

      const updatedChapter = {
        ...chapter,
        assistantChats: [
          ...(chapter.assistantChats || []),
          newChat
        ]
      };

      updateChapter(subjectId, chapterId, updatedChapter);

    } catch (error) {

      console.error("AI request failed", error);

    }

  }


  return (

    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col h-[500px]">

      {/* Header */}

      <h3 className="text-lg font-semibold mb-4">
        AI Assistant
      </h3>


      {/* Chat Messages */}

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">

        <ChatList chats={chapter.assistantChats || []} />

      </div>


      {/* Input */}

      <div className="border-t pt-3">

        <ChatInput askAI={askAI} />

      </div>

    </div>

  );

}