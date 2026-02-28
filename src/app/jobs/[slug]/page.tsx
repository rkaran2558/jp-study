import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: result } = await supabase.from('results').select('title, exam_name').eq('id', slug).single()
  return {
    title: result ? `${result.title} | JP GK Study` : 'Result Not Found',
    description: result ? `${result.exam_name} result details` : 'Exam result details'
  }
}

export default async function ResultDetail({ params }: Props) {
  const { slug } = await params
  const { data: result } = await supabase.from('results').select('*').eq('id', slug).single()

  if (!result) notFound()

  const examColors: Record<string, string> = {
    'SSC MTS': 'bg-yellow-100 text-yellow-800',
    'SSC CGL': 'bg-yellow-100 text-yellow-800',
    'UPSC CSE': 'bg-red-100 text-red-800',
    'UPSC IES': 'bg-red-100 text-red-800',
    'RRB NTPC': 'bg-blue-100 text-blue-800',
    'IBPS PO': 'bg-green-100 text-green-800',
    'SBI PO': 'bg-green-100 text-green-800',
  }
  const badgeColor = examColors[result.exam_name] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Back link */}
      <Link href="/results" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        ← Back to All Results
      </Link>

      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">

        {/* Badge + Title */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}>
          {result.exam_name}
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-6">{result.title}</h1>

        {/* Info table */}
        <div className="bg-gray-50 rounded-lg p-5 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">📋 Result Details</h2>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 font-medium text-gray-600 w-40">📝 Exam Name</td>
                <td className="py-2 text-gray-800">{result.exam_name}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-600">📅 Result Date</td>
                <td className="py-2 text-green-600 font-semibold">
                  {new Date(result.date).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'long', year: 'numeric'
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-sm text-yellow-800">
          ⚠️ Please check the official PDF for roll number wise result. This is for reference only.
        </div>

        {/* Download button */}
        <a
          href={result.pdf_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white text-lg font-semibold px-10 py-3 rounded-lg hover:bg-green-600 transition shadow"
        >
          📄 Download Result PDF →
        </a>
      </div>
    </div>
  )
}
