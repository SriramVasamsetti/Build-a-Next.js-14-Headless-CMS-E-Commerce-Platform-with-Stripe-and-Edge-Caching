'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ProductGallery({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return <div className="text-center text-muted-foreground">No images available.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-border">
        <Image
          src={mainImage}
          alt="Main product image"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative h-24 w-full cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200",
              mainImage === image ? "border-primary shadow-md" : "border-transparent hover:border-muted"
            )}
            onClick={() => setMainImage(image)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
