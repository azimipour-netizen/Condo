import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SettingsForm from './SettingsForm'

export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/account/settings')

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-8">Account Settings</h1>
      <SettingsForm
        name={session.user.name ?? ''}
        email={session.user.email ?? ''}
      />
    </div>
  )
}
