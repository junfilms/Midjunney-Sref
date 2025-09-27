import React, { useState, useCallback, DragEvent, ClipboardEvent } from 'react';
import { ImageItem } from '../types';
import { ImageIcon } from './icons';

interface ImageCardProps {
    item: ImageItem;
    onUpdate: (field: 'imageUrl' | 'code', value: string | null) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ item, onUpdate }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onUpdate('imageUrl', e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onUpdate]);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handlePaste = useCallback((e: ClipboardEvent<HTMLDivElement>) => {
        if (e.clipboardData.files && e.clipboardData.files.length > 0) {
            handleFile(e.clipboardData.files[0]);
        }
    }, [handleFile]);

    return (
        <div className="flex flex-col gap-2">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onPaste={handlePaste}
                tabIndex={0}
                className={`relative aspect-video bg-slate-900/50 rounded-lg border-2 border-dashed transition-all duration-300 ease-in-out overflow-hidden group focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDragging ? 'border-indigo-500 scale-105' : 'border-slate-700'
                }`}
            >
                {item.imageUrl ? (
                    <>
                        <img src={item.imageUrl} alt="Uploaded content" className="w-full h-full object-cover" />
                         <button 
                            onClick={() => onUpdate('imageUrl', null)}
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col justify-center items-center h-full text-slate-500">
                        <ImageIcon className="w-12 h-12 mb-2" />
                        <p className="text-sm font-semibold">이미지를 여기에 드래그하거나 붙여넣기 하세요</p>
                    </div>
                )}
            </div>
            <input
                type="text"
                value={item.code}
                onChange={(e) => onUpdate('code', e.target.value)}
                placeholder="코드를 입력하세요..."
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
        </div>
    );
};
