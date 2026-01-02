import { memo } from 'react';

export const ProgressBar = memo(({ progress, label = "Uploading..." }) => {
  return (
    <div className="mt-8 animate-fadeInUp gpu">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <span className="text-sm font-bold gradient-text">{progress}%</span>
      </div>
      <div className="w-full bg-indigo-100 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-out progress-bar relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
});
