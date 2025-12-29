import React, { useState, useRef, useEffect } from 'react';
import { OCRFile, AnalysisMode, OCREngine } from '../types';

interface MainWorkspaceProps {
  currentItem: OCRFile | undefined;
  onGenerate?: (id: string, prompt: string) => void;
  onModeChange?: (id: string, mode: AnalysisMode) => void;
  onStudioGenerate?: (id: string, tabId: string, prompt: string) => void;
  onEditImage?: (id: string) => void;
  currentOcrEngine?: OCREngine;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({ currentItem, onGenerate, onModeChange, onStudioGenerate, onEditImage, currentOcrEngine = 'tesseract' }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Image Tab & View State
  const [imageTab, setImageTab] = useState<'original' | 'ai_layer'>('original'); 
  const [showOverlay, setShowOverlay] = useState(false);
  const [imgDim, setImgDim] = useState<{w: number, h: number} | null>(null);
  
  // Split View State
  const [isSplitView, setIsSplitView] = useState(false);

  // Result Tab State (Column 4)
  const [resultTab, setResultTab] = useState<'basic' | 'studio'>('basic');
  const [activeStudioTab, setActiveStudioTab] = useState('chat');
  const [promptInput, setPromptInput] = useState('');
  const [isJsonViewMode, setIsJsonViewMode] = useState(true); // For JSON Tab
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<'media' | 'ocr' | 'ai' | 'studio'>('media');

  // Container Refs
  const workspaceRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset view state when item changes
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setImageTab('original'); 
    setResultTab('basic'); 
    setActiveStudioTab('chat');
    setPromptInput('');
    setShowOverlay(false);
    setImgDim(null);
    setIsJsonViewMode(true);
    setMobileTab('media');
  }, [currentItem?.id]);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth) {
        setImgDim({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight });
    }
  }, [currentItem?.previewUrl]);

  useEffect(() => {
    if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [currentItem?.chatHistory, mobileTab]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("복사되었습니다!");
  };

  const downloadStringAsJson = (filename: string, text: string, label: string) => {
      if (!text) return;
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { [label]: text }; }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${label}.json`;
      link.click();
  };

  const handleGenerateClick = () => {
      if (promptInput.trim() && currentItem && onGenerate) {
          onGenerate(currentItem.id, promptInput);
          setPromptInput('');
      }
  };

  const handleStudioTabAction = (tabId: string, actionPrompt: string) => {
      if (currentItem && onStudioGenerate) {
          onStudioGenerate(currentItem.id, tabId, actionPrompt);
      }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const natW = e.currentTarget.naturalWidth;
      const natH = e.currentTarget.naturalHeight;
      setImgDim({ w: natW, h: natH });
      if (workspaceRef.current && natW > 0 && natH > 0) {
          const { width: viewW, height: viewH } = workspaceRef.current.getBoundingClientRect();
          const scaleW = viewW / natW;
          const scaleH = viewH / natH;
          const fitScale = Math.min(scaleW, scaleH) * 0.9; 
          setScale(fitScale > 0 ? fitScale : 1);
      }
  };

  const renderDiff = (original: string, corrected: string) => {
    if (!original) return <span className="text-text-muted italic">비교 대상 없음</span>;
    if (!corrected) return <span className="text-text-muted italic">결과 없음</span>;
    const origWords = original.split(/(\s+)/);
    const corrWords = corrected.split(/(\s+)/);
    if (Math.abs(origWords.length - corrWords.length) > Math.max(origWords.length, corrWords.length) * 0.5) {
        return <div className="text-text-main whitespace-pre-wrap">{corrected}</div>;
    }
    return (
        <div className="text-text-main whitespace-pre-wrap">
            {corrWords.map((word, idx) => {
                const origWord = origWords[idx] || "";
                const isDiff = word.trim() !== origWord.trim() && word.trim().length > 0;
                return (
                    <span 
                        key={idx} 
                        className={isDiff ? "bg-green-100 text-green-800 border-b-2 border-green-500/20" : ""}
                        title={isDiff ? `변경 전: ${origWord}` : undefined}
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
  };

  const extractJson = (text: string): { json: string; note: string } => {
      if (!text) return { json: '', note: '' };
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
          const possibleJson = text.substring(start, end + 1);
          const note = text.substring(0, start) + text.substring(end + 1);
          try {
              const parsed = JSON.parse(possibleJson);
              return { json: JSON.stringify(parsed, null, 2), note: note.trim() };
          } catch (e) {
              return { json: possibleJson, note: note.trim() };
          }
      }
      return { json: '', note: text };
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (currentItem?.mediaType !== 'image') return;
    e.preventDefault();
    const zoomIntensity = 0.1 * scale; 
    const newScale = e.deltaY < 0 ? scale + zoomIntensity : Math.max(scale - zoomIntensity, 0.05); 
    setScale(newScale);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentItem?.mediaType !== 'image') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  if (!currentItem) {
    return (
        <main className="flex-1 bg-surface-canvas flex flex-col items-center justify-center p-8 order-2 min-h-[50vh]">
            <div className="flex flex-col items-center justify-center opacity-40 text-center">
                <div className="size-24 rounded-full bg-white border border-border flex items-center justify-center shadow-lg mb-4">
                    <span className="material-symbols-outlined text-4xl text-text-muted">perm_media</span>
                </div>
                <h3 className="text-lg font-bold text-text-secondary">분석할 파일을 선택하세요</h3>
                <p className="text-sm text-text-muted mt-2">이미지, 동영상, 오디오 파일을 지원합니다.</p>
            </div>
        </main>
    );
  }

  const getStudioTabs = () => {
      const common: { id: string; label: string; icon: string; prompt?: string }[] = [
          { id: 'chat', label: '자유 대화', icon: 'chat' }
      ];
      if (currentItem.mediaType === 'image') {
          return [...common, 
              { id: 'sns', label: 'SNS 홍보', icon: 'campaign', prompt: "이 이미지를 바탕으로 인스타그램 홍보 캡션을 작성해줘. 해시태그 포함." },
              { id: 'alt', label: '대체 텍스트', icon: 'visibility', prompt: "이 이미지의 시각적 요소를 상세히 묘사하여 시각장애인을 위한 대체 텍스트(Alt Text)를 작성해줘." },
              { id: 'json', label: 'JSON 변환', icon: 'data_object', prompt: "이 이미지에 있는 텍스트 정보를 JSON 포맷으로 구조화해서 추출해줘. (extractedText, correctedText, keywords, summary 포함)" }
          ];
      }
      if (currentItem.mediaType === 'video') {
          return [...common,
              { id: 'youtube', label: '유튜브용', icon: 'video_library', prompt: "이 영상 내용을 바탕으로 유튜브 영상 제목 5가지와 설명글을 작성해줘." },
              { id: 'timeline', label: '타임라인', icon: 'view_timeline', prompt: "이 영상의 주요 사건을 타임라인별로 정리해줘." }
          ];
      }
      if (currentItem.mediaType === 'audio') {
          return [...common,
              { id: 'meeting', label: '회의록', icon: 'meeting_room', prompt: "이 오디오 내용을 바탕으로 회의록을 작성해줘 (참석자, 안건, 결정사항, 향후 계획)." },
              { id: 'todo', label: '할 일', icon: 'check_box', prompt: "이 내용에서 해야 할 일(Action Items)만 목록으로 추출해줘." }
          ];
      }
      return common;
  };

  const studioTabs = getStudioTabs();

  // --- Render Sections ---

  const renderMediaPlayer = () => {
      if (currentItem.mediaType === 'video') {
          return (
              <video controls className="max-w-full max-h-full rounded-lg shadow-sm bg-black">
                  <source src={currentItem.previewUrl} type={currentItem.file.type} />
              </video>
          );
      } else if (currentItem.mediaType === 'audio') {
          return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-subtle rounded-xl p-8 gap-4">
                  <span className="material-symbols-outlined text-6xl text-primary opacity-50">graphic_eq</span>
                  <audio controls className="w-full">
                      <source src={currentItem.previewUrl} type={currentItem.file.type} />
                  </audio>
                  <p className="text-sm text-text-muted font-mono">{currentItem.file.name}</p>
              </div>
          );
      } else {
          const activeImageUrl = currentItem.previewUrl;
          const isLayerMode = imageTab === 'ai_layer';
          const isOverlayVisible = showOverlay || isLayerMode;

          return (
            <div className="w-full h-full flex flex-col">
                 <div className="flex p-1 bg-surface-subtle border border-border rounded-lg mb-2 self-start gap-2 flex-wrap">
                    <div className="flex p-0.5 bg-white border border-border rounded-md">
                        <button 
                            onClick={() => setImageTab('original')}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${imageTab === 'original' ? 'bg-primary-light text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                            원본
                        </button>
                        <button 
                            onClick={() => setImageTab('ai_layer')}
                            disabled={!currentItem.ocrData || currentItem.ocrData.length === 0}
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-all flex items-center gap-1 ${imageTab === 'ai_layer' ? 'bg-primary-light text-primary' : 'text-text-muted hover:text-text-secondary disabled:opacity-50'}`}
                        >
                            <span className="material-symbols-outlined text-[10px]">layers</span>
                            AI 복원
                        </button>
                    </div>
                    {currentItem.mediaType === 'image' && (
                        <div className="flex items-center gap-1 bg-white rounded-md border border-border px-2">
                            <button onClick={() => setScale(s => Math.max(s - 0.1, 0.05))} className="p-1 hover:bg-surface-hover rounded"><span className="material-symbols-outlined text-sm">remove</span></button>
                            <span className="text-[10px] w-8 text-center">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => Math.min(s + 0.1, 5))} className="p-1 hover:bg-surface-hover rounded"><span className="material-symbols-outlined text-sm">add</span></button>
                            {onEditImage && (
                                <>
                                    <div className="w-px h-3 bg-border mx-1"></div>
                                    <button onClick={() => onEditImage(currentItem.id)} className="p-1 hover:bg-surface-hover rounded text-text-secondary hover:text-primary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">crop_rotate</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                 </div>

                <div 
                    ref={workspaceRef}
                    className="flex-1 w-full flex items-center justify-center cursor-move overflow-hidden bg-slate-100 rounded-xl border border-border relative group min-h-[300px]"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div 
                        style={{ 
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            transformOrigin: 'center center',
                            width: imgDim ? imgDim.w : 'auto', 
                            height: imgDim ? imgDim.h : 'auto', 
                            position: 'relative', 
                        }}
                    >
                        <img 
                            ref={imgRef}
                            src={activeImageUrl} 
                            alt="View" 
                            onLoad={onImageLoad}
                            style={{ 
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain', 
                                opacity: isLayerMode ? 0.4 : 1, 
                                filter: isLayerMode ? 'grayscale(80%) blur(0.5px)' : 'none',
                                transition: 'all 0.3s',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }}
                            draggable={false}
                        />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                            {isOverlayVisible && currentItem.ocrData?.map((block, i) => {
                                const top = (Number(block.bbox.y0) / 1000) * 100;
                                const left = (Number(block.bbox.x0) / 1000) * 100;
                                const width = ((Number(block.bbox.x1) - Number(block.bbox.x0)) / 1000) * 100;
                                const height = ((Number(block.bbox.y1) - Number(block.bbox.y0)) / 1000) * 100;
                                const pixelHeight = (height / 100) * (imgDim?.h || 1000);
                                const fontSize = Math.max(10, pixelHeight * 0.65); 

                                return (
                                    <div
                                        key={i}
                                        className="group/box absolute hover:z-50 hover:bg-yellow-50 hover:text-black transition-colors"
                                        style={{
                                            left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`,
                                            backgroundColor: isLayerMode ? 'transparent' : 'rgba(79, 70, 229, 0.1)',
                                            color: isLayerMode ? '#0f172a' : undefined,
                                            border: isLayerMode ? '1px solid rgba(79, 70, 229, 0.3)' : '1px solid rgba(79, 70, 229, 0.6)',
                                            borderRadius: isLayerMode ? '2px' : '1px',
                                            fontSize: isLayerMode ? `${fontSize}px` : undefined,
                                            display: isLayerMode ? 'flex' : 'block',
                                            alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden', whiteSpace: 'nowrap',
                                            pointerEvents: 'auto', textAlign: 'center'
                                        }}
                                    >
                                        {isLayerMode && <span>{block.text}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
          );
      }
  };

  const renderSecondaryColumn = () => {
      if (currentItem.mediaType === 'image') {
          const isPaddle = currentOcrEngine === 'paddle';
          const displayText = isPaddle ? currentItem.textPaddle : currentItem.textTesseract;
          const engineName = isPaddle ? "PaddleOCR (API)" : "Tesseract OCR";
          const jsonLabel = isPaddle ? 'PaddleOCR' : 'TesseractOCR';

          return (
            <div className="flex flex-col h-full min-h-[300px]">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-text-secondary uppercase">{engineName}</h4>
                    <button onClick={() => copyToClipboard(displayText)} className="text-text-muted hover:text-primary"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                </div>
                <div className="flex-1 bg-surface-subtle border border-border rounded-xl shadow-inner p-4 overflow-y-auto">
                    {currentItem.analysisMode === 'image' ? (
                        <div className="h-full flex items-center justify-center text-text-muted text-xs italic">이미지 분석 모드입니다.<br/>(OCR 비활성화)</div>
                    ) : (
                        <p className="text-xs leading-relaxed font-mono whitespace-pre-wrap text-text-secondary">
                            {displayText || (currentItem.status === 'processing' ? '분석 중...' : '데이터 없음')}
                        </p>
                    )}
                </div>
            </div>
          );
      }
      return null;
  };

  const renderTertiaryColumn = () => {
    let title = "Gemini OCR"; 
    let content = currentItem.textGemini;
    
    if (currentItem.mediaType === 'audio') { title = "전체 받아쓰기 (STT)"; content = currentItem.textCorrected; }
    else if (currentItem.mediaType === 'video') { title = "영상 상세 묘사"; content = currentItem.textGemini; }

    return (
        <div className="flex flex-col h-full min-h-[300px]">
             <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-primary/70 uppercase">{title}</h4>
                <button onClick={() => copyToClipboard(content)} className="text-text-muted hover:text-primary"><span className="material-symbols-outlined text-sm">content_copy</span></button>
            </div>
            <div className="flex-1 bg-white border border-border rounded-xl shadow-sm p-4 overflow-y-auto">
                 {currentItem.analysisMode === 'image' && currentItem.mediaType === 'image' && !currentItem.textGemini.includes('text_annotations') ? (
                        <p className="text-xs leading-relaxed whitespace-pre-wrap text-text-main">
                            {currentItem.textGemini || "시각적 분석 결과 없음"}
                        </p>
                 ) : (
                    <p className={`text-xs leading-relaxed whitespace-pre-wrap text-text-secondary ${currentItem.mediaType === 'image' ? (currentItem.fontStyle === 'serif' ? 'font-serif' : 'font-sans') : ''}`}>
                        {content || (currentItem.status === 'processing' ? '분석 중...' : '데이터 없음')}
                    </p>
                 )}
            </div>
        </div>
    );
  };

  const renderQuaternaryColumn = () => {
    const renderStudioContent = () => {
        if (activeStudioTab === 'chat') {
            return (
                <div className="flex flex-col h-full min-h-[400px]">
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-surface-canvas">
                        {currentItem.chatHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-60">
                                <span className="material-symbols-outlined text-3xl mb-1">chat_bubble</span>
                                <p className="text-xs">자유롭게 대화해보세요.</p>
                            </div>
                        ) : (
                            currentItem.chatHistory.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                                        msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-border text-text-main rounded-bl-none shadow-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 bg-white border-t border-border flex gap-2">
                        <input 
                            type="text" 
                            value={promptInput}
                            onChange={(e) => setPromptInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateClick()}
                            placeholder="메시지 입력..."
                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface-subtle focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-xs"
                        />
                        <button onClick={handleGenerateClick} disabled={!promptInput.trim()} className="p-2 bg-primary text-white rounded-lg">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </button>
                    </div>
                </div>
            );
        } else {
            const resultText = currentItem.studioResults?.[activeStudioTab];
            const { json, note } = activeStudioTab === 'json' && resultText ? extractJson(resultText) : { json: '', note: '' };

            return (
                <div className="flex flex-col h-full p-4 overflow-y-auto min-h-[400px]">
                    {resultText ? (
                        <div className="flex flex-col h-full gap-3">
                            <div className="flex justify-between items-center">
                                <h5 className="text-xs font-bold text-text-secondary">결과</h5>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            const tab = studioTabs.find(t => t.id === activeStudioTab);
                                            if(tab?.prompt) handleStudioTabAction(activeStudioTab, tab.prompt);
                                        }}
                                        className="text-[10px] px-2 py-1 bg-surface-subtle border border-border rounded hover:bg-white"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                    </button>
                                    <button onClick={() => copyToClipboard(activeStudioTab === 'json' && json ? json : resultText)} className="text-[10px] font-bold text-white bg-primary px-3 py-1 rounded">복사</button>
                                </div>
                            </div>
                            {activeStudioTab === 'json' && isJsonViewMode ? (
                                <div className="flex-1 flex flex-col gap-2 min-h-0">
                                    <pre className="flex-1 p-3 bg-[#1e1e1e] text-[#d4d4d4] text-[10px] font-mono rounded-lg overflow-auto">{json || "No JSON"}</pre>
                                </div>
                            ) : (
                                <textarea readOnly className="flex-1 w-full p-4 rounded-xl border border-border bg-surface-subtle text-xs resize-none" value={resultText} />
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
                            <p className="text-xs text-text-secondary mb-4">'{studioTabs.find(t => t.id === activeStudioTab)?.label}' 생성</p>
                            <button 
                                onClick={() => {
                                    const tab = studioTabs.find(t => t.id === activeStudioTab);
                                    if(tab?.prompt) handleStudioTabAction(activeStudioTab, tab.prompt);
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold shadow-md"
                            >
                                시작
                            </button>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <div className="flex-1 bg-white border border-border rounded-xl shadow-sm overflow-hidden flex flex-col relative h-full">
            <div className="flex flex-col h-full bg-surface-subtle">
                <div className="flex overflow-x-auto no-scrollbar border-b border-border bg-white px-2 shrink-0">
                    {studioTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveStudioTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-3 text-[10px] font-bold border-b-2 transition-all whitespace-nowrap
                                ${activeStudioTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-muted'}`}
                        >
                            <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex-1 overflow-hidden relative">
                    {renderStudioContent()}
                </div>
            </div>
        </div>
    );
  };

  return (
    <main className="flex-1 bg-surface-canvas relative flex flex-col overflow-y-auto order-2 h-full">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-border px-4 py-2 md:px-6 md:py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
             <div className="bg-primary/10 p-1.5 rounded text-primary">
                <span className="material-symbols-outlined text-lg">
                    {currentItem.mediaType === 'video' ? 'movie' : currentItem.mediaType === 'audio' ? 'graphic_eq' : 'image'}
                </span>
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-sm text-text-main truncate max-w-[150px] md:max-w-md">{currentItem.file.name}</span>
                <span className={`text-[10px] font-bold uppercase ${
                    currentItem.status === 'done' ? 'text-success' : currentItem.status === 'processing' ? 'text-primary' : 'text-text-muted'
                }`}>
                    {currentItem.status === 'done' ? '완료' : currentItem.status === 'processing' ? '분석 중' : '대기'}
                </span>
             </div>
        </div>
        
        {/* Desktop Split Toggle */}
        <div className="hidden md:flex items-center gap-3">
            <button 
                onClick={() => setIsSplitView(!isSplitView)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${isSplitView ? 'bg-primary text-white border-primary' : 'bg-white text-text-secondary border-border hover:bg-surface-hover'}`}
            >
                <span className="material-symbols-outlined text-sm">{isSplitView ? 'vertical_split' : 'grid_view'}</span>
                <span>비교 보기</span>
            </button>
        </div>
      </div>

      {/* --- Mobile View (Tabbed) --- */}
      <div className="md:hidden flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4">
              {mobileTab === 'media' && renderMediaPlayer()}
              {mobileTab === 'ocr' && (
                  <div className="flex flex-col gap-6">
                      {renderSecondaryColumn()}
                      {renderTertiaryColumn()}
                  </div>
              )}
              {mobileTab === 'ai' && (
                  <div className="flex flex-col h-full bg-success-light/10 p-4 rounded-xl border border-success/20">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-bold text-success uppercase">핵심 요약 / 보정</h5>
                            <button onClick={() => copyToClipboard(currentItem.textCorrected || currentItem.summary)} className="text-text-muted hover:text-primary"><span className="material-symbols-outlined text-sm">content_copy</span></button>
                        </div>
                        {currentItem.mediaType === 'image' && currentItem.textCorrected ? (
                            <div className="text-xs leading-relaxed text-text-main bg-white p-3 rounded border border-success/10">{renderDiff(currentItem.textGemini, currentItem.textCorrected)}</div>
                        ) : (
                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-text-main font-medium">{currentItem.summary || "내용 없음"}</p>
                        )}
                  </div>
              )}
              {mobileTab === 'studio' && renderQuaternaryColumn()}
          </div>
          
          {/* Mobile Bottom Navigation */}
          <div className="bg-white border-t border-border flex justify-around p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-20 pb-safe">
              {[
                  { id: 'media', icon: 'perm_media', label: '미디어' },
                  { id: 'ocr', icon: 'text_snippet', label: '데이터' },
                  { id: 'ai', icon: 'auto_awesome', label: 'AI분석' },
                  { id: 'studio', icon: 'chat', label: '생성/채팅' }
              ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setMobileTab(tab.id as any)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] ${mobileTab === tab.id ? 'text-primary' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                      <span className={`material-symbols-outlined text-2xl ${mobileTab === tab.id ? 'fill-1' : ''}`}>{tab.icon}</span>
                      <span className="text-[10px] font-medium">{tab.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* --- Desktop View (Grid) --- */}
      {isSplitView ? (
        <div className="hidden md:grid flex-1 p-6 grid-cols-2 gap-6 h-full min-h-0">
            <section className="flex flex-col gap-3 min-w-0 h-full overflow-hidden">
                <div className="relative w-full flex-1 border border-border rounded-xl overflow-hidden bg-slate-100">{renderMediaPlayer()}</div>
            </section>
            <section className="flex flex-col gap-3 min-w-0 h-full overflow-hidden">
                <div className="flex-1 bg-white border border-border rounded-xl shadow-sm p-6 overflow-y-auto">
                    <p className="text-sm leading-7 whitespace-pre-wrap text-text-main">{currentItem.textGemini}</p>
                </div>
            </section>
        </div>
      ) : (
        <div className="hidden md:grid flex-1 p-6 grid-cols-2 2xl:grid-cols-4 gap-6 h-full min-h-0">
            <section className="flex flex-col gap-3 min-w-0 h-[500px] xl:h-auto">
                <div className="relative w-full h-full">{renderMediaPlayer()}</div>
            </section>
            <section className="flex flex-col gap-3 min-w-0 h-[500px] xl:h-auto">{renderSecondaryColumn()}</section>
            <section className="flex flex-col gap-3 min-w-0 h-[500px] xl:h-auto">{renderTertiaryColumn()}</section>
            <section className="flex flex-col gap-3 min-w-0 h-[500px] xl:h-auto">
                 {/* Basic/Studio Tabs for Desktop Column 4 */}
                 <div className="flex items-center justify-between mb-1">
                    <div className="flex p-0.5 bg-surface-subtle border border-border rounded-lg">
                        <button onClick={() => setResultTab('basic')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${resultTab === 'basic' ? 'bg-white shadow-sm text-text-main' : 'text-text-muted hover:text-text-secondary'}`}>기본 분석</button>
                        <button onClick={() => setResultTab('studio')} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${resultTab === 'studio' ? 'bg-primary-light text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}>AI 창작</button>
                    </div>
                </div>
                {resultTab === 'basic' ? (
                     <div className="flex-1 bg-white border border-border rounded-xl shadow-sm p-4 overflow-y-auto bg-success-light/10">
                        <h5 className="text-xs font-bold text-success uppercase mb-2">{currentItem.mediaType === 'image' ? "AI 보정 비교 / 요약" : "핵심 요약"}</h5>
                        {currentItem.mediaType === 'image' && currentItem.textCorrected ? (
                            <div className="text-xs leading-relaxed text-text-main">{renderDiff(currentItem.textGemini, currentItem.textCorrected)}</div>
                        ) : (
                            <p className="text-xs leading-relaxed whitespace-pre-wrap text-text-main font-medium">{currentItem.summary}</p>
                        )}
                     </div>
                ) : renderQuaternaryColumn()}
            </section>
        </div>
      )}
    </main>
  );
};