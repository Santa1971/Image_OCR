import React, { useState } from 'react';
import { SIMULATION_DATA } from '../constants';
import { CharacterSprite } from './CharacterSprite';
import { Search, FolderTree, Scale, ShieldCheck, Brain, Lightbulb, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  search: <Search className="w-5 h-5" />,
  'folder-tree': <FolderTree className="w-5 h-5" />,
  scale: <Scale className="w-5 h-5" />,
  'shield-check': <ShieldCheck className="w-5 h-5" />,
};

export const SimulationSection: React.FC = () => {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);

  const activeCategory = SIMULATION_DATA[activeCategoryIdx];
  const activeCase = activeCategory.cases[activeCaseIdx];

  const handleCategoryChange = (idx: number) => {
    setActiveCategoryIdx(idx);
    setActiveCaseIdx(0); // Reset case index when category changes
  };

  return (
    <section id="simulation" className="py-16 md:py-24 bg-slate-950 border-y border-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10 md:mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4">
            Interactive Demo
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight break-keep">
            실무 최적화 시뮬레이션
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light break-keep">
            국가기록원 가이드라인 및 실제 공공기관 BRM 체계를 반영한 <br className="hidden md:block"/>
            <span className="text-blue-500 font-semibold">ARMS의 지능형 처리 프로세스</span>를 경험해보세요.
          </p>
        </div>

        {/* Layout Container: Flex column on mobile (tabs on top), Grid on desktop (sidebar on left) */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-0 lg:gap-8 bg-slate-900/40 backdrop-blur-sm rounded-3xl lg:rounded-[40px] border border-slate-800 shadow-2xl overflow-hidden min-h-[auto] lg:min-h-[700px]">
          
          {/* Sidebar / Tabs Area */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/60 overflow-x-auto custom-scrollbar">
            {SIMULATION_DATA.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(idx)}
                className={`flex-shrink-0 flex items-center gap-3 lg:gap-4 p-3 lg:p-5 rounded-xl lg:rounded-2xl text-left transition-all duration-300 group
                  ${activeCategoryIdx === idx 
                    ? 'bg-blue-600/10 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
                    : 'hover:bg-slate-800/50 border border-transparent hover:border-slate-700'
                  }`}
              >
                <div className={`${activeCategoryIdx === idx ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>
                  {iconMap[cat.icon]}
                </div>
                <div className="whitespace-nowrap lg:whitespace-normal">
                  <div className={`font-bold text-xs md:text-sm ${activeCategoryIdx === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {cat.title}
                  </div>
                </div>
                {activeCategoryIdx === idx && (
                  <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9 flex flex-col relative h-full">
            
            {/* Case Tabs */}
            <div className="flex overflow-x-auto px-6 md:px-8 pt-6 md:pt-8 gap-3 border-b border-slate-800/50 custom-scrollbar pb-2">
              {activeCategory.cases.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCaseIdx(i)}
                  className={`whitespace-nowrap pb-3 md:pb-4 px-2 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all relative
                    ${activeCaseIdx === i ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}
                  `}
                >
                  Case 0{i + 1}
                  {activeCaseIdx === i && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Main Content Scrollable Area */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar bg-slate-900/20">
              <div className="animate-fadeIn max-w-4xl mx-auto space-y-8 md:space-y-10">
                
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-800 rounded-md text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700">
                      Scenario
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {activeCase.tags.map(tag => (
                            <span key={tag} className="text-[9px] md:text-[10px] text-blue-500/70 border border-blue-500/20 px-2 py-0.5 rounded-full">#{tag}</span>
                        ))}
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight break-keep">
                    {activeCase.name}
                  </h3>
                  <div className="p-5 md:p-6 bg-slate-800/40 rounded-2xl md:rounded-3xl border border-slate-700/50 shadow-inner">
                    <p className="text-slate-300 font-medium leading-relaxed text-sm md:text-base">
                      "{activeCase.scenario}"
                    </p>
                  </div>
                </div>

                {/* Solution Logic Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* AI Solution */}
                  <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[32px] border border-blue-500/20 relative group hover:border-blue-500/40 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Brain className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                      </div>
                      <span className="font-black text-[10px] md:text-xs uppercase text-blue-400 tracking-wider">AI Processing</span>
                    </div>
                    <p className="text-slate-200 text-sm md:text-md font-bold leading-relaxed">
                      {activeCase.aiSolution}
                    </p>
                    <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                       <Brain size={60} className="md:w-20 md:h-20" />
                    </div>
                  </div>

                  {/* Expert Logic */}
                  <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 p-6 md:p-8 rounded-3xl md:rounded-[32px] border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Lightbulb className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                      </div>
                      <span className="font-black text-[10px] md:text-xs uppercase text-emerald-400 tracking-wider">Expert Logic</span>
                    </div>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                      {activeCase.expertLogic}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Impact Footer */}
            <div className="p-6 md:p-8 bg-slate-950 border-t border-slate-800 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/5 pointer-events-none"></div>
                <div className="relative z-10 flex-shrink-0">
                    <CharacterSprite emotion={activeCategory.pose} size="md" className="md:w-36 md:h-36 shadow-2xl border-slate-700" />
                </div>
                
                <div className="relative z-10 flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="bg-slate-800/50 p-4 md:p-5 rounded-2xl border-l-4 border-slate-600">
                        <div className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">Before</div>
                        <p className="text-xs md:text-sm text-slate-400 leading-snug">{activeCategory.impact_before}</p>
                    </div>
                    <div className="bg-blue-900/20 p-4 md:p-5 rounded-2xl border-l-4 border-blue-500">
                         <div className="text-[9px] md:text-[10px] text-blue-400 font-black uppercase mb-1 tracking-widest">After ARMS</div>
                         <p className="text-xs md:text-sm text-blue-100 font-bold leading-snug">{activeCategory.impact_after}</p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};