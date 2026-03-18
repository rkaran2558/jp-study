import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

const CATEGORIES = ['All', 'SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching']

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}) {
  const supabase = await createSupabaseServer()
  const { category: rawCategory, q: rawQ, page: rawPage } = await searchParams
  const category = rawCategory || 'All'
  const q = rawQ || ''
  const page = Number(rawPage) || 1
  const limit = 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('jobs').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (category !== 'All') query = query.eq('category', category)
  if (q) query = query.ilike('title', `%${q}%`)

  query = query.range(from, to)
  const { data: jobs, error, count } = await query

  if (error) throw new Error(`Database error: ${error.message}`)

  const totalPages = count ? Math.ceil(count / limit) : 1


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-normal text-gray-900">Explore Govt Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">{jobs?.length || 0} listings found</p>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3 mb-8 max-w-2xl">
        <input name="q" defaultValue={q} placeholder="Search jobs..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        {category !== 'All' && <input type="hidden" name="category" value={category} />}
        <button type="submit" className="bg-gray-100 border border-gray-300 text-gray-800 px-6 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
          Search
        </button>
      </form>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <Link key={cat}
            href={`/jobs?category=${cat}${q ? `&q=${q}` : ''}`}
            className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border ${
              category === cat
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
            }`}>
            {cat}
          </Link>
        ))}
      </div>

      {/* Jobs Grid */}
      {!jobs?.length ? (
        <div className="bg-white rounded-sm border border-gray-200 p-12 text-center shadow-sm text-gray-400 font-medium italic">No jobs found matching your criteria.</div>
      ) : (
        <div className="grid gap-3">
          {jobs.map(job => (
            <Link key={job.id} href={`/jobs/${job.slug || job.id}`}
              className="bg-white rounded-sm border border-gray-200 shadow-sm hover:border-blue-500 transition-all p-4 flex flex-col md:flex-row md:items-center gap-4 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-blue-700 transition-colors"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-sm font-black uppercase tracking-widest">{job.category}</span>
                  {job.total_vacancies && (
                    <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest leading-none">{job.total_vacancies} Posts</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-blue-800 group-hover:text-red-700 transition-colors leading-tight">{job.title}</h2>
                {job.organization && <p className="text-slate-500 text-xs mt-0.5 font-medium">{job.organization}</p>}
                {job.short_info && <p className="text-gray-400 text-[11px] mt-1 line-clamp-1 italic">{job.short_info}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {job.last_date && (
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Last Date</p>
                    <p className="text-sm font-black text-red-700">
                      {new Date(job.last_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}
                <span className="bg-blue-700 text-white text-[11px] font-bold px-4 py-2 rounded-sm shadow-sm uppercase tracking-wider group-hover:bg-red-700 transition-colors">Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 ? (
            <Link href={`/jobs?page=${page - 1}${q ? `&q=${q}` : ''}${category !== 'All' ? `&category=${category}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Previous
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Previous</span>}
          
          <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
          
          {page < totalPages ? (
            <Link href={`/jobs?page=${page + 1}${q ? `&q=${q}` : ''}${category !== 'All' ? `&category=${category}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Next
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Next</span>}
        </div>
      )}
    </div>
  )
}
