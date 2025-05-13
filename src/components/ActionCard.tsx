import React from 'react';
import { cn } from '@/lib/utils';

// We're not using Card components from ui/card anymore
const ActionCard = ({ icon: Icon, title, color, onClick, className }) => {
  // Color mapping for backgrounds
  const colorClasses = {
    navy: 'bg-navy-900',
    orange: 'bg-orange-500',
    'sky-blue': 'bg-cyan-500',
    gold: 'bg-amber-400',
  };

  return (
    <div 
      className={cn(
        "rounded-lg flex flex-col items-center justify-center py-6 px-4 cursor-pointer transition-transform hover:scale-[1.02]",
        colorClasses[color],
        className
      )}
      onClick={onClick}
    >
      <div className="bg-white/20 p-3 rounded-full mb-3">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-medium text-white">{title}</h3>
    </div>
  );
};

export default ActionCard;