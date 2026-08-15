export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ConversationState {
  id: string
  messages: AIMessage[]
  filters: import('./search').SearchFilters
  lastSearchResult?: {
    total: number
    summary: string
  }
}

// Tool parameter schemas used by the AI
export interface SearchPropertiesParams {
  filters: import('./search').SearchFilters
  limit?: number
}

export interface GetPropertyDetailsParams {
  propertyId: string
}

export interface ComparePropertiesParams {
  propertyIds: string[]
}

export interface CreateShowingRequestParams {
  propertyId: string
  preferredDate: string
  preferredTime: string
  name: string
  email: string
  phone?: string
  message?: string
}
