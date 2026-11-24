import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function PropertyImage({ src, alt, className = 'w-full h-full object-cover' }: PropertyImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2EFE9] via-[#EAE4D7] to-[#DFD5C0] text-[#6B5D3F] p-6 text-center ${className}`}
      >
        <Building2 className="w-8 h-8 mb-2 opacity-60" />
        <span className="text-xs font-medium leading-snug max-w-[20ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
