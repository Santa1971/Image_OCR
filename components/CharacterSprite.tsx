import React from 'react';

type Emotion = 'guide' | 'success' | 'work' | 'insight';

interface CharacterSpriteProps {
  emotion: Emotion;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CharacterSprite: React.FC<CharacterSpriteProps> = ({ emotion, size = 'md', className = '' }) => {
  // Sprite Grid Configuration (2x2)
  // guide: Top Left
  // success: Top Right
  // work: Bottom Left
  // insight: Bottom Right
  
  const positions: Record<Emotion, string> = {
    guide: '0% 0%',
    success: '100% 0%',
    work: '0% 100%',
    insight: '100% 100%',
  };

  const sizeClasses = {
    sm: 'w-12 h-12 rounded-xl border-2',
    md: 'w-24 h-24 rounded-2xl border-4',
    lg: 'w-36 h-36 rounded-3xl border-4',
  };

  return (
    <div 
      className={`relative overflow-hidden bg-slate-800 shadow-xl ${sizeClasses[size]} ${className}`}
      style={{
        // 파일명을 'character.jpg'로 변경해야 브라우저에서 안전하게 로드됩니다.
        backgroundImage: "url('./character.jpg')",
        backgroundSize: '200% 200%',
        backgroundPosition: positions[emotion],
        borderColor: 'rgba(59, 130, 246, 0.3)',
      }}
      role="img"
      aria-label={`Character showing ${emotion} emotion`}
    >
        {/* Fallback pattern in case image is missing */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none" />
    </div>
  );
};