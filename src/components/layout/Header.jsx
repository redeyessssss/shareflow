import { memo } from 'react';
import { Share2 } from 'lucide-react';

export const Header = memo(() => {
  return (
    <div className="flex items-center justify-center gap-4 gpu">
      <div className="p-4 bg-white rounded-2xl shadow-lg animate-float relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 animate-pulse-custom" />
        <Share2 className="w-10 h-10 text-indigo-600 relative z-10" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="text-slate-800">Share</span>
        <span className="gradient-text-animated">Flow</span>
      </h1>
    </div>
  );
});
