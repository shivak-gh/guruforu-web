'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface CategoryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  title?: string
  sizes?: string
}

export default function CategoryImage({
  src,
  alt,
  className,
  title,
  sizes,
}: CategoryImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setHasError(false)
    setIsLoading(true)
    setImgSrc(src)
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setIsLoading(false)
      if (imgSrc !== '/blog-images/online-education-category.jpg') {
        setImgSrc('/blog-images/online-education-category.jpg')
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError && imgSrc === '/blog-images/online-education-category.jpg') {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: 'hsl(var(--muted))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'hsl(var(--muted-foreground))',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
        aria-label={alt}
      >
        {alt}
      </div>
    )
  }

  const imageSrc = imgSrc.includes('?') ? imgSrc.split('?')[0] : imgSrc

  return (
    <Image
      src={imageSrc}
      alt={alt}
      title={title}
      fill
      className={className}
      sizes={sizes ?? '(max-width: 768px) 50vw, 25vw'}
      onError={handleError}
      onLoad={handleLoad}
      style={{
        objectFit: 'cover',
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
    />
  )
}
