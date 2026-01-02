import { Clock, Lock, Send } from 'lucide-react';

export const FeatureCards = () => {
  const features = [
    {
      icon: Clock,
      title: 'Auto-Expiry',
      description: 'Files automatically delete after expiry time'
    },
    {
      icon: Lock,
      title: 'Password Protection',
      description: 'Optional password for sensitive files'
    },
    {
      icon: Send,
      title: 'Add Messages',
      description: 'Include context with your files'
    }
  ];

  return (
    <div className="mt-8 grid md:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <feature.icon className="w-8 h-8 text-indigo-600 mb-2" />
          <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
          <p className="text-xs text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
