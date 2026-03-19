import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import Image from 'next/image'
import { isValidUrl } from '@/lib/utils'

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const supabase = await createSupabaseServer()
  const { q: rawQ, page: rawPage } = await searchParams
  const q = rawQ || ''
  const page = Number(rawPage) || 1
  const limit = 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase.from('blogs').select('*', { count: 'exact' }).eq('published', true).order('created_at', { ascending: false })
  if (q) query = query.ilike('title', `%${q}%`)

  query = query.range(from, to)
  const { data: posts, error, count } = await query

  if (error) throw new Error(`Database error: ${error.message}`)

  const totalPages = count ? Math.ceil(count / limit) : 1

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-normal text-gray-900">Study Blog & Articles</h1>
        <p className="text-gray-500 text-sm mt-1">{posts?.length || 0} articles available</p>
      </div>

      <form method="GET" className="flex gap-2 mb-8 max-w-2xl">
        <input name="q" defaultValue={q} placeholder="Search articles..."
          className="flex-1 border border-gray-300 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-red-700 transition shadow-sm uppercase">
          Search
        </button>
      </form>

      {!posts?.length ? (
        <div className="bg-white rounded-sm border border-gray-200 p-12 text-center shadow-sm text-gray-400 font-medium italic">No articles found matching your query.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug || post.id}`}
              className="bg-white rounded-sm border border-gray-200 shadow-sm hover:border-blue-500 transition-all overflow-hidden flex flex-col group">
              {isValidUrl(post.thumbnail_url) && (
                <div className="relative h-44 w-full bg-slate-100 border-b border-gray-100 overflow-hidden">
                  <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1 relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-slate-500 text-[10px] uppercase tracking-widest font-black bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-100">{post.category}</span>
                  {post.author && <span className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">by {post.author}</span>}
                </div>
                <h2 className="font-bold text-blue-800 mb-2 line-clamp-2 leading-snug text-lg group-hover:text-red-700 transition-colors">{post.title}</h2>
                {post.summary && <p className="text-gray-600 text-[13px] line-clamp-3 flex-1 leading-relaxed italic">{post.summary}</p>}
                <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                  <span className="text-red-700 text-xs font-bold uppercase tracking-widest">Read Article →</span>
                  {post.created_at && (
                    <span className="text-gray-400 text-[10px] font-mono">
                      {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 py-4 border-t border-gray-100 w-full">
          {page > 1 ? (
            <Link href={`/blog?page=${page - 1}${q ? `&q=${q}` : ''}`} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-700 hover:bg-slate-50 transition">
              Previous
            </Link>
          ) : <span className="px-5 py-2 border border-gray-200 text-gray-300 rounded-sm text-sm font-bold cursor-not-allowed">Previous</span>}
          
          <span className="text-sm text-slate-500 font-bold">Page {page} of {totalPages}</span>
          
          {page < totalPages ? (
            <Link href={`/blog?page=${page + 1}${q ? `&q=${q}` : ''}`} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-700 hover:bg-slate-50 transition">
              Next
            </Link>
          ) : <span className="px-5 py-2 border border-gray-200 text-gray-300 rounded-sm text-sm font-bold cursor-not-allowed">Next</span>}
        </div>
      )}
    </div>
  )
}
