import Link from 'next/link'

export interface Result {
  id: number
  title: string
  exam_name: string
  date: string
  pdf_link: string
}

const examColors: Record<string, string> = {
  'SSC MTS': 'bg-yellow-100 text-yellow-800',
  'SSC CGL': 'bg-yellow-100 text-yellow-800',
  'UPSC CSE': 'bg-red-100 text-red-800',
  'UPSC IES': 'bg-red-100 text-red-800',
  'RRB NTPC': 'bg-blue-100 text-blue-800',
  'IBPS PO': 'bg-green-100 text-green-800',
  'SBI PO': 'bg-green-100 text-green-800',
}

export default function ResultCard({ result }: { result: Result }) {
  const badgeColor = examColors[result.exam_name] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition border border-gray-100 flex flex-col justify-between">

      {/* Exam badge */}
      <div className="mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
          {result.exam_name}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug">
        {result.title}
      </h3>

      {/* Date */}
      <div className="text-sm text-gray-600 mb-4">
        <p className="text-green-600 font-semibold">
          📅 Declared: {new Date(result.date).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/results/${result.id}`}
          className="flex-1 text-center bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          View Details
        </Link>
        <a
          href={result.pdf_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-green-500 text-white text-sm px-3 py-2 rounded hover:bg-green-600 transition font-medium"
        >
          Download PDF
        </a>
      </div>
    </div>
  )
}
