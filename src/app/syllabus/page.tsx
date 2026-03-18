import { createSupabaseServer } from '@/lib/supabase-server'
import SyllabusCard from '@/components/SyllabusCard'
import Link from 'next/link'

export const metadata = {
  title: 'Exam Syllabus | JP GK Study',
  description: 'Download the latest syllabus for various government exams.',
}

export default async function SyllabusPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const supabase = await createSupabaseServer()
  const { q: rawQ, page: rawPage } = await searchParams
  const q = rawQ || ''
  const page = Number(rawPage) || 1
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('syllabus').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  
  if (q) query = query.ilike('title', `%${q}%`)
  
  query = query.range(from, to)
  const { data: syllabi, error, count } = await query

  if (error) throw new Error(`Database error: ${error.message}`)

  const totalPages = count ? Math.ceil(count / limit) : 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[60vh]">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-normal text-gray-900">Exam Syllabus</h1>
          {count !== null && count > 0 && (
            <span className="text-gray-500 text-sm">({count} total)</span>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-1">Browse and download official exam syllabi</p>
      </div>

      <form method="GET" className="flex gap-2 mb-8 max-w-2xl">
        <input name="q" defaultValue={q} placeholder="Search syllabus..."
          className="flex-1 border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-red-700 transition shadow-sm uppercase">
          Search
        </button>
      </form>

      {!syllabi?.length ? (
        <div className="bg-white rounded-sm p-12 text-center border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-lg font-medium">No results found for "{q}".</p>
          <Link href="/syllabus" className="text-blue-700 font-bold hover:underline mt-4 inline-block">Clear Search</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {syllabi.map((s: any) => <SyllabusCard key={s.id} syllabus={s} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 py-4 border-t border-gray-100 w-full">
          {page > 1 ? (
            <Link href={`/syllabus?page=${page - 1}${q ? `&q=${q}` : ''}`} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-700 hover:bg-slate-50 transition">
              Previous
            </Link>
          ) : <span className="px-5 py-2 border border-gray-200 text-gray-300 rounded-sm text-sm font-bold cursor-not-allowed">Previous</span>}
          
          <span className="text-sm text-slate-500 font-bold">Page {page} of {totalPages}</span>
          
          {page < totalPages ? (
            <Link href={`/syllabus?page=${page + 1}${q ? `&q=${q}` : ''}`} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-700 hover:bg-slate-50 transition">
              Next
            </Link>
          ) : <span className="px-5 py-2 border border-gray-200 text-gray-300 rounded-sm text-sm font-bold cursor-not-allowed">Next</span>}
        </div>
      )}
    </div>
  )
}
