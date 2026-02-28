import { supabase } from '@/lib/supabase'
import JobCard from '@/components/JobCard'
import ResultCard from '@/components/ResultCard'
import Link from 'next/link'

export default async function Home() {
  const [{ data: jobs }, { data: results }] = await Promise.all([
    supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('results').select('*').order('date', { ascending: false }).limit(6)
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl p-8 mb-12 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">JP GK Study</h1>
        <p className="text-lg text-blue-100">Latest Government Jobs, Exam Results & Admit Cards — Updated Daily</p>
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Link href="/jobs" className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-full hover:bg-blue-50 transition text-sm">
            💼 Browse Jobs
          </Link>
          <Link href="/results" className="bg-blue-600 border border-white text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-800 transition text-sm">
            📊 View Results
          </Link>
        </div>
      </div>

      {/* Latest Jobs */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-600 pl-3">
            💼 Latest Jobs
          </h2>
          <Link href="/jobs" className="text-blue-600 hover:underline text-sm font-medium">
            View All Jobs →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job: any) => <JobCard key={job.id} job={job} />)}
        </div>
      </section>

      {/* Latest Results */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-500 pl-3">
            📊 Latest Results
          </h2>
          <Link href="/results" className="text-blue-600 hover:underline text-sm font-medium">
            View All Results →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results?.map((result: any) => <ResultCard key={result.id} result={result} />)}
        </div>
      </section>

    </div>
  )
}
