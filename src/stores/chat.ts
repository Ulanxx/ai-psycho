import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Chat, Message } from '../types';
import { t } from 'i18next';

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  showTherapists: boolean;
  createChat: () => Chat;
  deleteChat: (id: string) => void;
  setCurrentChat: (id: string) => void;
  addMessage: (chatId: string, message: Message, replace?: boolean) => void;
  getCurrentChat: () => Chat | null;
  getLastAssistantMessage: () => Message | null;
  setShowTherapists: (show: boolean) => void;
  selectedTherapistIds: string[];
  setSelectedTherapistIds: (ids: string[]) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [] as Chat[],
      currentChatId: null as string | null,
      showTherapists: false,
      selectedTherapistIds: [] as string[],

      createChat: () => {
        const id = uuidv4()
        const newChat: Chat = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [{
            id: id,
            role: 'assistant',
            content: t('welcome.message'),
            requestId: id,
            timestamp: new Date().toISOString(),
            files: [],
          }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set(state => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));

        return newChat;
      },

      deleteChat: (id: string) => {
        set(state => {
          const newChats = state.chats.filter(chat => chat.id !== id);
          const newCurrentChatId = state.currentChatId === id
            ? (newChats[0]?.id ?? null)
            : state.currentChatId;

          return {
            chats: newChats,
            currentChatId: newCurrentChatId,
          };
        });
      },

      setCurrentChat: (id: string) => {
        set({ currentChatId: id });
      },

      addMessage: (chatId: string, message: Message, replace: boolean = false) => {
        set(state => {
          const chat = state.chats.find(c => c.id === chatId);
          if (!chat) return state;

          if (replace) {
            const messageIndex = chat.messages.findIndex(m => m.id === message.id);
            if (messageIndex !== -1) {
              const existingMessage = chat.messages[messageIndex];
              if (existingMessage.content !== message.content) {
                chat.messages[messageIndex] = {
                  ...existingMessage,
                  content: message.content,
                };
              }
            } else {
              chat.messages.push(message);
            }
          } else {
            chat.messages.push(message);
          }

          if (message.role === 'user' && !replace) {
            chat.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
          }

          return {
            ...state,
            chats: [...state.chats]
          };
        });
      },

      getCurrentChat: () => {
        const { chats, currentChatId } = get();
        return chats.find(chat => chat.id === currentChatId) ?? null;
      },

      getLastAssistantMessage: () => {
        // 获取聊天列表中最后一个assistant消息
        const { chats } = get();
        return chats.flatMap(chat => chat.messages.filter(m => m.role === 'assistant')).pop() ?? null;
      },

      setShowTherapists: (show: boolean) => set({ showTherapists: show }),

      setSelectedTherapistIds: (ids: string[]) => 
        set({ selectedTherapistIds: ids }),
    }),
    {
      name: 'chat-storage',
      version: 1,
    }
  )
);