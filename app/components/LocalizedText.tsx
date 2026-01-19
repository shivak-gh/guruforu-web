'use client'

import { useEffect, useState } from 'react'
import { detectLocale, localizeText, type Region } from '../../lib/locale'

interface LocalizedTextProps {
  children: string
  className?: string
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'strong' | 'em'
}

export default function LocalizedText({ 
  children, 
  className,
  as: Component = 'span' 
}: LocalizedTextProps) {
  const [localizedText, setLocalizedText] = useState(children)
  const [region, setRegion] = useState<Region>('DEFAULT')

  useEffect(() => {
    const localeInfo = detectLocale()
    setRegion(localeInfo.region)
    setLocalizedText(localizeText(children, localeInfo.region))
  }, [children])

  return <Component className={className}>{localizedText}</Component>
}
