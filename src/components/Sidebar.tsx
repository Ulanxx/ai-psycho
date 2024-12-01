import React from 'react';
import { MessageSquare, Trash2, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatStore } from '../stores/chat';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { t } = useTranslation();
  const { chats, currentChatId, createChat, deleteChat, setCurrentChat } = useChatStore();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div
        className={`fixed lg:static w-64 h-full bg-dark-800 z-30 transition-transform duration-300 transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} tech-glow`}
      >
        <div className="h-full flex flex-col">
          {/* 新建会话按钮 */}
          <div className="p-4 border-b border-white/10">
            <button
              onClick={createChat}
              className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2 text-gray-200"
            >
              <Plus className="w-5 h-5" />
              <span>{t('common.newChat')}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors mb-1
                  ${currentChatId === chat.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                  }`}
                onClick={() => setCurrentChat(chat.id)}
              >
                <MessageSquare className="w-5 h-5 text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">
                    {chat.messages.length > 0
                      ? chat.title || t('common.newChat')
                      : t('common.newChat')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}