'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface CategoryImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  /** Optional title for SEO/accessibility (tooltip). Should describe the image. */
  title?: string
  /** Responsive sizes hint for SEO (e.g. "(max-width: 768px) 100vw, 400px") */
  sizes?: string
}

export default function CategoryImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  title,
  sizes,
}: CategoryImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset error state when src changes
    setHasError(false)
    setIsLoading(true)
    setImgSrc(src)
  }, [src])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setIsLoading(false)
      // Try default category image
      if (imgSrc !== '/blog-images/online-education-category.jpg') {
        setImgSrc('/blog-images/online-education-category.jpg')
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // If image fails to load, show gradient placeholder using CSS
  if (hasError && imgSrc === '/blog-images/online-education-category.jpg') {
    return (
      <div 
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
        aria-label={alt}
      >
        {alt}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#667eea' }}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        sizes={sizes ?? '(max-width: 768px) 100vw, 400px'}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  )
}
