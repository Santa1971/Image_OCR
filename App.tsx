import React from 'react';
import { HashRouter } from 'react-router-dom';
import { SimulationSection } from './components/SimulationSection';
import { CharacterSprite } from './components/CharacterSprite';
import { Zap, Shield, Search, Menu, X, Rocket, CheckCircle2, History, FileImage, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
        
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-transform group-hover:scale-105 text-sm md:text-base">
                AR
              </div>
              <span className="font-black text-xl md:text-2xl tracking-tighter text-white">ARMS</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-10 text-sm font-bold text-slate-400">
              <a href="#about" className="hover:text-blue-400 transition-colors">솔루션 소개</a>
              <a href="#simulation" className="hover:text-blue-400 transition-colors">시뮬레이션</a>
              <a href="#preservation" className="hover:text-blue-400 transition-colors">보존 매체 변환</a>
              <a href="#impact" className="hover:text-blue-400 transition-colors">도입효과</a>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Expert Logic</div>
                <div className="text-xs font-bold text-slate-300">System Active</div>
              </div>
              <CharacterSprite emotion="guide" size="sm" className="border-blue-500/30" />
            </div>

            {/* Mobile Toggle */}
            <button 
                className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
              <div className="md:hidden absolute top-16 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-6 flex flex-col gap-6 text-center animate-fade-in-down shadow-2xl z-40">
                <a href="#about" className="text-slate-300 font-bold text-lg py-2" onClick={() => setIsMobileMenuOpen(false)}>솔루션 소개</a>
                <a href="#simulation" className="text-slate-300 font-bold text-lg py-2" onClick={() => setIsMobileMenuOpen(false)}>시뮬레이션</a>
                <a href="#preservation" className="text-slate-300 font-bold text-lg py-2" onClick={() => setIsMobileMenuOpen(false)}>보존 매체 변환</a>
                <a href="#impact" className="text-slate-300 font-bold text-lg py-2" onClick={() => setIsMobileMenuOpen(false)}>도입효과</a>
              </div>
          )}
        </nav>

        {/* Hero Section */}
        <header className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                <div className="space-y-6 md:space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md">
                        <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-blue-400 text-[10px] md:text-xs font-black tracking-widest uppercase">Intelligent Archives Solution</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight break-keep">
                        OCR로 읽고,<br/>
                        데이터로 기록을<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">혁신하다.</span>
                    </h1>
                    <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-lg font-light break-keep">
                        "업무 시간 90% 단축, 검색 정확도 99% 달성"<br className="hidden md:block"/>
                        잠들어 있던 아날로그 기록의 가치를 깨워 <br className="hidden md:block"/>
                        기관의 핵심 데이터 자산으로 탈바꿈시킵니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <a href="#simulation" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                            <Rocket className="w-5 h-5" />
                            시뮬레이션 시작
                        </a>
                        <a href="https://image-ocr-plus.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 group">
                            <History className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                            OCR 데모 체험
                        </a>
                    </div>
                </div>
                
                <div className="relative hidden lg:block animate-fade-in-up delay-200">
                    <div className="w-full aspect-square max-w-md mx-auto bg-slate-800/50 backdrop-blur-xl rounded-[48px] p-8 border border-white/5 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                         <CharacterSprite emotion="work" size="lg" className="scale-150 shadow-2xl" />
                         
                         {/* Floating Cards */}
                         <div className="absolute top-10 right-10 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 shadow-xl animate-float">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                            <div className="text-xs font-bold text-slate-400">분류 정확도</div>
                            <div className="text-xl font-black text-white">99.9%</div>
                         </div>
                         <div className="absolute bottom-10 left-10 bg-slate-900/90 p-4 rounded-2xl border border-slate-700 shadow-xl animate-float-delayed">
                            <Search className="w-8 h-8 text-blue-500 mb-2" />
                            <div className="text-xs font-bold text-slate-400">검색 속도</div>
                            <div className="text-xl font-black text-white">0.5s</div>
                         </div>
                    </div>
                </div>
            </div>
        </header>

        {/* About Section */}
        <section id="about" className="py-20 md:py-32 border-t border-slate-900 bg-slate-950 relative">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start lg:items-center">
                    <div className="lg:col-span-5 space-y-6 md:space-y-8">
                        <h2 className="text-3xl md:text-4xl font-black leading-tight text-white break-keep">
                            30년의 기록관리 현장 노하우,<br/>
                            <span className="text-blue-500">AI 기술로 완성되다</span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-justify text-base md:text-lg font-light break-keep">
                            공공기관의 기록관리는 단순 보존을 넘어 법적 준거성(Compliance)과 역사적 가치를 동시에 확보해야 합니다. 
                            <strong className="text-slate-200"> ARMS</strong>는 단순 OCR을 넘어, 
                            <strong className="text-slate-200"> 공공기록물법</strong>과 <strong className="text-slate-200">기록관리기준표(BRM)</strong>를 
                            딥러닝한 엔진을 통해 실무자의 판단을 보조하는 지능형 의사결정 지원 시스템(DSS)입니다.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 md:p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors">
                                <div className="text-blue-500 font-black text-2xl md:text-3xl mb-1">30+</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Years Expertise</div>
                            </div>
                            <div className="p-4 md:p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                                <div className="text-emerald-500 font-black text-2xl md:text-3xl mb-1">Zero</div>
                                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Security Breach</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-slate-900/50 p-6 md:p-8 rounded-[32px] space-y-4 border border-slate-800 hover:-translate-y-2 transition duration-500 hover:shadow-2xl hover:shadow-blue-900/10">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                <Search className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h4 className="text-lg md:text-xl font-bold text-white">Deep OCR Search</h4>
                            <p className="text-sm text-slate-400 leading-relaxed break-keep">
                                이미지 속 텍스트는 물론, 문서의 서식(Form)과 맥락(Context)을 이해하여 
                                키워드 그 이상의 의미를 찾아냅니다.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-6 md:p-8 rounded-[32px] space-y-4 border border-slate-800 hover:-translate-y-2 transition duration-500 hover:shadow-2xl hover:shadow-indigo-900/10">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                                <Shield className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h4 className="text-lg md:text-xl font-bold text-white">Smart Security</h4>
                            <p className="text-sm text-slate-400 leading-relaxed break-keep">
                                개인정보보호법에 의거한 정밀한 마스킹과 
                                권한별 접근 제어로 안심할 수 있는 열람 환경을 제공합니다.
                            </p>
                        </div>
                         <div className="bg-slate-900/50 p-6 md:p-8 rounded-[32px] space-y-4 border border-slate-800 hover:-translate-y-2 transition duration-500 hover:shadow-2xl hover:shadow-emerald-900/10 md:col-span-2">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                <Zap className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h4 className="text-lg md:text-xl font-bold text-white">Automated Workflow</h4>
                            <p className="text-sm text-slate-400 leading-relaxed break-keep">
                                분류, 편철, 이관, 폐기 등 기록물의 생애주기(Lifecycle) 전 과정을 자동화하여
                                단순 반복 업무를 획기적으로 줄입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Simulation Section Component */}
        <SimulationSection />

        {/* Microfilm Preservation Tool Section */}
        <section id="preservation" className="py-20 md:py-24 bg-slate-900 relative border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
                    New Feature
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-white leading-tight break-keep">
                    법적 효력을 갖춘<br/>
                    <span className="text-emerald-500">진본성 확보(Integrity)</span> 및 <br/>
                    보존 매체 변환 솔루션
                 </h2>
                 <p className="text-slate-400 text-lg leading-relaxed break-keep">
                    부서장님, 단순히 스캔만 한다고 끝이 아닙니다. 
                    <strong className="text-white">마이크로필름</strong> 등 영구 보존 매체로 변환하기 위해서는 
                    문서의 맥락 정보(파일명, 생산일자 등)가 이미지와 함께 <strong className="text-white">한 몸처럼(Watermarking)</strong> 기록되어야 합니다.
                    또한, 원본과 변환본이 동일하다는 기술적 증명(Hash값 검증)이 필수적입니다.
                 </p>
                 <ul className="space-y-4 pt-4">
                    <li className="flex items-start gap-3">
                       <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                       <div>
                          <div className="font-bold text-white">메타데이터 자동 스탬핑</div>
                          <div className="text-sm text-slate-400">파일명, 날짜, 쪽수 정보를 이미지 여백에 자동으로 기입하여 마이크로필름 촬영 시 문서 이력 보존</div>
                       </div>
                    </li>
                    <li className="flex items-start gap-3">
                       <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                       <div>
                          <div className="font-bold text-white">무결성 검증 (Anti-Tampering)</div>
                          <div className="text-sm text-slate-400">국정원 검증필 암호화 모듈(SHA-256)을 통해 원본 대조 및 위변조 여부 즉시 판별</div>
                       </div>
                    </li>
                 </ul>
                 <div className="pt-6">
                    <a href="/image-master.html" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 transition-all transform hover:-translate-y-1">
                       <FileImage className="w-6 h-6" />
                       이미지 마스터(Image Master) 실행
                    </a>
                    <p className="mt-3 text-xs text-slate-500 font-medium">
                       * 별도의 설치 없이 웹 브라우저에서 즉시 대량의 이미지 전처리 및 검증이 가능합니다.
                    </p>
                 </div>
              </div>
              <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full opacity-30 animate-pulse"></div>
                 <div className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                       <div className="flex items-center gap-3">
                          <CharacterSprite emotion="success" size="sm" className="border-emerald-500/50" />
                          <div>
                             <div className="text-sm font-bold text-white">전처리 시뮬레이션</div>
                             <div className="text-xs text-slate-500">Processing...</div>
                          </div>
                       </div>
                       <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-400 text-xs font-bold">Active</div>
                    </div>
                    {/* Mock Interface */}
                    <div className="space-y-3">
                       <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[75%]"></div>
                       </div>
                       <div className="flex justify-between text-xs text-slate-400 font-mono">
                          <span>Processing: IMG_2024_0042.jpg</span>
                          <span>75%</span>
                       </div>
                       <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                             <div className="text-2xl font-black text-white">1,420</div>
                             <div className="text-[10px] text-slate-500 uppercase">Files Processed</div>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                             <div className="text-2xl font-black text-emerald-500">0</div>
                             <div className="text-[10px] text-slate-500 uppercase">Errors Found</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact / Statistics Section */}
        <section id="impact" className="py-20 md:py-32 bg-slate-950 relative">
             <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-12 md:mb-20 space-y-4">
                     <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight break-keep">
                        현장 담당자가 체감하는 <span className="text-blue-500">혁신적 변화</span>
                    </h2>
                    <p className="text-slate-500 text-sm md:text-base">실제 도입 기관(A시청, B공사)의 성과 측정 결과입니다.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Stat Card 1 */}
                    <div className="group bg-slate-900/50 p-6 md:p-8 rounded-[40px] border border-slate-800 hover:bg-slate-800 transition duration-500 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500/10 rounded-full mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Rocket className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
                        </div>
                        <div className="text-3xl md:text-4xl font-black text-white mb-2">90<span className="text-blue-500 text-xl md:text-2xl">%</span></div>
                        <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Time Saving</div>
                        <p className="text-slate-500 text-sm leading-relaxed break-keep">
                            수동 BRM 매핑 및 데이터 검수 시간을 획기적으로 줄여 업무 병목 현상 해소
                        </p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="group bg-slate-900/50 p-6 md:p-8 rounded-[40px] border border-slate-800 hover:bg-slate-800 transition duration-500 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-full mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
                        </div>
                        <div className="text-3xl md:text-4xl font-black text-white mb-2">99<span className="text-emerald-500 text-xl md:text-2xl">%</span></div>
                        <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Accuracy</div>
                        <p className="text-slate-500 text-sm leading-relaxed break-keep">
                            비정형 문서 내 모든 텍스트를 자산화하여 '찾지 못하는 기록물' 제로화
                        </p>
                    </div>

                     {/* Stat Card 3 */}
                     <div className="group bg-slate-900/50 p-6 md:p-8 rounded-[40px] border border-slate-800 hover:bg-slate-800 transition duration-500 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500/10 rounded-full mx-auto flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <History className="w-8 h-8 md:w-10 md:h-10 text-purple-500" />
                        </div>
                        <div className="text-3xl md:text-4xl font-black text-white mb-2">∞</div>
                        <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Asset Value</div>
                        <p className="text-slate-500 text-sm leading-relaxed break-keep">
                            잠들어 있던 수기·이미지 데이터를 지식화하여 기관의 정책 결정 지원
                        </p>
                    </div>
                </div>
             </div>
        </section>

        {/* Footer */}
        <footer className="py-12 md:py-20 border-t border-slate-900 bg-slate-950">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-6 md:space-y-8">
                <div className="flex justify-center items-center gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-blue-500">AR</div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter text-white">ARMS SOLUTION</span>
                </div>
                <p className="text-slate-500 text-xs md:text-sm font-medium">
                    30년 기록관리 전문가의 통찰이 담긴 가장 안전하고 지능적인 시스템
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[9px] md:text-[10px] text-slate-600 tracking-[0.2em] uppercase font-bold">
                    <span>Archives & Records Management System</span>
                    <span>AI OCR Innovation</span>
                    <span>© 2024 ARMS. All rights reserved.</span>
                </div>
            </div>
        </footer>

      </div>
    </HashRouter>
  );
};

export default App;