import Link from 'next/link'

export interface Result {
  id: number
  title: string
  exam_name: string
  date: string
  pdf_link: string
}

export default function ResultCard({ result }: { result: Result }) {
  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 flex flex-col justify-between">
      {result.exam_name && (
        <div className="mb-2">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {result.exam_name}
          </span>
        </div>
      )}
      <h3 className="text-lg font-medium text-blue-700 mb-3 leading-snug">
        {result.pdf_link ? (
           <a href={result.pdf_link} target="_blank" rel="noopener noreferrer" className="hover:underline">{result.title}</a>
        ) : result.title}
      </h3>
      <div className="text-sm text-gray-600 mb-5">
        {result.date ? (
          <p>Declared: {new Date(result.date).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}
          </p>
        ) : (
          <p className="text-gray-400">Declared: N/A</p>
        )}
      </div>
      <div className="mt-auto pt-3 border-t border-gray-100">
        {result.pdf_link ? (
          <a href={result.pdf_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">
            Download PDF
          </a>
        ) : (
          <span className="text-sm text-gray-400">Not Available</span>
        )}
      </div>
    </div>
  )
}
