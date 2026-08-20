'use client'

import { useEffect, useRef } from 'react'
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer'
import type { PropertySummary } from '@/types/property'
import type { BoundingBox } from '@/types/search'

export interface MapPin {
  id: string
  listingId: string
  lat: number
  lng: number
  price: number
  bedrooms: number
  bathroomsTotal: number
  sqft: number | null
  address: string | null
  neighbourhood: string | null
  city: string
  thumbnail: string | null
}

interface Props {
  properties: PropertySummary[]
  mapPins?: MapPin[]
  activeId?: string | null
  onMarkerClick?: (id: string) => void
  onBoundsChange?: (bbox: BoundingBox) => void
  className?: string
}

const GTA_CENTER = { lat: 43.7, lng: -79.42 }
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

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

let styleInjected = false
function injectMarkerStyles() {
  if (styleInjected || typeof document === 'undefined') return
  styleInjected = true
  const s = document.createElement('style')
  s.textContent = `
    .pm { background:white; border:2px solid #DDE3EE; border-radius:999px; padding:4px 10px;
          font:600 12px/1 -apple-system,system-ui,sans-serif; color:#0B1120;
          box-shadow:0 2px 8px rgba(0,0,0,.12); cursor:pointer; white-space:nowrap;
          transition:transform .15s, border-color .15s, background .15s; }
    .pm:hover,.pm.active { background:#0D9488; color:#fff; border-color:#0D9488; transform:scale(1.08); }
    .pm.active { transform:scale(1.12); z-index:20 !important; }
    .cm { background:#0D9488; border:3px solid #fff; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font:700 13px/1 -apple-system,system-ui,sans-serif; color:#fff;
          box-shadow:0 3px 10px rgba(13,148,136,.4); cursor:pointer; }
  `
  document.head.appendChild(s)
}

function makeMarkerEl(price: number, active: boolean): HTMLDivElement {
  const el = document.createElement('div')
  el.className = 'pm' + (active ? ' active' : '')
  el.textContent = formatPrice(price)
  return el
}

export default function PropertyMap({ properties, mapPins, activeId, onMarkerClick, onBoundsChange, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<Map<string, google.maps.marker.AdvancedMarkerElement>>(new Map())
  const clustererRef = useRef<MarkerClusterer | null>(null)
  const initRef = useRef(false)
  const fittedRef = useRef(false)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''

  // Init map
  useEffect(() => {
    if (!containerRef.current || initRef.current || !apiKey) return
    initRef.current = true
    injectMarkerStyles()

    ensureMapsLoaded(apiKey).then(() =>
      Promise.all([
        google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
        google.maps.importLibrary('marker') as Promise<google.maps.MarkerLibrary>,
      ])
    ).then(([{ Map }, { AdvancedMarkerElement }]) => {
        if (!containerRef.current) return

        const map = new Map(containerRef.current, {
          center: GTA_CENTER,
          zoom: 11,
          mapId: MAP_ID,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        })
        mapRef.current = map

        // Viewport-based search callback
        if (onBoundsChange) {
          let timer: ReturnType<typeof setTimeout>
          map.addListener('idle', () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
              const b = map.getBounds()
              if (!b) return
              const ne = b.getNorthEast()
              const sw = b.getSouthWest()
              onBoundsChange({ north: ne.lat(), east: ne.lng(), south: sw.lat(), west: sw.lng() })
            }, 500)
          })
        }

        buildMarkers(map, AdvancedMarkerElement, properties, activeId ?? null, onMarkerClick, mapPins)
      }
    )

    return () => {
      clustererRef.current?.clearMarkers()
      clustererRef.current = null
      markersRef.current.forEach(m => { m.map = null })
      markersRef.current.clear()
      mapRef.current = null
      initRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  function buildMarkers(
    map: google.maps.Map,
    AME: typeof google.maps.marker.AdvancedMarkerElement,
    props: PropertySummary[],
    active: string | null,
    onClick?: (id: string) => void,
    pins?: MapPin[],
  ) {
    clustererRef.current?.clearMarkers()
    markersRef.current.forEach(m => { m.map = null })
    markersRef.current.clear()

    const newMarkers: google.maps.marker.AdvancedMarkerElement[] = []
    const bounds = new google.maps.LatLngBounds()
    let hasPos = false

    // Use cached DB pins when available (thousands of markers), fall back to AMPRE results
    const items: Array<{ id: string; price: number; lat: number; lng: number; title: string }> =
      pins && pins.length > 0
        ? pins.map(p => ({ id: p.id, price: p.price, lat: p.lat, lng: p.lng, title: p.address ?? p.city }))
        : props
            .filter(p => p.location.latitude != null && p.location.longitude != null)
            .map(p => ({
              id:    p.id,
              price: p.price,
              lat:   Number(p.location.latitude),
              lng:   Number(p.location.longitude),
              title: p.title,
            }))

    for (const p of items) {
      const pos = { lat: p.lat, lng: p.lng }
      bounds.extend(pos)
      hasPos = true

      const el = makeMarkerEl(p.price, p.id === active)
      const marker = new AME({ map, position: pos, content: el, title: p.title })
      marker.addListener('click', () => onClick?.(p.id))
      markersRef.current.set(p.id, marker)
      newMarkers.push(marker)
    }

    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        markers: newMarkers,
        algorithm: new SuperClusterAlgorithm({ radius: 60, maxZoom: 14 }),
        renderer: {
          render({ count, position }) {
            const size = Math.min(44 + count * 2, 64)
            const el = document.createElement('div')
            el.className = 'cm'
            el.style.cssText = `width:${size}px;height:${size}px`
            el.textContent = String(count)
            return new AME({ position, content: el })
          },
        },
      })
    } else {
      clustererRef.current.addMarkers(newMarkers)
    }

    if (hasPos && !fittedRef.current) {
      fittedRef.current = true
      map.fitBounds(bounds, 60)
      const l = map.addListener('bounds_changed', () => {
        if ((map.getZoom() ?? 0) > 15) map.setZoom(15)
        google.maps.event.removeListener(l)
      })
    }
  }

  // Update markers when properties list changes
  useEffect(() => {
    if (!mapRef.current || !initRef.current) return
    google.maps.importLibrary('marker').then((lib) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      buildMarkers(mapRef.current!, (lib as any).AdvancedMarkerElement, properties, activeId ?? null, onMarkerClick, mapPins)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, mapPins])

  // Sync active highlight without rebuilding markers
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.content as HTMLElement | null
      if (!el) return
      el.classList.toggle('active', id === activeId)
    })
  }, [activeId])

  if (!apiKey) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-[color:var(--bg-surface-2)] text-[color:var(--text-faint)] ${className ?? ''}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 3C10.5 3 6 7.5 6 13C6 20.3 16 29 16 29S26 20.3 26 13C26 7.5 21.5 3 16 3ZM16 16.5C14.1 16.5 12.5 14.9 12.5 13C12.5 11.1 14.1 9.5 16 9.5C17.9 9.5 19.5 11.1 19.5 13C19.5 14.9 17.9 16.5 16 16.5Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <p className="text-xs font-medium">Map unavailable</p>
        <p className="text-xs">Set NEXT_PUBLIC_GOOGLE_MAPS_KEY in .env</p>
      </div>
    )
  }

  return <div ref={containerRef} className={className ?? 'w-full h-full'} />
}
