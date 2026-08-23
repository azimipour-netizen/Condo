'use client'

import { motion, type Variants } from 'motion/react'
import { Mail, FileText, ShieldCheck, User } from 'lucide-react'
import DocAccessToggle from './DocAccessToggle'
import DeleteUserButton from './DeleteUserButton'
import RoleSelect from './RoleSelect'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const roleConfig = {
  admin: {
    label: 'Admin',
    dot: 'bg-red-500',
    badge: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-300',
    tag: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
  agent: {
    label: 'Agent',
    dot: 'bg-teal-500',
    badge: 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800/60 dark:bg-teal-900/30 dark:text-teal-300',
    tag: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  },
  consumer: {
    label: 'Buyer',
    dot: 'bg-neutral-400',
    badge: 'border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300',
    tag: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
  },
} as const

function getInitials(name: string | null, email: string) {
  if (name) return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  return email[0].toUpperCase()
}

// Deterministic pastel bg from string
function avatarColor(id: string) {
  const colors = [
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  ]
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
  return colors[idx]
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', year: 'numeric' }).format(new Date(d))
}

export interface UserRow {
  id: string
  name: string | null
  email: string
  role: string
  documentsUnlocked: boolean
  createdAt: Date
  _count: { uploadedDocuments: number }
}

interface GridProps {
  users: UserRow[]
  currentUserId?: string | null
  canDelete?: boolean
}

export default function UsersGrid({ users, currentUserId, canDelete }: GridProps) {
  const cfg = (role: string) => roleConfig[role as keyof typeof roleConfig] ?? roleConfig.consumer

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {users.map(u => {
        const c = cfg(u.role)
        const initials = getInitials(u.name, u.email)
        const avatarCls = avatarColor(u.id)
        const isConsumer = u.role === 'consumer'

        return (
          <motion.article
            key={u.id}
            variants={item}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-[box-shadow,border-color] duration-300 hover:shadow-lg hover:shadow-neutral-950/5 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700"
          >
            {/* Header: avatar + role badge */}
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold ring-1 ring-black/5 dark:ring-white/10 ${avatarCls}`}>
                {initials}
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${c.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {c.label}
              </span>
            </div>

            {/* Name + email */}
            <h3 className="mt-4 text-base font-semibold text-neutral-900 dark:text-white">
              {u.name ?? <span className="italic text-neutral-400">No name</span>}
            </h3>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400 truncate">{u.email}</p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.tag}`}>
                Joined {formatDate(u.createdAt)}
              </span>
              {u._count.uploadedDocuments > 0 && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  {u._count.uploadedDocuments} doc{u._count.uploadedDocuments !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Footer: actions */}
            <div className="mt-auto flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-800 mt-5">
              <div className="flex gap-1">
                <a
                  href={`mailto:${u.email}`}
                  aria-label={`Email ${u.name ?? u.email}`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
                {u.role === 'admin' && (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-400">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                )}
                {u.role === 'agent' && (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-teal-500">
                    <User className="h-4 w-4" />
                  </span>
                )}
                {u.role === 'consumer' && (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-400">
                    <FileText className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isConsumer && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      Doc access
                    </span>
                    <DocAccessToggle userId={u.id} initialUnlocked={u.documentsUnlocked} />
                  </div>
                )}
                {canDelete && (
                  <RoleSelect
                    userId={u.id}
                    initialRole={u.role as 'consumer' | 'agent' | 'admin'}
                    isSelf={u.id === currentUserId}
                  />
                )}
                {canDelete && (
                  <DeleteUserButton
                    userId={u.id}
                    label={u.name ?? u.email}
                    disabled={u.id === currentUserId}
                  />
                )}
              </div>
            </div>
          </motion.article>
        )
      })}
    </motion.div>
  )
}
