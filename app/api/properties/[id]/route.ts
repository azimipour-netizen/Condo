import { NextRequest, NextResponse } from 'next/server'
import { getMLSAdapter } from '@/lib/mls/adapter'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const adapter = getMLSAdapter()
    const property = await adapter.getListing(id)

    if (!property) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (err) {
    console.error(`[/api/properties/${id}]`, err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
