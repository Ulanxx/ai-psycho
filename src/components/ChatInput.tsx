import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FileUpload, UploadedFile } from './FileUpload';
import { useThemeStore } from '../stores/theme';
import { uploadFile, type ChatMessage } from '../api';

// 定义触发词列表
const THERAPIST_TRIGGERS = [
  // 通用心理相关触发词
  'therapist', 'therapy', 'counselor', 'psychologist', 'psychiatrist',
  'mental health', 'psychological', 'counseling',

  // 中文触发词
  '心理医生', '治疗师', '心理咨询', '心理健康', '心理治疗',
  '精神科医生', '心理辅导', '心理问题',

  // 症状和关注点相关触发词
  'anxiety', 'depression', 'stress', 'mental', 'emotional',
  '焦虑', '抑郁', '压力', '情绪', '心理压力',

  // 行动触发短语
  'find a doctor', 'need help', 'looking for help',
  '找医生', '需要帮助', '寻求帮助'
];

interface ChatInputProps {
  onSendMessage: (message: ChatMessage) => void;
  onBeforeUpload: () => void;
  disabled?: boolean;
}
enum FileType {
  image = '1',
  video = '2',
  audio = '3'
}

interface UploadFile {
  fileUrl: string;
  fileType: FileType
}

export function ChatInput({ onSendMessage, onBeforeUpload, disabled, }: ChatInputProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const [input, setInput] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (showUpload) {
      onBeforeUpload();
    }
  }, [showUpload]);

  const checkForTriggerWords = (text: string) => {
    const lowercaseText = text.toLowerCase();
    return THERAPIST_TRIGGERS.some(trigger =>
      lowercaseText.includes(trigger.toLowerCase())
    );
  };

  const handleSubmit = async () => {
    if (input.trim() && !disabled) {
      // 先存储检查结果，但不立即显示
      const shouldShowTherapists = checkForTriggerWords(input);

      const message: ChatMessage = {
        content: input.trim(),
        files: uploadedFiles,
        shouldShowTherapists, // 将检查结果传递给父组件
      };
      onSendMessage(message);
      setInput('');
      setUploadedFiles([]);
      setShowUpload(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  const handleUpload = async (files: UploadedFile[]) => {
    try {
      const uploadPromises = files.map(file => uploadFile(file.file));
      const results = await Promise.all(uploadPromises);

      // 假设上传接口返回文件URL
      const fileUrls = results.map(result => ({ fileUrl: result.fileUrl, fileType: result.fileType }));
      setUploadedFiles(prev => [...prev, ...fileUrls]);
    } catch (error) {
      console.error('文件上传失败:', error);
    }
  };

  return (
    <div className={`border-t ${isDark ? 'border-white/10 bg-dark-800/50' : 'border-gray-200 bg-white'} backdrop-blur-lg`}>
      {showUpload && (
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <FileUpload onUpload={handleUpload} />
        </div>
      )}
      <div className="p-3 sm:p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className={`p-2.5 rounded-xl transition-colors ${isDark
              ? 'text-gray-400 hover:bg-white/10 active:bg-white/5'
              : 'text-gray-500 hover:bg-gray-100 active:bg-gray-200'
              }`}
            aria-label={t('common.upload')}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('common.inputPlaceholder')}
            disabled={disabled}
            className={`flex-grow p-2.5 text-base rounded-xl min-h-[44px] max-h-[200px] resize-none transition-colors ${isDark
              ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25'
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              } border`}
            rows={1}
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className="p-2.5 rounded-xl tech-gradient text-white hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg disabled:shadow-none"
            aria-label={t('common.send')}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}