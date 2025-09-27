import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Section, Category, ImageGroup, ImageItem } from './types';
import { ImageCard } from './components/ImageCard';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ImageModal } from './components/ImageModal';
import { SaveIcon, UploadIcon } from './components/icons';

const createNewImageItem = (): ImageItem => ({
  id: crypto.randomUUID(),
  imageUrl: null,
  code: '',
});

const createNewImageGroup = (): ImageGroup => ({
  id: crypto.randomUUID(),
  description: '',
  items: [
    createNewImageItem(),
    createNewImageItem(),
    createNewImageItem(),
    createNewImageItem(),
  ],
});

const createNewCategory = (name: string): Category => ({
    id: crypto.randomUUID(),
    name,
    groups: [createNewImageGroup()],
});

const INITIAL_CATEGORIES = ['애니', '실사', 'SF', '판타지', 'ETC'];

const INITIAL_STATE: Section[] = [
  { id: 'sref', title: 'Sref 코드', categories: INITIAL_CATEGORIES.map(createNewCategory) },
  { id: 'p', title: 'P 코드', categories: INITIAL_CATEGORIES.map(createNewCategory) },
  { id: 'sref-p', title: 'Sref + P 코드', categories: INITIAL_CATEGORIES.map(createNewCategory) },
];

const App: React.FC = () => {
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const savedData = localStorage.getItem('junnySrefData');
      return savedData ? JSON.parse(savedData) : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  const [activeSectionId, setActiveSectionId] = useState<string>(
    () => localStorage.getItem('junnySrefActiveSectionId') || INITIAL_STATE[0].id
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    () => localStorage.getItem('junnySrefActiveCategoryId') || INITIAL_STATE[0].categories[0].id
  );
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('junnySrefData', JSON.stringify(sections));
      localStorage.setItem('junnySrefActiveSectionId', activeSectionId);
      localStorage.setItem('junnySrefActiveCategoryId', activeCategoryId);
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [sections, activeSectionId, activeCategoryId]);

  // Validate active IDs on data change
  useEffect(() => {
    const currentSection = sections.find(s => s.id === activeSectionId);
    if (!currentSection) {
      const firstSectionId = sections[0]?.id;
      if (firstSectionId) {
        setActiveSectionId(firstSectionId);
        setActiveCategoryId(sections[0].categories[0]?.id || '');
      }
    } else {
      const currentCategory = currentSection.categories.find(c => c.id === activeCategoryId);
      if (!currentCategory) {
        setActiveCategoryId(currentSection.categories[0]?.id || '');
      }
    }
  }, [sections, activeSectionId]);

  const activeSection = sections.find(s => s.id === activeSectionId);
  const activeCategory = activeSection?.categories.find(c => c.id === activeCategoryId);

  const handleSectionChange = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const newSection = sections.find(s => s.id === sectionId);
    if (newSection && newSection.categories.length > 0) {
      setActiveCategoryId(newSection.categories[0].id);
    } else {
      setActiveCategoryId('');
    }
  };

  const handleAddCategory = (name: string) => {
    if (!activeSection) return;
    const newCategory = createNewCategory(name);
    const updatedSections = sections.map(section => {
      if (section.id === activeSectionId) {
        return { ...section, categories: [...section.categories, newCategory] };
      }
      return section;
    });
    setSections(updatedSections);
    setActiveCategoryId(newCategory.id);
    setIsModalOpen(false);
  };
  
  const handleAddImageGroup = useCallback(() => {
    setSections(prevSections => prevSections.map(section => {
        if (section.id === activeSectionId) {
            return {
                ...section,
                categories: section.categories.map(category => {
                    if (category.id === activeCategoryId) {
                        return { ...category, groups: [...category.groups, createNewImageGroup()] };
                    }
                    return category;
                })
            };
        }
        return section;
    }));
  }, [activeSectionId, activeCategoryId]);

  const handleUpdate = useCallback((groupId: string, itemId: string, field: 'description' | 'imageUrl' | 'code', value: string | null) => {
    setSections(prevSections => prevSections.map(section => {
        if (section.id !== activeSectionId) return section;
        return {
            ...section,
            categories: section.categories.map(category => {
                if (category.id !== activeCategoryId) return category;
                return {
                    ...category,
                    groups: category.groups.map(group => {
                        if (group.id !== groupId) return group;
                        if (field === 'description') {
                            return { ...group, description: value as string };
                        }
                        return {
                            ...group,
                            items: group.items.map(item => {
                                if (item.id !== itemId) return item;
                                return { ...item, [field]: value };
                            }) as [ImageItem, ImageItem, ImageItem, ImageItem]
                        };
                    })
                };
            })
        };
    }));
  }, [activeSectionId, activeCategoryId]);

  const handleSaveToFile = () => {
    try {
        const dataStr = JSON.stringify(sections, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
        link.download = `junny-sref-data_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to save data to file", error);
        alert("데이터 저장에 실패했습니다.");
    }
  };

  const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File is not text");
            const loadedData = JSON.parse(text);

            if (Array.isArray(loadedData)) {
                setSections(loadedData);
                // Reset active IDs to default for the new data
                const firstSection = loadedData[0];
                if (firstSection) {
                    setActiveSectionId(firstSection.id);
                    setActiveCategoryId(firstSection.categories[0]?.id || '');
                }
                alert("데이터를 성공적으로 불러왔습니다.");
            } else {
                throw new Error("Invalid data structure in file");
            }
        } catch (error) {
            console.error("Failed to load data from file", error);
            alert("파일을 불러오는데 실패했습니다. 유효한 JSON 파일인지 확인해주세요.");
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };
    reader.readAsText(file);
  };

  const handleImageClick = (imageUrl: string) => {
    if (imageUrl) {
        setSelectedImageUrl(imageUrl);
    }
  };

  return (
    <div className="min-h-screen text-slate-300 p-4 sm:p-6 md:p-8">
      <header className="relative text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          JUNNY Sref 모음
        </h1>
        <div className="absolute top-0 right-0 flex items-center gap-2 sm:gap-3">
            <button
                onClick={handleSaveToFile}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors text-sm"
                title="데이터를 파일로 저장"
            >
                <SaveIcon className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">저장하기</span>
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-colors text-sm"
                title="파일에서 데이터 불러오기"
            >
                <UploadIcon className="w-5 h-5 sm:mr-2" />
                <span className="hidden sm:inline">불러오기</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleLoadFromFile}
                accept="application/json"
                className="hidden"
            />
        </div>
      </header>

      <nav className="flex justify-center mb-6 border-b border-slate-700">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={`px-4 py-3 text-lg font-medium transition-colors duration-200 ease-in-out focus:outline-none ${
              activeSectionId === section.id
                ? 'border-b-2 border-indigo-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>

      {activeSection && (
        <main>
          <div className="flex items-center flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
            {activeSection.categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 ${
                  activeCategoryId === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.name}
              </button>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-600 text-slate-200 hover:bg-slate-500 transition-colors duration-200"
            >
              + 카테고리 추가
            </button>
          </div>
          
          {activeCategory ? (
            <div className="space-y-10">
              {activeCategory.groups.map((group) => (
                <div key={group.id} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                  <textarea
                    value={group.description}
                    onChange={(e) => handleUpdate(group.id, '', 'description', e.target.value)}
                    placeholder="프롬프트를입력하세요!"
                    className="w-full bg-slate-900/70 border border-slate-700 rounded-lg p-4 mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
                    rows={3}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {group.items.map((item) => (
                      <ImageCard 
                        key={item.id} 
                        item={item} 
                        onUpdate={(field, value) => handleUpdate(group.id, item.id, field, value)}
                        onImageClick={handleImageClick}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="text-center mt-8">
                 <button
                    onClick={handleAddImageGroup}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                >
                    + 4개 카드 추가
                </button>
              </div>
            </div>
          ) : (
             <p className="text-center text-slate-400">카테고리를 선택하거나 추가해주세요.</p>
          )}
        </main>
      )}

      <AddCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCategory}
      />
      <ImageModal 
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
    </div>
  );
};

export default App;
