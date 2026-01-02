import { memo } from 'react';
import { Share2 } from 'lucide-react';

export const Header = memo(() => {
  return (
    <div className="flex items-center justify-center gap-3 gpu">
      <div className="p-3 bg-white/80 rounded-2xl shadow-soft animate-float">
        <Share2 className="w-8 h-8 text-indigo-600" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        <span className="text-slate-800">Share</span>
        <span className="gradient-text">Flow</span>
      </h1>
    </div>
  );
});
