import React, { useState, useEffect } from 'react';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-8 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-6">새 카테고리 추가</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="categoryName" className="block text-sm font-medium text-slate-400 mb-2">
                        카테고리 이름
                    </label>
                    <input
                        id="categoryName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        placeholder="예: 캐릭터"
                    />
                    <div className="mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 font-semibold transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!name.trim()}
                        >
                            추가
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
