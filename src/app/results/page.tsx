import { supabase } from '@/lib/supabase'
import ResultCard from '@/components/ResultCard'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ exam?: string }>
}

const exams = ['All', 'SSC MTS', 'SSC CGL', 'UPSC CSE', 'RRB NTPC', 'IBPS PO', 'SBI PO']

export default async function ResultsPage({ searchParams }: Props) {
  const { exam } = await searchParams
  const activeExam = exam ?? 'All'

  let query = supabase.from('results').select('*').order('date', { ascending: false })
  if (activeExam !== 'All') {
    query = query.eq('exam_name', activeExam)
  }

  const { data: results } = await query

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">📊 Exam Results</h1>
        <p className="text-gray-500 text-sm">Showing {results?.length ?? 0} results {activeExam !== 'All' ? `for ${activeExam}` : 'across all exams'}</p>
      </div>

      {/* Exam filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {exams.map((ex) => (
          <Link
            key={ex}
            href={ex === 'All' ? '/results' : `/results?exam=${ex}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border
              ${activeExam === ex
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
              }`}
          >
            {ex}
          </Link>
        ))}
      </div>

      {/* Results grid */}
      {results && results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result: any) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-xl font-medium">No results found for {activeExam}</p>
          <Link href="/results" className="mt-4 inline-block text-blue-600 hover:underline text-sm">
            View all results →
          </Link>
        </div>
      )}
    </div>
  )
}
