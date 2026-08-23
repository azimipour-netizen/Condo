'use client'

import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
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
  soldDate?: string | null
  listingType?: ListingType
}

export type ListingType = 'sale' | 'lease' | 'sold'

interface Props {
  properties: PropertySummary[]
  mapPins?: MapPin[]
  activeId?: string | null
  onMarkerClick?: (id: string) => void
  onClusterClick?: (ids: string[]) => void
  onBoundsChange?: (bbox: BoundingBox) => void
  className?: string
}

// Above this size a cluster is still too coarse to list — zoom in instead.
const CLUSTER_LIST_MAX = 50

const GTA_CENTER: [number, number] = [-79.42, 43.7]
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? ''
const STYLE_URL = `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`

const SOURCE_ID = 'properties'
const CLUSTER_LAYER = 'clusters'
const CLUSTER_COUNT_LAYER = 'cluster-count'
const POINT_LAYER = 'unclustered-point'
const POINT_LABEL_LAYER = 'unclustered-point-label'

const COLOR_SALE = '#0D9488'
const COLOR_SOLD = '#7C2D12'
const COLOR_ACTIVE = '#0F766E'

interface InitialView { center: [number, number]; zoom: number }

/**
 * Resolve the map's opening view from the visitor's IP (no permission prompt,
 * resolves in well under a second). Falls back to the fixed GTA center when
 * the lookup fails or times out, so a slow geo API never blocks the map.
 * Zoom 13 renders roughly a 5km-radius view around the resolved point.
 */
async function fetchInitialCenter(): Promise<InitialView> {
  try {
    const res = await fetch('/api/geo/ip-location', { signal: AbortSignal.timeout(1800) })
    if (res.ok) {
      const data = await res.json()
      if (typeof data.lat === 'number' && typeof data.lng === 'number') {
        return { center: [data.lng, data.lat], zoom: 13 }
      }
    }
  } catch { /* geolocation unavailable — use the fixed default */ }
  return { center: GTA_CENTER, zoom: 11 }
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`
  if (price >= 1_000) return `$${Math.round(price / 1_000)}K`
  return `$${price}`
}

interface MarkerItem {
  id: string
  lat: number
  lng: number
  price: number
  title: string
  kind: ListingType
}

function toItems(properties: PropertySummary[], pins?: MapPin[]): MarkerItem[] {
  if (pins && pins.length > 0) {
    return pins.map(p => ({
      id: p.id, lat: p.lat, lng: p.lng, price: p.price,
      title: p.address ?? p.city, kind: p.listingType ?? 'sale',
    }))
  }
  return properties
    .filter(p => p.location.latitude != null && p.location.longitude != null)
    .map(p => ({
      id: p.id,
      lat: Number(p.location.latitude),
      lng: Number(p.location.longitude),
      price: p.price,
      title: p.title,
      kind: (p.transactionType as ListingType) ?? 'sale',
    }))
}

function toGeoJSON(items: MarkerItem[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: items.map(it => ({
      type: 'Feature',
      id: it.id,
      geometry: { type: 'Point', coordinates: [it.lng, it.lat] },
      properties: {
        id: it.id,
        kind: it.kind,
        priceLabel: it.kind === 'lease' ? `${formatPrice(it.price)}/mo` : formatPrice(it.price),
        color: it.kind === 'sold' ? COLOR_SOLD : COLOR_SALE,
      },
    })),
  }
}

export default function PropertyMap({ properties, mapPins, activeId, onMarkerClick, onClusterClick, onBoundsChange, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const readyRef = useRef(false)
  const fittedRef = useRef(false)
  const activeIdRef = useRef<string | null>(null)
  const onMarkerClickRef = useRef(onMarkerClick)
  onMarkerClickRef.current = onMarkerClick
  const onClusterClickRef = useRef(onClusterClick)
  onClusterClickRef.current = onClusterClick
  const onBoundsChangeRef = useRef(onBoundsChange)
  onBoundsChangeRef.current = onBoundsChange
  const itemsRef = useRef<MarkerItem[]>([])

  function applyActiveState(id: string | null) {
    const map = mapRef.current
    if (!map) return
    if (activeIdRef.current) {
      map.setFeatureState({ source: SOURCE_ID, id: activeIdRef.current }, { active: false })
    }
    if (id) {
      map.setFeatureState({ source: SOURCE_ID, id }, { active: true })
    }
    activeIdRef.current = id
  }

  function setData(items: MarkerItem[]) {
    itemsRef.current = items
    const map = mapRef.current
    if (!map || !readyRef.current) return
    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    if (!source) return
    source.setData(toGeoJSON(items))
    if (activeIdRef.current) applyActiveState(activeIdRef.current)

    if (!fittedRef.current && items.length > 0) {
      fittedRef.current = true
      const bounds = new maplibregl.LngLatBounds()
      items.forEach(it => bounds.extend([it.lng, it.lat]))
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, animate: false })
    }
  }

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPTILER_KEY) return

    let cancelled = false

    fetchInitialCenter().then(initial => {
      if (cancelled || !containerRef.current) return

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: STYLE_URL,
        center: initial.center,
        zoom: initial.zoom,
        attributionControl: false,
      })
      map.addControl(new maplibregl.AttributionControl({ compact: true }))
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
      mapRef.current = map

      // The initial `properties` list is an unfiltered, region-wide sample —
      // fitting bounds to it would immediately zoom back out past the
      // visitor's location. The explicit center above IS the intended view.
      fittedRef.current = true

      map.on('load', () => {
        if (cancelled) return
        readyRef.current = true

        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: toGeoJSON(itemsRef.current),
          cluster: true,
          // Below this zoom, points always render as a zone bubble with a
          // count — never as scattered raw pins. Only past clusterMaxZoom
          // does a zone break apart into its individual listings.
          clusterMaxZoom: 15,
          clusterRadius: 70,
          promoteId: 'id',
        })

        map.addLayer({
          id: CLUSTER_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': COLOR_SALE,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 3,
            'circle-radius': [
              'step', ['get', 'point_count'],
              18, 10, 22, 50, 26, 200, 32,
            ],
          },
        })

        map.addLayer({
          id: CLUSTER_COUNT_LAYER,
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 13,
          },
          paint: { 'text-color': '#ffffff' },
        })

        map.addLayer({
          id: POINT_LAYER,
          type: 'circle',
          source: SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': ['case', ['boolean', ['feature-state', 'active'], false], COLOR_ACTIVE, ['get', 'color']],
            'circle-radius': ['case', ['boolean', ['feature-state', 'active'], false], 9, 6],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
          },
        })

        map.addLayer({
          id: POINT_LABEL_LAYER,
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': ['get', 'priceLabel'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 11,
            'text-offset': [0, 1.4],
            'text-anchor': 'top',
            'text-allow-overlap': false,
          },
          paint: {
            'text-color': '#0B1120',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1.5,
          },
        })

        // Seed with whatever data arrived before the style finished loading.
        setData(itemsRef.current)

        map.on('click', CLUSTER_LAYER, async (e: maplibregl.MapLayerMouseEvent) => {
          const features = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER] })
          const clusterId = features[0]?.properties?.cluster_id
          const pointCount = features[0]?.properties?.point_count as number | undefined
          const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource
          if (clusterId == null) return

          if (onClusterClickRef.current && pointCount != null && pointCount <= CLUSTER_LIST_MAX) {
            try {
              const leaves = await source.getClusterLeaves(clusterId, pointCount, 0)
              const ids = leaves.map(f => String(f.properties?.id)).filter(Boolean)
              onClusterClickRef.current?.(ids)
            } catch { /* cluster expired mid-click — ignore */ }
            return
          }

          const zoom = await source.getClusterExpansionZoom(clusterId)
          const geom = features[0].geometry as GeoJSON.Point
          map.easeTo({ center: geom.coordinates as [number, number], zoom })
        })

        map.on('click', POINT_LAYER, (e: maplibregl.MapLayerMouseEvent) => {
          const id = e.features?.[0]?.properties?.id
          if (id != null) onMarkerClickRef.current?.(String(id))
        })

        map.on('mouseenter', CLUSTER_LAYER, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', CLUSTER_LAYER, () => { map.getCanvas().style.cursor = '' })
        map.on('mouseenter', POINT_LAYER, () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', POINT_LAYER, () => { map.getCanvas().style.cursor = '' })

        if (onBoundsChangeRef.current) {
          let timer: ReturnType<typeof setTimeout>
          map.on('moveend', () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
              const b = map.getBounds()
              onBoundsChangeRef.current?.({
                north: b.getNorth(), east: b.getEast(), south: b.getSouth(), west: b.getWest(),
              })
            }, 500)
          })
        }
      })
    })

    return () => {
      cancelled = true
      readyRef.current = false
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers when properties/pins change
  useEffect(() => {
    setData(toItems(properties, mapPins))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, mapPins])

  // Sync active highlight without rebuilding the source
  useEffect(() => {
    if (!readyRef.current) return
    applyActiveState(activeId ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId])

  if (!MAPTILER_KEY) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-[color:var(--bg-surface-2)] text-[color:var(--text-faint)] ${className ?? ''}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 3C10.5 3 6 7.5 6 13C6 20.3 16 29 16 29S26 20.3 26 13C26 7.5 21.5 3 16 3ZM16 16.5C14.1 16.5 12.5 14.9 12.5 13C12.5 11.1 14.1 9.5 16 9.5C17.9 9.5 19.5 11.1 19.5 13C19.5 14.9 17.9 16.5 16 16.5Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <p className="text-xs font-medium">Map unavailable</p>
        <p className="text-xs">Set NEXT_PUBLIC_MAPTILER_KEY in .env</p>
      </div>
    )
  }

  return <div ref={containerRef} className={className ?? 'w-full h-full'} />
}
