import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FileUpload, UploadedFile } from './FileUpload';
import { useThemeStore } from '../stores/theme';
import { uploadFile, type ChatMessage } from '../api';
// 定义触发词列表
const THERAPIST_TRIGGERS = [
  // 通用心理相关触发词
  '治疗师', '咨询师', '心理学家', '精神科医生', '心理健康专家', '儿童心理学家', '行为治疗师',
  'therapist', 'counselor', 'psychologist', 'psychiatrist', 'mental health specialist', 'child psychologist', 'behavioral therapist',

  // 症状和关注点相关触发词
  '焦虑', '抑郁', '情绪波动', '行为问题', '注意力问题', '多动', '情感支持', '压力管理',
  'anxiety', 'depression', 'mood swings', 'behavior issues', 'attention problems', 'hyperactivity', 'emotional support', 'stress management',

  // 需求或诊断相关触发词
  '诊断', '心理健康支持', '治疗方案', '儿科治疗', '认知行为疗法', '情绪帮助', '咨询服务',
  'diagnosis', 'mental health support', 'treatment options', 'pediatric therapy', 'cognitive behavioral therapy', 'help with emotions', 'counseling services',

  // 行动触发短语
  '找医生', '预约', '需要专业帮助', '寻找治疗师', '推荐专家', '给我的孩子提供支持',
  'find a doctor', 'schedule an appointment', 'need professional help', 'looking for a therapist', 'recommend a specialist', 'support for my child'
];

interface ChatInputProps {
  onSendMessage: (message: ChatMessage) => void;
  onBeforeUpload: () => void;
  onUploadComplete: () => void;
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

export function ChatInput({ onSendMessage, onBeforeUpload, onUploadComplete, disabled }: ChatInputProps) {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const [input, setInput] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (showUpload) {
      onBeforeUpload();
    }
  }, [showUpload]);

  // 当上传完成时自动聚焦输入框
  useEffect(() => {
    if (!isUploading) {
      inputRef.current?.focus();
    }
  }, [isUploading]);

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
      setIsUploading(true);
      const uploadPromises = files.map(file => uploadFile(file.file));
      const results = await Promise.all(uploadPromises);

      const fileUrls = results.map(result => ({
        fileUrl: result.fileUrl,
        fileType: result.fileType
      }));

      setUploadedFiles(prev => [...prev, ...fileUrls]);
      onUploadComplete();
    } catch (error) {
      console.error('文件上传失败:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`border-t ${isDark ? 'border-white/10 bg-dark-800/50' : 'border-gray-200 bg-white'} backdrop-blur-lg`}>
      {showUpload && (
        <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <FileUpload onUpload={handleUpload} accept="image/*,audio/*,video/*" multiple={false} />
          {isUploading && (
            <div className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                {t('chat.uploading')}
              </div>
            </div>
          )}
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
            disabled={isUploading}
            aria-label={t('common.upload')}
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isUploading ? t('chat.waitingUpload') : t('common.inputPlaceholder')}
            disabled={disabled || isUploading}
            className={`flex-grow p-2.5 text-base rounded-xl min-h-[44px] max-h-[200px] resize-none transition-colors ${isDark
              ? 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25'
              : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              } border disabled:opacity-50 disabled:cursor-not-allowed`}
            rows={1}
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim() || isUploading}
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