import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function ResultsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q: rawQ, page: rawPage } = await searchParams
  const q = rawQ || ''
  const page = Number(rawPage) || 1
  const limit = 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  const supabase = await createSupabaseServer()
  let query = supabase.from('results').select('*', { count: 'exact' }).order('date', { ascending: false })
  if (q) query = query.ilike('title', `%${q}%`)
  
  query = query.range(from, to)
  const { data: results, error, count } = await query

  if (error) throw new Error(`Database error: ${error.message}`)

  const totalPages = count ? Math.ceil(count / limit) : 1

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-normal text-gray-900">Exam Results</h1>
        <p className="text-gray-500 text-sm mt-1">{results?.length || 0} results found</p>
      </div>

      <form method="GET" className="flex gap-3 mb-8 max-w-2xl">
        <input name="q" defaultValue={q} placeholder="Search results..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        <button type="submit" className="bg-gray-100 border border-gray-300 text-gray-800 px-6 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
          Search
        </button>
      </form>

      {!results?.length ? (
        <div className="text-center py-16 text-gray-400">No results found</div>
      ) : (
        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="text-left px-5 py-3 uppercase text-xs tracking-wider">Result Title</th>
                <th className="text-left px-5 py-3 hidden md:table-cell uppercase text-xs tracking-wider">Exam Name</th>
                <th className="text-left px-5 py-3 hidden md:table-cell uppercase text-xs tracking-wider font-bold">Date</th>
                <th className="text-left px-5 py-3 uppercase text-xs tracking-wider">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.map((r, i) => (
                <tr key={r.id} className={`hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-5 py-3 font-semibold text-blue-800 leading-tight">{r.title}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{r.exam_name || '—'}</td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell font-medium">
                    {r.date ? new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {r.pdf_link
                      ? <a href={r.pdf_link} target="_blank" className="bg-red-700 hover:bg-blue-800 text-white text-[11px] font-bold px-4 py-1.5 rounded-sm transition shadow-sm uppercase">Download</a>
                      : <span className="text-gray-300 text-xs italic">Pending</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 ? (
            <Link href={`/results?page=${page - 1}${q ? `&q=${q}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Previous
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Previous</span>}
          
          <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
          
          {page < totalPages ? (
            <Link href={`/results?page=${page + 1}${q ? `&q=${q}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Next
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Next</span>}
        </div>
      )}
    </div>
  )
}
