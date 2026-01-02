import { memo } from 'react';
import { Clock, Lock, MessageSquare } from 'lucide-react';

export const FeatureCards = memo(() => {
  const features = [
    { icon: Clock, title: 'Auto-Expiry', description: 'Links expire automatically', color: 'indigo' },
    { icon: Lock, title: 'Password Protected', description: 'Secure sensitive files', color: 'purple' },
    { icon: MessageSquare, title: 'Add Messages', description: 'Include context with files', color: 'pink' }
  ];

  const colors = {
    indigo: 'from-indigo-100 to-indigo-50 text-indigo-600',
    purple: 'from-purple-100 to-purple-50 text-purple-600',
    pink: 'from-pink-100 to-pink-50 text-pink-600'
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 stagger-children">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-xl p-5 card-hover group gpu shadow-soft border border-indigo-50">
          <div className={`w-10 h-10 bg-gradient-to-br ${colors[feature.color]} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
            <feature.icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h4 className="font-medium text-slate-800 mb-1">{feature.title}</h4>
          <p className="text-sm text-slate-500">{feature.description}</p>
        </div>
      ))}
    </div>
  );
});
