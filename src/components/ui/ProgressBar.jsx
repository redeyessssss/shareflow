import { memo } from 'react';

export const ProgressBar = memo(({ progress, label = "Uploading..." }) => {
  return (
    <div className="mt-6 animate-fadeInUp gpu">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300 ease-out progress-bar"
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
});
