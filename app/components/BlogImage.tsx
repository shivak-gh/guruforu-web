'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  fallbackSrc?: string
  /** Optional title for SEO/accessibility (tooltip). Should describe the image. */
  title?: string
  /** Responsive sizes hint for SEO and LCP (e.g. "(max-width: 768px) 100vw, 400px") */
  sizes?: string
}

export default function BlogImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false,
  fallbackSrc = '/blog-images/online-education-category.jpg',
  title,
  sizes,
}: BlogImageProps) {
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
      // Try fallback image
      if (imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc)
      }
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // If image fails to load, show gradient placeholder using CSS
  if (hasError && imgSrc === fallbackSrc) {
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

  // Strip query string for next/image - localPatterns only allows specific search values;
  // pathname-only URLs always match and avoid client-side validation errors.
  const imageSrc = imgSrc.includes('?') ? imgSrc.split('?')[0] : imgSrc

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#667eea' }}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
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
