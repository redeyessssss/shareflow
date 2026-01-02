import { memo } from 'react';
import { Clock, Lock, MessageSquare } from 'lucide-react';

export const FeatureCards = memo(() => {
  const features = [
    { icon: Clock, title: 'Auto-Expiry', description: 'Links expire automatically', gradient: 'from-indigo-500 to-blue-500', shadow: 'shadow-indigo-200' },
    { icon: Lock, title: 'Password Protected', description: 'Secure sensitive files', gradient: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-200' },
    { icon: MessageSquare, title: 'Add Messages', description: 'Include context with files', gradient: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-200' }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 stagger-children">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 card-hover group gpu shadow-lg border border-slate-100">
          <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg ${feature.shadow}`}>
            <feature.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <h4 className="font-bold text-slate-800 mb-1">{feature.title}</h4>
          <p className="text-sm text-slate-500">{feature.description}</p>
        </div>
      ))}
    </div>
  );
});
