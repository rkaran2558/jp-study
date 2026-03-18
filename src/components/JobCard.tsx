import Link from 'next/link'

export interface Job {
  id: number
  title: string
  category: string
  location: string
  last_date: string
  apply_link: string
  slug?: string
}

export default function JobCard({ job }: { job: Job }) {
  const hasDate = Boolean(job.last_date)
  const isExpired = hasDate && new Date(job.last_date!) < new Date()

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 flex flex-col justify-between">
      <div className="mb-2">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {job.category || 'Uncategorized'}
        </span>
      </div>
      <h3 className="text-lg font-medium text-blue-700 mb-3 leading-snug">
        <Link href={`/jobs/${job.slug || job.id}`} className="hover:underline">{job.title}</Link>
      </h3>
      <div className="text-sm text-gray-600 space-y-1 mb-5">
        {job.location && <p>Location: {job.location}</p>}
        {hasDate ? (
          <p className={isExpired ? 'text-gray-400' : 'text-gray-700'}>
            Ends: {new Date(job.last_date!).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}
            {isExpired && <span className="ml-2 text-xs text-red-500">(Expired)</span>}
          </p>
        ) : (
           <p className="text-gray-400 text-sm">No deadline</p>
        )}
      </div>
      <div className="flex gap-4 mt-auto pt-3 border-t border-gray-100">
        <Link href={`/jobs/${job.slug || job.id}`} className="text-sm text-blue-700 hover:underline">
          View details
        </Link>
        {job.apply_link && (
          <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">
            Apply
          </a>
        )}
      </div>
    </div>
  )
}
