import React from 'react';

interface HeaderProps {
  onSettingsClick: () => void;
  onClear: () => void;
  onExport: () => void;
  onStartProcess: () => void;
  onImportJSON?: () => void; 
  onDownloadWord?: () => void; 
  isProcessing: boolean;
  hasItems: boolean;
  hasFinishedItems: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  currentView: 'workspace' | 'settings';
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
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
  currentView,
  onToggleLeftSidebar,
  onToggleRightSidebar
}) => {
  const filters = [
    { id: 'all', label: '전체' },
    { id: 'processing', label: '분석중' },
    { id: 'done', label: '완료' },
    { id: 'error', label: '오류' }
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border bg-surface px-4 py-2 md:px-6 md:py-3 shrink-0 z-30 shadow-sm relative h-14 md:h-16">
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Left Menu Toggle */}
        {currentView === 'workspace' && (
            <button 
                onClick={onToggleLeftSidebar}
                className="md:hidden p-1.5 -ml-2 rounded-lg text-text-secondary hover:bg-surface-hover"
            >
                <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
        )}

        <div className="flex items-center gap-2 md:gap-4 cursor-pointer" onClick={() => currentView === 'settings' && onSettingsClick()}>
            <div className="size-7 md:size-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/30">
            <span className="material-symbols-outlined text-[18px] md:text-[20px]">document_scanner</span>
            </div>
            <h2 className="text-text-main text-base md:text-lg font-bold leading-tight tracking-tight hidden xs:block">AI OCR 프로</h2>
        </div>
      </div>
      
      {/* Middle Navigation - Only visible in Workspace Desktop */}
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

      <div className="flex items-center justify-end gap-2 md:gap-4">
        {currentView === 'workspace' ? (
            <div className="flex gap-1 md:gap-2 animate-fade-in">
            {/* Desktop Actions */}
            <div className="hidden md:flex gap-2">
                <button 
                    onClick={onSettingsClick}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white hover:bg-surface-hover border border-border text-text-secondary hover:text-text-main transition-all shadow-sm"
                    title="설정"
                >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>
                <button 
                    onClick={onImportJSON}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white hover:bg-surface-hover border border-border text-text-secondary hover:text-primary transition-all shadow-sm"
                    title="문서 뷰어"
                >
                    <span className="material-symbols-outlined text-[20px]">description</span>
                </button>
                <button 
                    onClick={onClear}
                    disabled={!hasItems || isProcessing}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white hover:bg-surface-hover border border-border text-text-secondary hover:text-text-main text-sm font-bold leading-normal transition-all shadow-sm disabled:opacity-50"
                >
                    <span>초기화</span>
                </button>
                <button 
                    onClick={onDownloadWord}
                    disabled={!hasFinishedItems} 
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white hover:bg-surface-hover border border-border text-text-main hover:text-primary text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                    title="Word 저장"
                >
                    <span className="material-symbols-outlined text-sm font-bold">file_download</span>
                </button>
                <button 
                    onClick={onExport}
                    disabled={!hasFinishedItems}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white hover:bg-surface-hover border border-border text-text-main hover:text-primary text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                    title="CSV 저장"
                >
                    <span className="material-symbols-outlined text-sm font-bold">download</span>
                </button>
            </div>

            {/* Mobile Actions (Reduced) */}
            <div className="flex md:hidden gap-1">
                 <button 
                    onClick={onSettingsClick}
                    className="p-2 rounded-lg text-text-secondary hover:bg-surface-hover"
                >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>
                <button 
                    onClick={onStartProcess}
                    disabled={!hasItems || isProcessing}
                    className="flex items-center justify-center rounded-lg h-8 px-3 bg-primary text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                    {isProcessing ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : <span>분석</span>}
                </button>
            </div>

            {/* Desktop Start Button */}
            <button 
                onClick={onStartProcess}
                disabled={!hasItems || isProcessing}
                className="hidden md:flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold leading-normal transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
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

            {/* Mobile Right Info Toggle */}
            <button 
                onClick={onToggleRightSidebar}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover"
            >
                <span className="material-symbols-outlined text-[20px]">info</span>
            </button>
            </div>
        ) : (
            <div className="flex gap-2 animate-fade-in">
                 <button 
                    onClick={onSettingsClick}
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-white hover:bg-surface-hover border border-border text-text-main font-bold text-sm transition-all shadow-sm group"
                >
                    <span className="material-symbols-outlined text-[18px] mr-0 md:mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="hidden md:inline">워크스페이스로 돌아가기</span>
                </button>
            </div>
        )}
      </div>
    </header>
  );
};