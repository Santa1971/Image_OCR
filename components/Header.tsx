import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
  onClear: () => void;
  onExport: () => void;
  onStartProcess: () => void;
  onImportJSON?: () => void; 
  onDownloadWord?: () => void; // New Prop for Word Export
  isProcessing: boolean;
  hasItems: boolean;
  hasFinishedItems: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  currentView: 'workspace' | 'settings';
}

export const Header: React.FC<HeaderProps> = ({ 
  onSettingsClick, 
  onClear, 
  onExport, 
  onStartProcess, 
  onImportJSON,
  onDownloadWord,
  isProcessing,
  hasItems,
  hasFinishedItems,
  filter,
  setFilter,
  currentView
}) => {
  const filters = [
    { id: 'all', label: '전체' },
    { id: 'processing', label: '분석중' },
    { id: 'done', label: '완료' },
    { id: 'error', label: '오류' }
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-surface px-6 py-3 shrink-0 z-30 shadow-sm relative">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => currentView === 'settings' && onSettingsClick()}>
        <div className="size-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/30">
          <span className="material-symbols-outlined text-[20px]">document_scanner</span>
        </div>
        <h2 className="text-text-main text-lg font-bold leading-tight tracking-tight">AI OCR 프로</h2>
      </div>
      
      {/* Middle Navigation - Only visible in Workspace */}
      <div className="hidden md:flex flex-1 justify-center gap-8">
        {currentView === 'workspace' && (
            <div className="flex items-center gap-1 bg-surface-subtle rounded-full px-1.5 py-1 border border-border shadow-inner animate-fade-in">
            {filters.map((f) => (
                <button 
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === f.id 
                    ? 'bg-white shadow-sm text-primary-text font-semibold' 
                    : 'hover:bg-white/50 text-text-secondary hover:text-text-main'
                }`}
                >
                {f.label}
                </button>
            ))}
            </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-4">
        {currentView === 'workspace' ? (
            <div className="flex gap-2 animate-fade-in">
            <button 
                onClick={onSettingsClick}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white hover:bg-surface-hover border border-border text-text-secondary hover:text-text-main transition-all shadow-sm"
                title="설정"
            >
                <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            
            {/* JSON Viewer Button */}
            <button 
                onClick={onImportJSON}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white hover:bg-surface-hover border border-border text-text-secondary hover:text-primary transition-all shadow-sm"
                title="문서 뷰어 (JSON/결과 보기)"
            >
                <span className="material-symbols-outlined text-[20px]">description</span>
                <span className="ml-1 text-sm font-bold hidden xl:block">문서 뷰어</span>
            </button>
            
            <button 
                onClick={onClear}
                disabled={!hasItems || isProcessing}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white hover:bg-surface-hover border border-border text-text-secondary hover:text-text-main text-sm font-bold leading-normal transition-all shadow-sm disabled:opacity-50"
            >
                <span>초기화</span>
            </button>
            
            {/* Word Export Button */}
            <button 
                onClick={onDownloadWord}
                disabled={!hasFinishedItems} 
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white hover:bg-surface-hover border border-border text-text-main hover:text-primary text-sm font-bold leading-normal transition-all shadow-sm disabled:opacity-50"
                title="선택된 항목 Word 저장"
            >
                <span className="mr-2">Word 저장</span>
                <span className="material-symbols-outlined text-sm font-bold">file_download</span>
            </button>

            <button 
                onClick={onExport}
                disabled={!hasFinishedItems}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white hover:bg-surface-hover border border-border text-text-main hover:text-primary text-sm font-bold leading-normal transition-all shadow-sm disabled:opacity-50"
            >
                <span className="mr-2">CSV 저장</span>
                <span className="material-symbols-outlined text-sm font-bold">download</span>
            </button>
            
            <button 
                onClick={onStartProcess}
                disabled={!hasItems || isProcessing}
                className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold leading-normal transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
            >
                {isProcessing ? (
                <>
                    <span className="mr-2">분석 진행 중</span>
                    <span className="material-symbols-outlined text-sm font-bold animate-spin">progress_activity</span>
                </>
                ) : (
                <>
                    <span className="mr-2">분석 시작</span>
                    <span className="material-symbols-outlined text-sm font-bold">play_arrow</span>
                </>
                )}
            </button>
            </div>
        ) : (
            <div className="flex gap-2 animate-fade-in">
                 <button 
                    onClick={onSettingsClick}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white hover:bg-surface-hover border border-border text-text-main font-bold text-sm transition-all shadow-sm group"
                >
                    <span className="material-symbols-outlined text-[18px] mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span>워크스페이스로 돌아가기</span>
                </button>
            </div>
        )}

        <div 
          className="bg-center bg-no-repeat bg-cover rounded-full size-9 border-2 border-white shadow-sm ring-1 ring-border" 
          role="img"
          aria-label="사용자 프로필"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRhGDQFXsj_8vjf-APa15WPV4cVuJ_z4IGk4phcriI8-8tk3qyTbGZqnKQO-LlOZu9AjwkjDC6eBnebNDX0nUqPfdZ8RTGxhii-_9TFIXEe1OxU8sxRQ1YuOn2E6B3ee-zBwVlzGIidUghQEPsHLRwqj2Mo5eWimkdGMxE_kU98rVSa20ddSGxcncxoZ7P5Ax3FZlvNtZBRP9udSZeOv7L2xqruuyYcDOZ8zCFkT5GOm7L2HGlXnbj7ag-w2z6mk3vd0UtBOW1P34")' }}
        ></div>
      </div>
    </header>
  );
};