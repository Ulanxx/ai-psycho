export interface UploadFile {
  fileUrl: string;
  fileType: FileType;
}

export enum FileType {
  image = '1',
  video = '2',
  audio = '3'
}

export interface MessageFile {
  url: string;
  type: FileType;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  requestId: string;
  files: MessageFile[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

export interface MoreOption {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

export interface ChatMessage {
  content: string;
  files?: UploadFile[];
  role: 'user' | 'assistant';
  timestamp: string;
}