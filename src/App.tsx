import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TherapistList } from './components/TherapistList';
import { TherapistProfilePage } from './pages/TherapistProfile';
import { LoginPage } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useChatStore } from './stores/chat';
import type { Message } from './types';
import { streamChatMessage, type ChatMessage } from './api';

const TherapistModal = () => {
  const { showTherapists } = useChatStore();

  const modalContent = React.useMemo(() => {
    if (!showTherapists) return null;

    return (
      <div
        className={`
                border-b transition-all duration-300 
                border-white/10 bg-dark-800/50
                backdrop-blur-sm
                sticky top-0 z-20
              `}
      >
        <div className="max-w-3xl mx-auto w-full">
          <TherapistList />
        </div>
      </div>
    );
  }, [showTherapists]);

  return <>{modalContent}</>;
};

function Chat() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    createChat,
    getCurrentChat,
    addMessage,
    lastMessageId,
    showTherapists,  // 从 store 中获取状态
    setShowTherapists  // 从 store 中获取方法
  } = useChatStore();

  useEffect(() => {
    const currentChat = getCurrentChat();
    if (!currentChat) {
      createChat();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [showTherapists]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [getCurrentChat()?.messages]);

  const handleSendMessage = async (message: ChatMessage) => {
    const currentChat = getCurrentChat();
    if (!currentChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.content,
      timestamp: new Date().toISOString(),
      files: message.files?.map(file => ({
        url: file.fileUrl,
        type: file.fileType
      })) || [],
    };

    addMessage(currentChat.id, userMessage);

    const requestId = lastMessageId || Date.now().toString();
    try {
      await streamChatMessage(message, requestId, (text: string) => {
        const updatedMessage: Message = {
          id: requestId,
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
          files: [],
        };

        addMessage(currentChat.id, updatedMessage, true);
        setTimeout(scrollToBottom, 0);
      });

      if (message.shouldShowTherapists) {
        setShowTherapists(true);  // 使用 store 的方法
        setTimeout(scrollToBottom, 0);
      }

    } catch (error) {
      console.error('处理消息失败:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: t('common.error'),
        timestamp: new Date().toISOString(),
        files: [],
      };
      addMessage(currentChat.id, errorMessage);
    }
  };

  const currentChat = getCurrentChat();

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <TherapistModal />

        <div className="flex-grow overflow-y-auto message-grid">
          <div className="max-w-3xl mx-auto">
            {currentChat?.messages.map((message) => (
              <MessageBubble key={message.id + message.role} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <ChatInput onSendMessage={handleSendMessage} onBeforeUpload={scrollToBottom} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/:id"
        element={
          <ProtectedRoute>
            <TherapistProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}