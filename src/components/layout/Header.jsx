import { Share2 } from 'lucide-react';

export const Header = () => {
  return (
    <div className="flex items-center justify-center gap-3">
      <Share2 className="w-12 h-12" />
      <h1 className="text-4xl md:text-5xl font-bold">ShareFlow</h1>
    </div>
  );
};
