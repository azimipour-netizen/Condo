'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function updateStatus(formData: FormData) {
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (db as any).showingRequest.update({ where: { id }, data: { status } })
  revalidatePath('/dashboard/showings')
}
