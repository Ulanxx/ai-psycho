import axios from 'axios';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { UploadFile, FileType } from '../types';
import { useChatStore } from '../stores/chat';

const BASE_URL = 'http://114.55.105.91:9010/gpt-ai';

// 创建axios实例
const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        token: '1234567890'
    }
});

// 文件上传接口
export const uploadFile = async (file: File): Promise<UploadFile> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await instance.post('/file/uploadFile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });


        const { fileUrl, fileType } = response.data.data;
        return {
            fileUrl,
            fileType
        };
    } catch (error) {
        console.error('文件上传失败:', error);
        throw error;
    }
};

// 发送聊天消息接口
export interface ChatMessage {
    content: string;
    files?: UploadFile[];
    shouldShowTherapists?: boolean;
}

let lastRequestId = '';
export const streamChatMessage = async (message: ChatMessage, requestId: string, onData: (text: string) => void) => {
    let accumulatedText = '';

    try {
        await fetchEventSource(`${BASE_URL}/chat/sendStream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': '1234567890'
            },
            body: JSON.stringify({
                fileList: message.files || [],
                msg: message.content,
                requestId: requestId.split('___')[0] || Date.now().toString()
            }),
            onmessage(event) {
                try {
                    const text = event.data;
                    if (!text) return;

                    // 改进的文本处理逻辑
                    const processedText = text
                    if (processedText) {
                        // Handle text concatenation
                        if (
                            // Add space between English words
                            (/[a-zA-Z]$/.test(accumulatedText) && /^[a-zA-Z]/.test(processedText)) ||
                            // Add space after English punctuation
                            /[.!?:;,]$/.test(accumulatedText) && /^[a-zA-Z]/.test(processedText)
                        ) {
                            accumulatedText = accumulatedText + ' ' + processedText;
                        } else {
                            accumulatedText = accumulatedText + processedText;
                        }
                        lastRequestId = event.id;
                        onData(accumulatedText);

                    }
                } catch (e) {
                    console.error('处理消息时出错:', e);
                }
            },
            onclose() {
                console.log('连接已关闭');
                if (accumulatedText) {
                    // 最终清理，确保标点符号后有空格
                    const finalText = accumulatedText
                        .replace(/([.!?:;,])([a-zA-Z])/g, '$1 $2')  // 确保标点符号后有空格
                        .replace(/\s+/g, ' ')  // 规范化多余空格
                        .trim();

                    useChatStore.getState().setLastMessageId(lastRequestId + '___' + Date.now().toString());
                    onData(finalText);
                }
            },
            onerror(err) {
                console.error('错误:', err);
                throw err;
            }
        });
    } catch (error) {
        console.error('发送消息失败:', error);
        throw error;
    }
};