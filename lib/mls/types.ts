import type { Property, PropertySummary } from '@/types/property'
import type { SearchFilters, SearchResult } from '@/types/search'

/**
 * Provider-agnostic MLS adapter interface.
 * Implement this for each data provider (IDX, VOW, RETS, custom API).
 * The application never depends on a specific provider implementation.
 */
export interface IMLSAdapter {
  readonly name: string

  /** Fetch a page of listings matching the given filters */
  searchListings(filters: SearchFilters, page: number, limit?: number): Promise<SearchResult>

  /** Fetch a single listing by its MLS listing ID */
  getListing(listingId: string): Promise<Property | null>

  /** Pull all new/changed listings since lastSyncAt for background sync */
  getUpdatedListings(since: Date): Promise<Property[]>

  /** Health check — returns true if the provider is reachable */
  ping(): Promise<boolean>
}

/** Raw listing as received from a provider, before normalization */
export interface RawListing {
  [key: string]: unknown
}

/**
 * A closed sale, used as an AVM comparable. Sourced from the VOW feed, so the
 * sold price is gated behind login — see ComplianceConfig.showSoldPrice.
 */
export interface SoldListing {
  summary: PropertySummary
  /** ClosePrice — the actual sale price, null when the feed omits it */
  soldPrice: number | null
  /** PurchaseContractDate; CloseDate is unreliable in this feed */
  soldDate: Date | null
}

/** One row from AMPRE's PropertyRooms feed — dimensions for a single room. */
export interface PropertyRoom {
  type: string
  level: string | null
  length: number | null
  width: number | null
  units: string | null
  /** Pre-formatted imperial string from the feed, e.g. `8ft. 11in. x 12ft. 3in.` */
  dimensions: string | null
  features: string[]
}

/** Compliance rules per MLS provider */
export interface ComplianceConfig {
  /** Provider name shown in attribution */
  attributionText: string
  /** Require user login to view listings (VOW rule) */
  requireLogin: boolean
  /** Default coordinate precision */
  defaultDisplayMode: 'exact' | 'approximate' | 'neighbourhood' | 'hidden'
  /** Max hours listing data may be cached */
  maxCacheHours: number
  /** Whether sold price is displayable */
  showSoldPrice: boolean
}
