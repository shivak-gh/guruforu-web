'use client'

import { useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { COUNTRIES } from '../../lib/countries'

type CountryAutocompleteProps = {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  label: ReactNode
  placeholder?: string
}

export default function CountryAutocomplete({
  id: idProp,
  name = 'country',
  value,
  onChange,
  label,
  placeholder = 'Start typing your country...',
}: CountryAutocompleteProps) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId
  const listId = `${inputId}-list`
  const wrapRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase()
    if (!query) return COUNTRIES.slice(0, 8)
    return COUNTRIES.filter((country) => country.toLowerCase().includes(query)).slice(0, 8)
  }, [value])

  const showList = open && suggestions.length > 0

  return (
    <div className="gf-form-group gf-country-autocomplete">
      <label htmlFor={inputId} className="gf-form-label">
        {label}
      </label>
      <div className="gf-country-autocomplete-wrap" ref={wrapRef}>
        <input
          type="text"
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
          className="gf-form-input"
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        {showList && (
          <ul id={listId} className="gf-country-autocomplete-list" role="listbox">
            {suggestions.map((country) => (
              <li key={country} role="option">
                <button
                  type="button"
                  className="gf-country-autocomplete-option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(country)
                    setOpen(false)
                  }}
                >
                  {country}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
