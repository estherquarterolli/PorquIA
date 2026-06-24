'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  if (!failed && src) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${sizes[size]} rounded-2xl object-cover ring-2 ring-brand-300/40 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-2xl brand-gradient grid place-items-center text-white font-bold ring-2 ring-brand-300/40 ${className}`}
    >
      {initials || '?'}
    </div>
  );
}
