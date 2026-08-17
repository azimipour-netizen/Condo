import type { IMLSAdapter } from './types'
import { MockMLSAdapter } from './adapters/mock'
import { PropTxAdapter } from './adapters/proptx'

const provider = process.env.MLS_PROVIDER ?? 'mock'

let _adapter: IMLSAdapter | null = null

/** Returns the singleton MLS adapter for the configured provider */
export function getMLSAdapter(): IMLSAdapter {
  if (_adapter) return _adapter

  switch (provider) {
    case 'mock':
      _adapter = new MockMLSAdapter()
      break
    case 'proptx':
    case 'trreb':
      _adapter = new PropTxAdapter()
      break
    default:
      throw new Error(`Unknown MLS_PROVIDER: "${provider}". Add an adapter in lib/mls/adapters/.`)
  }

  return _adapter
}
