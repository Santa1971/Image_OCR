import React, { useState, useEffect } from 'react';
import { AutoConfig, OCREngine, SystemInstructions } from '../types';

interface SettingsPageProps {
  currentKey: string;
  currentModel: string;
  currentAutoConfig: AutoConfig;
  currentOcrEngine?: OCREngine;
  currentPaddleUrl?: string;
  currentInstructions?: SystemInstructions;
  currentImageOcrEnabled?: boolean;
  onSave: (key: string, model: string, autoConfig: AutoConfig, ocrEngine: OCREngine, paddleUrl: string, instructions: SystemInstructions, imageOcrEnabled: boolean) => void;
  onBack: () => void;
}

const DEFAULT_INSTRUCTIONS: SystemInstructions = {
    ocr: "이 문서는 텍스트 추출이 주 목적입니다. 원본의 내용을 훼손하지 말고 보이는 그대로 정확하게 추출하세요. 오타나 깨진 글자는 문맥을 파악해 보정하세요.",
    image: "이 이미지의 시각적 요소, 분위기, 색감, 배치 등을 상세하게 묘사하세요. 시각장애인을 위한 대체 텍스트 수준으로 구체적이어야 합니다.",
    audio: "오디오의 내용을 빠짐없이 기록(STT)하고, 화자를 구분하여 대화 내용을 정리하세요. 핵심 요약과 키워드를 포함하세요.",
    video: "영상의 흐름, 주요 장면, 자막 내용을 시간 순서대로 정리하세요. 유튜브 업로드용 제목과 설명도 제안하세요."
};

const PRESETS: Record<keyof SystemInstructions, { label: string, text: string }[]> = {
    ocr: [
        { label: "기본 문서 OCR", text: "문서의 텍스트를 정확하게 추출하고, 단락과 서식을 최대한 유지하세요." },
        { label: "손글씨/필기체", text: "자유로운 양식의 손글씨 메모입니다. 흘림체나 악필이라도 문맥을 고려하여 자연스러운 문장으로 변환하세요." },
        { label: "오래된 공문서", text: "화질이 좋지 않은 옛날 공문서입니다. 한자나 옛 한글 표현이 포함될 수 있으며, 흐릿한 글자는 문맥에 맞게 복원하세요." },
        { label: "영수증/표", text: "표 형식이나 영수증 데이터입니다. 항목과 가격, 날짜 정보를 JSON 구조에 맞게 정확히 매핑하세요." },
        { label: "외국어 번역 포함", text: "문서 내의 외국어를 감지하여 추출하고, 한국어 번역본을 함께 제공하세요." }
    ],
    image: [
        { label: "상세 시각 묘사", text: "이미지의 구도, 조명, 색상, 피사체의 표정 등을 아주 상세하게 묘사하세요. 미술 평론가처럼 분석하세요." },
        { label: "SNS 마케팅용", text: "이 이미지를 인스타그램이나 블로그에 올릴 때 사용할 수 있는 감성적이고 매력적인 소개글을 작성하세요." },
        { label: "쇼핑몰 상품 분석", text: "상품의 재질, 디자인 포인트, 사용 용도 등을 분석하여 판매 상세 페이지에 들어갈 문구를 작성하세요." },
        { label: "뉴스/보도 사진", text: "사진 속 사건의 육하원칙(누가, 언제, 어디서, 무엇을, 어떻게, 왜)을 추론하여 객관적인 상황을 설명하세요." },
        { label: "감정/무드 분석", text: "이미지에서 느껴지는 주된 감정과 분위기를 분석하고, 어울리는 음악이나 키워드를 추천하세요." }
    ],
    audio: [
        { label: "회의록 작성", text: "참석자의 발언을 요약 정리하고, 결정된 사항(Decisions)과 향후 할 일(Action Items)을 명확히 구분하세요." },
        { label: "강의 노트", text: "강의 내용을 구조화하여 핵심 개념 위주로 필기 노트 형식으로 정리하세요." },
        { label: "인터뷰 정리", text: "질문과 답변 형식으로 내용을 정리하고, 인터뷰이의 주요 주장과 감정 상태를 파악하세요." },
        { label: "전체 받아쓰기(STT)", text: "내용을 요약하지 말고 들리는 그대로 모든 단어를 빠짐없이 전사(Full Verbatim)하세요." },
        { label: "콜센터 상담 분석", text: "고객의 문의 내용과 불만 사항을 파악하고, 상담원의 응대 태도를 평가하세요." }
    ],
    video: [
        { label: "유튜브 챕터 생성", text: "영상의 타임라인을 분석하여 유튜브 챕터 제목과 시간대(Timestamp)를 생성하세요." },
        { label: "하이라이트 요약", text: "영상에서 가장 흥미롭거나 중요한 하이라이트 장면 3가지를 선정하여 설명하세요." },
        { label: "교육 영상 구조화", text: "영상에서 설명하는 절차나 방법을 단계별(Step-by-step) 매뉴얼로 정리하세요." },
        { label: "스크립트 추출", text: "영상 내의 나레이션과 대사를 대본(Script) 형식으로 추출하세요." },
        { label: "광고/홍보 포인트", text: "이 영상이 홍보하고자 하는 제품이나 서비스의 특장점(USP)을 마케팅 관점에서 분석하세요." }
    ]
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
    currentKey, 
    currentModel, 
    currentAutoConfig, 
    currentOcrEngine = 'tesseract', 
    currentPaddleUrl = 'http://localhost:8000/ocr',
    currentInstructions,
    currentImageOcrEnabled = true,
    onSave, 
    onBack 
}) => {
  const [key, setKey] = useState(currentKey);
  const [model, setModel] = useState(currentModel);
  const [autoConfig, setAutoConfig] = useState<AutoConfig>(currentAutoConfig);
  const [ocrEngine, setOcrEngine] = useState<OCREngine>(currentOcrEngine);
  const [paddleUrl, setPaddleUrl] = useState(currentPaddleUrl);
  
  // Advanced State
  const [instructions, setInstructions] = useState<SystemInstructions>(currentInstructions || DEFAULT_INSTRUCTIONS);
  const [activeTab, setActiveTab] = useState<keyof SystemInstructions>('ocr');
  const [imageOcrEnabled, setImageOcrEnabled] = useState(currentImageOcrEnabled);

  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setKey(currentKey);
    setModel(currentModel);
    setAutoConfig(currentAutoConfig || { sns: false, alt: false, json: false, youtube: false, timeline: false, meeting: false, todo: false, word: false });
    setOcrEngine(currentOcrEngine);
    setPaddleUrl(currentPaddleUrl);
    setInstructions(currentInstructions || DEFAULT_INSTRUCTIONS);
    setImageOcrEnabled(currentImageOcrEnabled);
  }, [currentKey, currentModel, currentAutoConfig, currentOcrEngine, currentPaddleUrl, currentInstructions, currentImageOcrEnabled]);

  const handleSave = () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
        if (confirm("API 키를 삭제하시겠습니까? 이렇게 하면 AI 기능을 사용할 수 없습니다.")) {
            onSave('', model, autoConfig, ocrEngine, paddleUrl, instructions, imageOcrEnabled);
            setMessage({ text: 'API 키가 삭제되었습니다.', type: 'success' });
        }
        return;
    }

    if (!trimmedKey.startsWith('AIza')) {
        setMessage({ text: '경고: 올바르지 않은 API 키 형식일 수 있습니다.', type: 'error' });
    }

    onSave(trimmedKey, model, autoConfig, ocrEngine, paddleUrl, instructions, imageOcrEnabled);
    setMessage({ text: '설정이 안전하게 저장되었습니다.', type: 'success' });
    
    setTimeout(() => setMessage(null), 1500);
  };

  const handleAutoToggle = (field: keyof AutoConfig) => {
      setAutoConfig(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const models = [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (속도/정확도 최적 - 추천)' },
      { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash (최신 모델)' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro (복잡한 추론용)' },
      { id: 'gemini-2.0-pro-exp', name: 'Gemini 2.0 Pro (실험적 기능)' },
  ];

  const tabs: { id: keyof SystemInstructions, label: string, icon: string }[] = [
      { id: 'ocr', label: 'OCR 추출', icon: 'document_scanner' },
      { id: 'image', label: '이미지 분석', icon: 'image' },
      { id: 'audio', label: '오디오', icon: 'graphic_eq' },
      { id: 'video', label: '동영상', icon: 'movie' },
  ];

  return (
    <div className="flex flex-col items-center justify-start pt-16 h-full bg-surface-subtle overflow-y-auto animate-fade-in">
      <div className="w-full max-w-3xl px-6 pb-20">
        <div className="bg-white rounded-2xl shadow-lux border border-border overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-border bg-surface flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-text-main">환경 설정</h2>
                <p className="text-text-secondary text-sm mt-1">AI 모델, OCR 엔진, 맞춤 지침을 설정합니다.</p>
            </div>
            <button 
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-main hover:bg-surface-hover rounded-lg transition-colors"
            >
                닫기
            </button>
          </div>

          {/* Body */}
          <div className="p-8 flex flex-col gap-8">
            
            {/* API Key Section */}
            <section className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <label className="text-base font-bold text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">key</span>
                        Google Gemini API 키
                    </label>
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 hover:underline"
                    >
                        키 발급받기
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                </div>
                
                <div className="relative">
                    <input 
                        type={isVisible ? "text" : "password"}
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-border bg-surface-hover/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-mono text-sm text-text-main shadow-inner"
                    />
                    <button 
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-text-secondary rounded-full hover:bg-black/5 transition-colors"
                        title={isVisible ? "숨기기" : "보기"}
                    >
                        <span className="material-symbols-outlined text-xl block">
                            {isVisible ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                </div>
            </section>

            {/* Custom Instruction Section (TABS) */}
            <section className="flex flex-col gap-4 border-t border-border pt-6">
                 <div className="flex justify-between items-center">
                    <label className="text-base font-bold text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">tune</span>
                        AI 맞춤 지침 (System Instruction)
                    </label>
                 </div>
                 
                 <p className="text-xs text-text-secondary">
                    각 미디어 유형별로 AI가 분석할 때 중점적으로 볼 내용을 지시하세요. 프리셋 버튼을 눌러 빠르게 설정할 수 있습니다.
                 </p>

                 {/* Tabs Header */}
                 <div className="flex border-b border-border gap-1 mt-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-xs font-bold flex items-center gap-2 rounded-t-lg transition-all ${activeTab === tab.id ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-main hover:bg-surface-hover'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                 </div>

                 {/* Tab Content */}
                 <div className="bg-surface-subtle/50 p-4 rounded-b-xl border border-t-0 border-border">
                    <textarea 
                        value={instructions[activeTab]}
                        onChange={(e) => setInstructions(prev => ({ ...prev, [activeTab]: e.target.value }))}
                        placeholder={`AI에게 ${tabs.find(t=>t.id === activeTab)?.label} 분석 시 지킬 규칙을 입력하세요.`}
                        className="w-full h-32 p-4 rounded-xl border border-border bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm resize-none mb-4"
                    />
                    
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase">추천 프리셋 (클릭하여 적용)</span>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS[activeTab].map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInstructions(prev => ({ ...prev, [activeTab]: preset.text }))}
                                    className="px-3 py-1.5 bg-white border border-border hover:border-primary hover:text-primary rounded-lg text-xs font-medium text-text-secondary transition-all shadow-sm"
                                    title={preset.text}
                                >
                                    {preset.label}
                                </button>
                            ))}
                             <button
                                onClick={() => setInstructions(prev => ({ ...prev, [activeTab]: DEFAULT_INSTRUCTIONS[activeTab] }))}
                                className="px-3 py-1.5 bg-surface-subtle border border-border hover:bg-surface-hover rounded-lg text-xs text-text-muted transition-all"
                            >
                                초기화
                            </button>
                        </div>
                    </div>
                 </div>
            </section>

            {/* General Settings */}
            <section className="flex flex-col gap-4 border-t border-border pt-6">
                <label className="text-base font-bold text-text-main flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">settings_applications</span>
                    일반 설정
                </label>

                {/* Model Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-bold text-text-secondary mb-2 block">사용 모델</label>
                        <div className="relative">
                            <select
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-border bg-surface-hover/50 focus:bg-white focus:border-primary outline-none transition-all text-sm appearance-none cursor-pointer"
                            >
                                {models.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Image OCR Toggle */}
                    <div className="flex flex-col justify-center">
                        <label className="text-sm font-bold text-text-secondary mb-2 block">이미지 처리 방식</label>
                        <label className="flex items-center gap-3 cursor-pointer bg-surface-subtle p-2.5 rounded-xl border border-border hover:bg-surface-hover transition-colors">
                            <div className="relative flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={imageOcrEnabled} 
                                    onChange={(e) => setImageOcrEnabled(e.target.checked)} 
                                    className="form-checkbox text-primary rounded border-gray-300 w-5 h-5 focus:ring-primary" 
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-text-main">OCR(텍스트 추출) 수행</span>
                                <span className="text-[10px] text-text-muted">해제 시 텍스트 위치 분석을 생략하고 이미지 내용 묘사에 집중합니다.</span>
                            </div>
                        </label>
                    </div>
                </div>
            </section>

            {/* OCR Engine Selection (PaddleOCR vs Tesseract) */}
            {imageOcrEnabled && (
                <section className="flex flex-col gap-4 border-t border-border pt-6 animate-fade-in">
                    <label className="text-base font-bold text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">view_in_ar</span>
                        보조 OCR 엔진 선택 (이미지 전용)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <div 
                            onClick={() => setOcrEngine('tesseract')}
                            className={`cursor-pointer p-4 rounded-xl border flex flex-col gap-2 transition-all ${ocrEngine === 'tesseract' ? 'bg-primary-light/50 border-primary shadow-sm' : 'bg-surface-subtle border-border hover:bg-surface-hover'}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${ocrEngine === 'tesseract' ? 'border-primary' : 'border-text-muted'}`}>
                                    {ocrEngine === 'tesseract' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </div>
                                <span className="font-bold text-sm">Tesseract.js (내장)</span>
                            </div>
                            <p className="text-xs text-text-secondary pl-6">웹 브라우저 내에서 직접 실행됩니다. 설정이 필요 없으며 무료입니다.</p>
                        </div>

                        <div 
                            onClick={() => setOcrEngine('paddle')}
                            className={`cursor-pointer p-4 rounded-xl border flex flex-col gap-2 transition-all ${ocrEngine === 'paddle' ? 'bg-primary-light/50 border-primary shadow-sm' : 'bg-surface-subtle border-border hover:bg-surface-hover'}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${ocrEngine === 'paddle' ? 'border-primary' : 'border-text-muted'}`}>
                                    {ocrEngine === 'paddle' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </div>
                                <span className="font-bold text-sm">PaddleOCR (API 연동)</span>
                            </div>
                            <p className="text-xs text-text-secondary pl-6">별도의 PaddleOCR 서버가 필요합니다. 성능이 더 우수합니다.</p>
                        </div>
                    </div>

                    {/* Paddle URL Input (Conditional) */}
                    {ocrEngine === 'paddle' && (
                        <div className="pl-2 animate-fade-in">
                            <label className="text-xs font-bold text-text-secondary mb-1.5 block">PaddleOCR API 서버 주소</label>
                            <input 
                                type="text"
                                value={paddleUrl}
                                onChange={(e) => setPaddleUrl(e.target.value)}
                                placeholder="http://localhost:8000/ocr"
                                className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-subtle focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-mono text-xs text-text-main"
                            />
                        </div>
                    )}
                </section>
            )}

            {/* Auto Generation Config Section */}
            <section className="flex flex-col gap-4 border-t border-border pt-6">
                <label className="text-base font-bold text-text-main flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">auto_mode</span>
                    자동 생성 및 저장 설정
                </label>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-2">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                checked={autoConfig.word} 
                                onChange={() => handleAutoToggle('word')} 
                                className="form-checkbox text-primary rounded border-gray-300 w-5 h-5 focus:ring-primary" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-text-main flex items-center gap-1">
                                Word(.doc) 자동 저장
                                <span className="material-symbols-outlined text-sm text-primary">file_download</span>
                            </span>
                            <span className="text-xs text-text-muted">분석 완료 시 파일명에 생성일시를 붙여 자동으로 다운로드합니다.</span>
                        </div>
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Options */}
                    <div className="bg-surface-subtle p-4 rounded-xl border border-border">
                        <h4 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">image</span> 이미지 파일
                        </h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.sns} onChange={() => handleAutoToggle('sns')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">SNS 홍보글 자동 생성</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.alt} onChange={() => handleAutoToggle('alt')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">대체 텍스트</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.json} onChange={() => handleAutoToggle('json')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">JSON 자동 변환</span>
                            </label>
                        </div>
                    </div>

                    {/* Video/Audio Options */}
                    <div className="bg-surface-subtle p-4 rounded-xl border border-border">
                        <h4 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">movie</span> 영상 / <span className="material-symbols-outlined text-sm">graphic_eq</span> 오디오
                        </h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.youtube} onChange={() => handleAutoToggle('youtube')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">유튜브 제목/설명 (영상)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.timeline} onChange={() => handleAutoToggle('timeline')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">타임라인 정리 (영상)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.meeting} onChange={() => handleAutoToggle('meeting')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">회의록 작성 (오디오)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                                <input type="checkbox" checked={autoConfig.todo} onChange={() => handleAutoToggle('todo')} className="form-checkbox text-primary rounded border-border focus:ring-primary/20" />
                                <span className="text-sm font-medium">할 일 목록 추출 (오디오)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="h-6">
                    {message && (
                        <div className={`flex items-center gap-2 text-sm font-medium animate-fade-in ${message.type === 'success' ? 'text-success' : 'text-error'}`}>
                            <span className="material-symbols-outlined text-lg">
                                {message.type === 'success' ? 'check_circle' : 'warning'}
                            </span>
                            {message.text}
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => { 
                            setKey(''); 
                            setModel('gemini-2.0-flash'); 
                            setAutoConfig({ sns: false, alt: false, json: false, youtube: false, timeline: false, meeting: false, todo: false, word: false }); 
                            setOcrEngine('tesseract'); 
                            setPaddleUrl(''); 
                            setInstructions(DEFAULT_INSTRUCTIONS);
                            setImageOcrEnabled(true);
                        }}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-light/50 border border-transparent hover:border-error-light transition-all"
                    >
                        삭제
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        설정 저장
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};