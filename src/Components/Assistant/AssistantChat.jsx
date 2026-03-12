import { useEffect } from "react";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";

import api from "../../Api/api";

export default function AssistantChat({
  chapter,
  subjectId,
  chapterId,
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

      /* 1️⃣ Generate AI answer */

      const aiRes = await api.post("/ai/assistant", {
        question,
        chapterName: chapter.name
      });

      const answer = aiRes.data.answer;


      /* 2️⃣ Save chat to database */

      const saveRes = await api.post(
        `/subjects/${subjectId}/chapters/${chapterId}/chats`,
        {
          question,
          answer
        }
      );

      const newChat = saveRes.data;


      /* 3️⃣ Update React state */

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

    <div className="section">

      <h3>AI Assistant</h3>

      <ChatList chats={chapter.assistantChats || []} />

      <ChatInput askAI={askAI} />

    </div>

  );

}