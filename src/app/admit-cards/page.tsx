import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdmitCardsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const supabase = await createSupabaseServer()
  const { q: rawQ, page: rawPage } = await searchParams
  const q = rawQ || ''
  const page = Number(rawPage) || 1
  const limit = 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Fetch jobs that have an admit card link
  let query = supabase.from('jobs').select('*', { count: 'exact' }).not('admit_card_link', 'is', null).order('created_at', { ascending: false })
  
  if (q) query = query.ilike('title', `%${q}%`)
  
  query = query.range(from, to)
  const { data: jobs, error, count } = await query

  if (error) throw new Error(`Database error: ${error.message}`)

  const totalPages = count ? Math.ceil(count / limit) : 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🪪 Admit Cards</h1>
      <p className="text-gray-500 mb-6">{jobs?.length || 0} admit cards available</p>

      {/* Search */}
      <form method="GET" className="flex gap-2 mb-6">
        <input name="q" defaultValue={q} placeholder="Search admit cards..."
          className="flex-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
          Search
        </button>
      </form>

      {/* Admit Cards Grid */}
      {!jobs?.length ? (
        <div className="text-center py-16 text-gray-400">No admit cards found</div>
      ) : (
        <div className="grid gap-3">
          {jobs.map(job => (
            <div key={job.id}
              className="bg-white rounded-sm border border-gray-200 shadow-sm transition p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-blue-400">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">{job.category}</span>
                </div>
                <Link href={`/jobs/${job.slug || job.id}`} className="text-base font-bold text-blue-800 hover:text-red-700 transition">
                  {job.title} Admit Card
                </Link>
                {job.organization && <p className="text-gray-500 text-xs mt-0.5">{job.organization}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {job.admit_card_date && (
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Exam Date</p>
                    <p className="text-sm font-bold text-green-700">{job.admit_card_date}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Link href={`/jobs/${job.slug || job.id}`} className="px-4 py-1.5 bg-slate-100 text-slate-700 text-[13px] font-bold rounded-sm border border-slate-200 hover:bg-slate-200 transition">
                    Details
                  </Link>
                  <a href={job.admit_card_link} target="_blank" rel="noopener noreferrer" 
                    className="px-4 py-1.5 bg-blue-700 text-white text-[13px] font-bold rounded-sm hover:bg-red-700 transition shadow-sm">
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 ? (
            <Link href={`/admit-cards?page=${page - 1}${q ? `&q=${q}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Previous
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Previous</span>}
          
          <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
          
          {page < totalPages ? (
            <Link href={`/admit-cards?page=${page + 1}${q ? `&q=${q}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Next
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Next</span>}
        </div>
      )}
    </div>
  )
}
