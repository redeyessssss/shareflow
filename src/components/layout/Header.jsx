import { Share2 } from 'lucide-react';

export const Header = () => {
  return (
    <div className="text-center mb-8 pt-8">
      <div className="flex items-center justify-center gap-3 mb-3">
        <Share2 className="w-10 h-10 text-indigo-600" />
        <h1 className="text-4xl font-bold text-gray-800">ShareFlow</h1>
      </div>
      <p className="text-gray-600">Secure file sharing powered by Supabase</p>
    </div>
  );
};
