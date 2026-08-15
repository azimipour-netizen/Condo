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
  searchListings(filters: SearchFilters, page: number, limit: number): Promise<SearchResult>

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
