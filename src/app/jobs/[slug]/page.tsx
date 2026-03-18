import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServer()
  const { data: job } = await supabase.from('jobs').select('title, short_info').eq('slug', slug).single()
  
  if (!job) return { title: 'Job Not Found | JP Study' }
  
  return {
    title: `${job.title} | JP Study`,
    description: job.short_info || 'Latest government job details on JP Study.'
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServer()
  const { data: job } = await supabase.from('jobs').select('*').eq('slug', slug).single()
  if (!job) notFound()

  // Fetch vacancies for this job
  const { data: vacancies } = await supabase.from('vacancies').select('*').eq('job_id', job.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link> {' / '}
        <Link href="/jobs" className="hover:text-blue-600">Jobs</Link> {' / '}
        <span className="text-gray-600">{job.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 mb-4 relative overflow-hidden">
        {/* Decorative top border color */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-700"></div>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-blue-700 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold">{job.category}</span>
          {job.total_vacancies && (
            <span className="bg-green-600 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold">{job.total_vacancies} Vacancies</span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">{job.title}</h1>
        {job.organization && <p className="text-gray-600 font-medium">{job.organization}</p>}
        {job.advt_no && <p className="text-gray-400 text-xs mt-1 font-mono uppercase">Advt. No: {job.advt_no}</p>}
        {job.short_info && <div className="text-slate-700 text-sm mt-4 bg-slate-50 p-4 border border-slate-200 rounded-sm italic leading-relaxed">{job.short_info}</div>}
      </div>

      {/* Important Dates */}
      <Section title="📅 Important Dates">
        <DateTable rows={[
          ['Application Begin', job.application_begin ? new Date(job.application_begin).toLocaleDateString('en-IN') : null],
          ['Last Date to Apply', job.last_date ? new Date(job.last_date).toLocaleDateString('en-IN') : null],
          ['Last Date (Fee)', job.last_date_fee ? new Date(job.last_date_fee).toLocaleDateString('en-IN') : null],
          ['Correction Date', job.correction_date],
          ['Exam Date', job.exam_date],
          ['Admit Card', job.admit_card_date],
          ['Result Date', job.result_date],
        ]} />
      </Section>

      {/* Fee Details */}
      <Section title="💳 Application Fee">
        <DateTable rows={[
          ['General / OBC / EWS', job.fee_general],
          ['SC / ST', job.fee_sc_st],
          ['Female', job.fee_female],
          ['Payment Mode', job.fee_mode],
        ]} />
      </Section>

      {/* Vacancies Table */}
      {vacancies && vacancies.length > 0 && (
        <Section title="📊 Post-wise Vacancies">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2 text-left">Post Name</th>
                  <th className="px-4 py-2 text-left">Total Posts</th>
                  <th className="px-4 py-2 text-left">Eligibility</th>
                  <th className="px-4 py-2 text-left">Age Limit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {vacancies.map((v, i) => (
                  <tr key={v.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{v.post_name}</td>
                    <td className="px-4 py-2 font-semibold text-blue-700">{v.total_posts}</td>
                    <td className="px-4 py-2 text-gray-600">{v.eligibility || '—'}</td>
                    <td className="px-4 py-2 text-gray-600">{v.age_limit || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* Age Limit */}
      {(job.age_limit || job.age_relaxation) && (
        <Section title="🎂 Age Limit">
          <DateTable rows={[
            ['Age Limit', job.age_limit],
            ['Age Relaxation', job.age_relaxation],
          ]} />
        </Section>
      )}

      {/* Eligibility */}
      {job.eligibility && (
        <Section title="🎓 Eligibility">
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.eligibility}</p>
        </Section>
      )}

      {/* How to Apply */}
      {job.how_to_apply && (
        <Section title="📋 How to Apply">
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{job.how_to_apply}</p>
        </Section>
      )}

      {/* Links */}
      <Section title="🔗 Important Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: '📄 Apply Online', href: job.apply_link, color: 'bg-blue-600 hover:bg-blue-700' },
            { label: '📰 Official Notification', href: job.notification_link, color: 'bg-red-600 hover:bg-red-700' },
            { label: '🎟️ Admit Card', href: job.admit_card_link, color: 'bg-yellow-600 hover:bg-yellow-700' },
            { label: '📊 Result', href: job.result_link, color: 'bg-green-600 hover:bg-green-700' },
            { label: '🔑 Answer Key', href: job.answer_key_link, color: 'bg-purple-600 hover:bg-purple-700' },
            { label: '🎥 Video Guide', href: job.video_link, color: 'bg-pink-600 hover:bg-pink-700' },
          ].filter(l => l.href).map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className={`${link.color} text-white text-sm font-medium py-2.5 px-4 rounded-lg text-center transition`}>
              {link.label}
            </a>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-sm border border-gray-200 shadow-sm mb-6 overflow-hidden">
      <h2 className="text-sm font-bold bg-slate-100 border-b border-gray-200 px-5 py-3 text-slate-800 uppercase tracking-widest">{title}</h2>
      <div className="p-6">{children}</div>
    </div>
  )
}

function DateTable({ rows }: { rows: [string, string | null | undefined][] }) {
  const filtered = rows.filter(([, v]) => v)
  if (!filtered.length) return <p className="text-gray-400 text-sm">Not available</p>
  return (
    <table className="w-full text-sm">
      <tbody className="divide-y divide-gray-50">
        {filtered.map(([label, value]) => (
          <tr key={label}>
            <td className="py-2 pr-4 text-gray-500 font-medium w-48">{label}</td>
            <td className="py-2 text-gray-800">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
