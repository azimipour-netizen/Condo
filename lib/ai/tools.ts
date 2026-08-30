import Anthropic from '@anthropic-ai/sdk'

/** Tool definitions passed to the Claude API */
export const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'search_properties',
    description: 'Search available property listings using structured filters. Call this whenever the user describes what they are looking for. Returns a list of matching properties with summary details.',
    input_schema: {
      type: 'object' as const,
      properties: {
        filters: {
          type: 'object',
          description: 'Search filters extracted from the user request',
          properties: {
            location: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['city', 'neighbourhood', 'intersection', 'bbox', 'radius'] },
                value: { type: 'string', description: 'City name, neighbourhood name, or intersection (e.g. "Yonge and Eglinton")' },
                radiusKm: { type: 'number', description: 'Radius in km when type is radius' },
              },
              required: ['type'],
            },
            propertyTypes: {
              type: 'array',
              items: { type: 'string', enum: ['detached', 'semi-detached', 'townhouse', 'condo', 'multiplex', 'vacant_land', 'commercial'] },
            },
            priceMin: { type: 'number' },
            priceMax: { type: 'number' },
            bedroomsMin: { type: 'number' },
            bedroomsMax: { type: 'number' },
            bathroomsMin: { type: 'number' },
            hasParking: { type: 'boolean' },
            sqftMin: { type: 'number' },
            sqftMax: { type: 'number' },
            transactionType: {
              type: 'string',
              enum: ['sale', 'lease'],
              description: 'Use "lease" when the user wants to rent. Use "sale" when the user wants to buy. Default to "sale" only if unclear.',
            },
            keywords: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exact phrases to find in the listing description or title. Use this for anything that is not a structured field — seller-motivation and sale-type language ("motivated seller", "power of sale", "estate sale", "as is", "must sell", "priced to sell"), or specific features ("waterfront", "corner unit", "renovated kitchen"). Every keyword must appear, so pass only the distinctive phrase, not a whole sentence. Prefer one or two phrases.',
            },
            preferences: {
              type: 'array',
              items: { type: 'string' },
              description: 'Soft preferences like "modern", "renovated", "near subway", "good schools". These do NOT filter results — use keywords for anything that must actually match.',
            },
          },
        },
        limit: { type: 'number', description: 'Max results to return. Always pass 20 unless the user explicitly asks for fewer.', default: 20 },
      },
      required: ['filters'],
    },
  },
  {
    name: 'get_property_details',
    description: 'Get full details for a specific property by its ID. Use when the user asks for more information about a specific listing.',
    input_schema: {
      type: 'object' as const,
      properties: {
        propertyId: { type: 'string', description: 'The property ID from a previous search result' },
      },
      required: ['propertyId'],
    },
  },
  {
    name: 'compare_properties',
    description: 'Retrieve details for 2-4 properties to enable a factual comparison. Use when the user asks to compare specific listings.',
    input_schema: {
      type: 'object' as const,
      properties: {
        propertyIds: {
          type: 'array',
          items: { type: 'string' },
          minItems: 2,
          maxItems: 4,
          description: 'IDs of properties to compare',
        },
      },
      required: ['propertyIds'],
    },
  },
]
