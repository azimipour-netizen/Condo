'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  title?: string
  approximate?: boolean
  className?: string
}

const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID'

let mapsReady: Promise<void> | null = null
function ensureMapsLoaded(apiKey: string): Promise<void> {
  if (mapsReady) return mapsReady
  if (window.google?.maps) { mapsReady = Promise.resolve(); return mapsReady }
  mapsReady = new Promise<void>((resolve, reject) => {
    const cb = '__gm_cb_' + Math.random().toString(36).slice(2)
    ;(window as unknown as Record<string, unknown>)[cb] = resolve
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=maps,marker&callback=${cb}`
    s.onerror = reject
    document.head.appendChild(s)
  })
  return mapsReady
}

export default function SinglePropertyMap({ lat, lng, title, approximate, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''

  useEffect(() => {
    if (!containerRef.current || !apiKey) return
    let active = true

    ensureMapsLoaded(apiKey).then(() =>
      Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('marker'),
      ])
    ).then(([mapsLib, markerLib]) => {
      if (!active || !containerRef.current) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { Map, Circle } = mapsLib as any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { AdvancedMarkerElement } = markerLib as any

      const pos = { lat, lng }
      const map = new Map(containerRef.current, {
        center: pos,
        zoom: approximate ? 14 : 15,
        mapId: MAP_ID,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      })

      if (approximate) {
        new Circle({
          map, center: pos, radius: 200,
          fillColor: '#0D9488', fillOpacity: 0.15,
          strokeColor: '#0D9488', strokeOpacity: 0.5, strokeWeight: 2,
        })
      } else {
        const el = document.createElement('div')
        el.style.cssText = `
          background:#0D9488; border:2px solid #fff; border-radius:50%;
          width:18px; height:18px;
          box-shadow:0 2px 8px rgba(13,148,136,.5);
        `
        new AdvancedMarkerElement({ map, position: pos, content: el, title: title ?? '' })
      }
    })
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, apiKey])

  if (!apiKey) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1.5 bg-[color:var(--bg-surface-2)] text-[color:var(--text-faint)] ${className ?? ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.1 2 5 5.1 5 9C5 14.3 12 22 12 22S19 14.3 19 9C19 5.1 15.9 2 12 2ZM12 11.5C10.6 11.5 9.5 10.4 9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.4 13.4 11.5 12 11.5Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <p className="text-xs">Add NEXT_PUBLIC_GOOGLE_MAPS_KEY to enable</p>
      </div>
    )
  }

  return <div ref={containerRef} className={className ?? 'w-full h-full'} />
}
