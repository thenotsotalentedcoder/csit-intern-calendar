'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IIntern } from "@/lib/models/Intern";

interface InternBadgeProps {
  intern: IIntern;
  size?: 'sm' | 'md' | 'lg';
  showAvatar?: boolean;
}

export function InternBadge({ intern, size = 'md', showAvatar = true }: InternBadgeProps) {
  const sizeClasses = {
    sm: 'h-6 text-xs px-2 py-0.5',
    md: 'h-8 text-sm px-3 py-1.5',
    lg: 'h-10 text-base px-4 py-2'
  };

  const avatarSizes = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Badge 
      className={`
        ${sizeClasses[size]} 
        inline-flex items-center gap-2 
        rounded-full font-medium
        transition-all duration-200
        hover:scale-105 hover:shadow-md
        text-white border-0
      `}
      style={{ 
        backgroundColor: intern.color,
        boxShadow: `0 2px 8px ${intern.color}20`
      }}
    >
      {showAvatar && (
        <Avatar className={avatarSizes[size]}>
          <AvatarImage src={intern.avatar || ''} alt={intern.name} />
          <AvatarFallback 
            className="text-xs font-semibold text-white"
            style={{ backgroundColor: intern.color }}
          >
            {getInitials(intern.name)}
          </AvatarFallback>
        </Avatar>
      )}
      <span className="truncate max-w-16 sm:max-w-20">
        {size === 'sm' ? intern.name.split(' ')[0] : intern.name}
      </span>
    </Badge>
  );
}