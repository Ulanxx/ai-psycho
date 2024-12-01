import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Music, Video, File, FileIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from '../types';

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: FileType;
  progress: number;
}

export function FileUpload({ onUpload, accept = "image/*,audio/*,video/*", multiple = true }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList) => {
    const uploadedFiles: UploadedFile[] = Array.from(newFiles).map(file => ({
      id: uuidv4(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      type: file.type.startsWith('image/') ? FileType.image :
        file.type.startsWith('audio/') ? FileType.audio :
          file.type.startsWith('video/') ? FileType.video : FileType.image,
      progress: 0
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
    simulateUpload(uploadedFiles);
  };

  const simulateUpload = (uploadedFiles: UploadedFile[]) => {
    uploadedFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, progress } : f
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          onUpload(uploadedFiles);
        }
      }, 200);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center text-gray-400">
          <Upload className="w-10 h-10 mb-2" />
          <p className="text-sm">Drag & drop files here or click to select</p>
          <p className="text-xs mt-1">Supports images, audio, and video files</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map(file => {
            console.log(file);
            return (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg">
                {file.type === FileType.image && file.preview ? (
                  <img src={file.preview} alt="" className="w-10 h-10 object-cover rounded" />
                ) : (
                  <FileIcon type={file.type} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-200">{file.file.name}</p>
                  <div className="w-full h-1.5 bg-dark-900 rounded-full mt-1">
                    <div
                      className="h-full tech-gradient rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                  className="p-1 hover:bg-white/10 rounded-full text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}