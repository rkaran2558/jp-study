import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function SchemesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; page?: string }> }) {
  const supabase = await createSupabaseServer()
  const { q: rawQ, category: rawCat, page: rawPage } = await searchParams
  const q = rawQ || ''
  const category = rawCat || ''
  const page = Number(rawPage) || 1
  const limit = 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('schemes').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (q) query = query.ilike('title', `%${q}%`)
  if (category) query = query.eq('category', category)
  
  query = query.range(from, to)
  const { data: schemes, error, count } = await query

  if (error) throw new Error(`Database error: ${error.message}`)

  const totalPages = count ? Math.ceil(count / limit) : 1

  const { data: allSchemes } = await supabase.from('schemes').select('category')
  const categories = [...new Set(allSchemes?.map(s => s.category).filter(Boolean))]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-normal text-gray-900">Government Schemes</h1>
        <p className="text-gray-500 text-sm mt-1">{schemes?.length || 0} active schemes available</p>
      </div>

      <form method="GET" className="flex gap-2 mb-8 max-w-2xl">
        <input name="q" defaultValue={q} placeholder="Search schemes..."
          className="flex-1 border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-red-700 transition shadow-sm uppercase">
          Search
        </button>
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/schemes" className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border ${!category ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>All</Link>
          {categories.map(cat => (
            <Link key={cat} href={`/schemes?category=${cat}`}
              className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors border ${category === cat ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              {cat}
            </Link>
          ))}
        </div>
      )}

      {!schemes?.length ? (
        <div className="bg-white rounded-sm border border-gray-200 p-12 text-center shadow-sm text-gray-400 font-medium">No active schemes found matching your search.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map(scheme => (
            <Link key={scheme.id} href={`/schemes/${scheme.slug || scheme.id}`}
              className="bg-white rounded-sm border border-gray-200 shadow-sm hover:border-blue-500 transition p-5 flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-blue-700 transition-colors"></div>
              <span className="text-slate-500 uppercase tracking-widest text-[9px] w-fit mb-2 font-black bg-slate-50 px-2 py-0.5 rounded-sm">{scheme.category}</span>
              <h2 className="font-bold text-blue-800 mb-2 line-clamp-2 leading-tight text-lg group-hover:text-red-700 transition-colors">{scheme.title}</h2>
              <p className="text-gray-600 text-[13px] line-clamp-3 flex-1 leading-relaxed italic">{scheme.short_info}</p>
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-red-700 text-xs font-bold uppercase tracking-widest">Details View →</span>
                <span className="text-[10px] text-gray-300 font-mono">#{scheme.id}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 ? (
            <Link href={`/schemes?page=${page - 1}${q ? `&q=${q}` : ''}${category ? `&category=${category}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Previous
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Previous</span>}
          
          <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
          
          {page < totalPages ? (
            <Link href={`/schemes?page=${page + 1}${q ? `&q=${q}` : ''}${category ? `&category=${category}` : ''}`} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium">
              Next
            </Link>
          ) : <span className="px-4 py-2 border rounded text-gray-300 text-sm font-medium cursor-not-allowed">Next</span>}
        </div>
      )}
    </div>
  )
}
