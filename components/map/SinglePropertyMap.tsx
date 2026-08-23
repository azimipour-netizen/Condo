'use client'

import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// See PropertyMap.tsx — Turbopack doesn't reliably bundle MapLibre's Web
// Worker, leaving the map a blank canvas. Load the matching version's worker
// from a CDN instead of relying on the bundler to emit it.
maplibregl.setWorkerUrl(`https://cdn.jsdelivr.net/npm/maplibre-gl@6.5.0/dist/maplibre-gl-worker.mjs`)

interface Props {
  lat: number
  lng: number
  title?: string
  approximate?: boolean
  className?: string
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ''
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`

export default function SinglePropertyMap({ lat, lng, title, approximate, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return

    const pos: [number, number] = [lng, lat]
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: pos,
      zoom: approximate ? 14 : 15,
      attributionControl: false,
      interactive: true,
    })
    map.addControl(new maplibregl.AttributionControl({ compact: true }))
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map

    map.on('load', () => {
      if (approximate) {
        map.addSource('approx', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: pos } },
        })
        map.addLayer({
          id: 'approx-circle',
          type: 'circle',
          source: 'approx',
          paint: {
            // radius in pixels at this zoom approximates the ~200m radius the
            // old Google Circle drew; good enough for an "approximate location" cue.
            'circle-radius': 60,
            'circle-color': '#0D9488',
            'circle-opacity': 0.15,
            'circle-stroke-color': '#0D9488',
            'circle-stroke-opacity': 0.5,
            'circle-stroke-width': 2,
          },
        })
      } else {
        const el = document.createElement('div')
        el.style.cssText = `
          background:#0D9488; border:2px solid #fff; border-radius:50%;
          width:18px; height:18px;
          box-shadow:0 2px 8px rgba(13,148,136,.5);
        `
        new maplibregl.Marker({ element: el }).setLngLat(pos).addTo(map)
        if (title) new maplibregl.Popup({ offset: 14, closeButton: false }).setLngLat(pos).setText(title)
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, approximate])

  if (!MAPTILER_KEY) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1.5 bg-[color:var(--bg-surface-2)] text-[color:var(--text-faint)] ${className ?? ''}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C8.1 2 5 5.1 5 9C5 14.3 12 22 12 22S19 14.3 19 9C19 5.1 15.9 2 12 2ZM12 11.5C10.6 11.5 9.5 10.4 9.5 9C9.5 7.6 10.6 6.5 12 6.5C13.4 6.5 14.5 7.6 14.5 9C14.5 10.4 13.4 11.5 12 11.5Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <p className="text-xs">Add NEXT_PUBLIC_MAPTILER_KEY to enable</p>
      </div>
    )
  }

  return <div ref={containerRef} className={className ?? 'w-full h-full'} />
}
