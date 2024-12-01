import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Download, Share2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/theme';
import type { MoreOption } from '../types';

interface MoreOptionsProps {
  options?: MoreOption[];
}

export function MoreOptions({ options = [] }: MoreOptionsProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultOptions: MoreOption[] = [
    {
      icon: Download,
      label: t('common.exportChat'),
      onClick: () => {
        // Implement export functionality
        setIsOpen(false);
      },
    },
    {
      icon: Share2,
      label: t('common.shareChat'),
      onClick: () => {
        // Implement share functionality
        setIsOpen(false);
      },
    },
    {
      icon: Trash2,
      label: t('common.clearChat'),
      onClick: () => {
        // Implement clear chat functionality
        setIsOpen(false);
      },
    },
  ];

  const allOptions = [...defaultOptions, ...options];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-colors ${
          isDark
            ? 'text-gray-400 hover:bg-white/10 active:bg-white/5'
            : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
        }`}
        aria-label={t('common.more')}
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50 ${
          isDark ? 'bg-dark-700 border border-white/10' : 'bg-white border border-gray-200'
        }`}>
          {allOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.onClick}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm ${
                isDark
                  ? 'text-gray-200 hover:bg-white/5'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <option.icon className="w-4 h-4" />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}