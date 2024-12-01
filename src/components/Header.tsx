import React from 'react';
import { Bot, Menu, Languages, Plus, LogOut, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../stores/language';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';
import { MoreOptions } from './MoreOptions';
import { useThemeStore } from '../stores/theme';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  const { createChat } = useChatStore();
  const { logout } = useAuthStore();
  const { showTherapists, setShowTherapists } = useChatStore();
  const { isDark } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-dark-800/80 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center justify-between tech-glow sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors text-gray-400 hover:bg-white/10 active:bg-white/5"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl tech-gradient flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-display font-semibold text-white hidden sm:block">
            AI Psychology Assistant
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={createChat}
          className="sm:hidden p-2 rounded-xl transition-colors text-gray-400 hover:bg-white/10 active:bg-white/5"
          aria-label={t('common.newChat')}
        >
          <Plus className="w-5 h-5" />
        </button>
        {/* <MoreOptions /> */}
        <div className="flex items-center gap-2">
          {/* 心理医生列表切换按钮 */}
          <button
            onClick={() => setShowTherapists(!showTherapists)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${showTherapists
              ? isDark
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-blue-50 text-blue-600'
              : isDark
                ? 'hover:bg-white/5 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
              }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Therapists</span>
          </button>
        </div>
        {/* <MoreOptions /> */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="p-2 rounded-xl transition-colors relative group text-gray-400 hover:bg-white/10 active:bg-white/5"
          aria-label={language === 'en' ? '切换到中文' : 'Switch to English'}
        >
          <Languages className="w-5 h-5" />
          <span className="absolute top-full right-0 mt-2 px-3 py-1.5 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none bg-dark-700 text-white">
            {language === 'en' ? '切换到中文' : 'Switch to English'}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl transition-colors text-gray-400 hover:bg-white/10 active:bg-white/5"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}