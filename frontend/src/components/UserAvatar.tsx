'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';

interface UserAvatarProps {
  user: User | null;
  size?: number;
  className?: string;
}

/**
 * Mostra a foto real da conta Google do usuário (user.photoURL).
 * Se a imagem falhar ou não existir, cai num fallback com a inicial
 * do nome/email sobre um gradiente colorido determinístico.
 */
export function UserAvatar({ user, size = 44, className = '' }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const photo = user?.photoURL;
  const label = user?.displayName || user?.email || '?';
  const initial = label.charAt(0).toUpperCase();

  // Gradiente determinístico a partir do nome/email
  const gradients = [
    'from-violet-500 to-fuchsia-500',
    'from-blue-500 to-cyan-400',
    'from-rose-500 to-orange-400',
    'from-emerald-500 to-teal-400',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-400',
  ];
  const idx = label.charCodeAt(0) % gradients.length;
  const gradient = gradients[idx];

  const dimension = { width: size, height: size };

  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={label}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={dimension}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ ...dimension, fontSize: size * 0.42 }}
      className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold select-none ${className}`}
    >
      {initial}
    </div>
  );
}
