import { memo } from 'react';
import { Share2 } from 'lucide-react';

export const Header = memo(() => {
  return (
    <div className="flex items-center justify-center gap-3 gpu">
      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm animate-float">
        <Share2 className="w-8 h-8 text-white" strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
        Share<span className="text-indigo-300">Flow</span>
      </h1>
    </div>
  );
});
