import { db } from '@/lib/db'
import QAPanel from './QAPanel'

export const metadata = { title: 'Questions' }

async function getQuestions() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await (db as any).propertyQuestion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          orderBy: { createdAt: 'asc' },
          include: { agent: { select: { name: true, email: true } } },
        },
        property: { select: { title: true, listingId: true } },
      },
    })
  } catch {
    return []
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions()
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-8">Buyer Questions</h1>
      <QAPanel questions={questions} />
    </div>
  )
}
