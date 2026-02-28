import { supabase } from '@/lib/supabase'
import JobCard from '@/components/JobCard'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ category?: string }>
}

const categories = ['All', 'SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching']

export default async function JobsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const activeCategory = category ?? 'All'

  let query = supabase.from('jobs').select('*').order('created_at', { ascending: false })
  if (activeCategory !== 'All') {
    query = query.eq('category', activeCategory)
  }

  const { data: jobs } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">💼 Latest Government Jobs</h1>
        <p className="text-gray-500 text-sm">Showing {jobs?.length ?? 0} jobs {activeCategory !== 'All' ? `in ${activeCategory}` : 'across all categories'}</p>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === 'All' ? '/jobs' : `/jobs?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border
              ${activeCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Jobs grid */}
      {jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl font-medium">No jobs found in {activeCategory}</p>
          <Link href="/jobs" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            View all jobs →
          </Link>
        </div>
      )}
    </div>
  )
}
