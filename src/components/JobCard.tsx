import Link from 'next/link'

export interface Job {
  id: number
  title: string
  category: string
  location: string
  last_date: string
  apply_link: string
  description?: string
}

const categoryColors: Record<string, string> = {
  SSC: 'bg-yellow-100 text-yellow-800',
  UPSC: 'bg-red-100 text-red-800',
  Railway: 'bg-blue-100 text-blue-800',
  Bank: 'bg-green-100 text-green-800',
  Defence: 'bg-gray-100 text-gray-800',
  Teaching: 'bg-purple-100 text-purple-800',
  'State PSC': 'bg-orange-100 text-orange-800',
}

export default function JobCard({ job }: { job: Job }) {
  const badgeColor = categoryColors[job.category] ?? 'bg-gray-100 text-gray-700'
  const isExpired = new Date(job.last_date) < new Date()

  return (
    <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition border border-gray-100 flex flex-col justify-between">
      
      {/* Category badge */}
      <div className="mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
          {job.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug">
        {job.title}
      </h3>

      {/* Meta info */}
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>📍 <strong>Location:</strong> {job.location}</p>
        <p className={isExpired ? 'text-gray-400' : 'text-red-600 font-semibold'}>
          📅 Last Date: {new Date(job.last_date).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
          })}
          {isExpired && <span className="ml-2 text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Expired</span>}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 text-center bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          View Details
        </Link>
        <a
          href={job.apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-green-500 text-white text-sm px-3 py-2 rounded hover:bg-green-600 transition font-medium"
        >
          Apply Now
        </a>
      </div>
    </div>
  )
}
