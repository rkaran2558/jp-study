'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMPTY_JOB = {
  title: '', organization: '', advt_no: '', category: '', location: '', slug: '',
  short_info: '', description: '', eligibility: '', age_limit: '', age_relaxation: '',
  total_vacancies: '', application_begin: '', last_date: '', last_date_fee: '',
  exam_date: '', admit_card_date: '', result_date: '', correction_date: '',
  fee_general: '', fee_sc_st: '', fee_female: '', fee_mode: '',
  apply_link: '', notification_link: '', answer_key_link: '',
  admit_card_link: '', result_link: '', video_link: '', how_to_apply: '',
}

type Job = typeof EMPTY_JOB & { id?: number }

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [form, setForm] = useState<Job>({ ...EMPTY_JOB })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    setLoading(true)
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditJob(null)
    setForm({ ...EMPTY_JOB })
    setShowForm(true)
  }

  function openEdit(job: Job) {
    setEditJob(job)
    setForm({ ...job })
    setShowForm(true)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Auto-generate slug from title
  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm(f => ({ ...f, title, slug }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    // Clean payload: DB expects null for empty dates/numeric fields, not empty strings
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    )

    let result;
    if (editJob?.id) {
      const { id, ...updateData } = payload
      result = await supabase.from('jobs').update(updateData).eq('id', editJob.id)
    } else {
      result = await supabase.from('jobs').insert(payload)
    }
    
    setSaving(false)

    if (result.error) {
      alert(`Error saving job: ${result.error.message}`)
      return
    }

    setShowForm(false)
    fetchJobs()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this job?')) return
    await supabase.from('jobs').delete().eq('id', id)
    fetchJobs()
  }

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.organization?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">💼 Jobs</h1>
          <p className="text-gray-500 text-sm">{jobs.length} total records</p>
        </div>
        <button onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add New Job
        </button>
      </div>

      {/* Search */}
      <input
        type="text" placeholder="Search by title or organization..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Organization</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Last Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Vacancies</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No jobs found</td></tr>
              ) : filtered.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{job.title}</td>
                  <td className="px-4 py-3 text-gray-600">{job.organization || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{job.category || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {job.last_date ? new Date(job.last_date).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{job.total_vacancies || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(job)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(job.id!)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-over Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />

          {/* Panel */}
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Form Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">{editJob ? 'Edit Job' : 'Add New Job'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6 flex-1">

              {/* Basic Info */}
              <Section title="📌 Basic Info">
                <Field label="Job Title *" name="title" value={form.title} onChange={handleTitleChange} required />
                <Field label="Slug" name="slug" value={form.slug} onChange={handleChange} />
                <Field label="Organization" name="organization" value={form.organization} onChange={handleChange} />
                <Field label="Advt. No." name="advt_no" value={form.advt_no} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <select name="category" value={form.category ?? ''} onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select...</option>
                      {['SSC','UPSC','Railway','Bank','State PSC','Defence','Teaching','Other'].map(c =>
                        <option key={c} value={c}>{c}</option>
                      )}
                    </select>
                  </div>
                  <Field label="Location" name="location" value={form.location} onChange={handleChange} />
                </div>
                <Field label="Total Vacancies" name="total_vacancies" value={form.total_vacancies} onChange={handleChange} />
              </Section>

              {/* Important Dates */}
              <Section title="📅 Important Dates">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Application Begin" name="application_begin" type="date" value={form.application_begin} onChange={handleChange} />
                  <Field label="Last Date (Apply)" name="last_date" type="date" value={form.last_date ? form.last_date.split('T')[0] : ''} onChange={handleChange} />
                  <Field label="Last Date (Fee)" name="last_date_fee" type="date" value={form.last_date_fee} onChange={handleChange} />
                  <Field label="Correction Date" name="correction_date" value={form.correction_date} onChange={handleChange} placeholder="e.g. 15 Mar 2025" />
                  <Field label="Exam Date" name="exam_date" value={form.exam_date} onChange={handleChange} placeholder="e.g. April 2025" />
                  <Field label="Admit Card Date" name="admit_card_date" value={form.admit_card_date} onChange={handleChange} />
                  <Field label="Result Date" name="result_date" value={form.result_date} onChange={handleChange} />
                </div>
              </Section>

              {/* Fee */}
              <Section title="💳 Fee Details">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="General Fee" name="fee_general" value={form.fee_general} onChange={handleChange} placeholder="e.g. ₹100" />
                  <Field label="SC/ST Fee" name="fee_sc_st" value={form.fee_sc_st} onChange={handleChange} />
                  <Field label="Female Fee" name="fee_female" value={form.fee_female} onChange={handleChange} />
                </div>
                <Field label="Fee Payment Mode" name="fee_mode" value={form.fee_mode} onChange={handleChange} placeholder="e.g. Online / No Fee" />
              </Section>

              {/* Eligibility */}
              <Section title="🎓 Eligibility & Age">
                <TextArea label="Eligibility" name="eligibility" value={form.eligibility} onChange={handleChange} rows={3} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age Limit" name="age_limit" value={form.age_limit} onChange={handleChange} placeholder="e.g. 18-30 years" />
                  <Field label="Age Relaxation" name="age_relaxation" value={form.age_relaxation} onChange={handleChange} />
                </div>
              </Section>

              {/* Content */}
              <Section title="📝 Content">
                <TextArea label="Short Info" name="short_info" value={form.short_info} onChange={handleChange} rows={2} />
                <TextArea label="Description" name="description" value={form.description} onChange={handleChange} rows={4} />
                <TextArea label="How to Apply" name="how_to_apply" value={form.how_to_apply} onChange={handleChange} rows={3} />
              </Section>

              {/* Links */}
              <Section title="🔗 Links">
                <Field label="Apply Link" name="apply_link" value={form.apply_link} onChange={handleChange} placeholder="https://..." />
                <Field label="Notification PDF Link" name="notification_link" value={form.notification_link} onChange={handleChange} placeholder="https://..." />
                <Field label="Answer Key Link" name="answer_key_link" value={form.answer_key_link} onChange={handleChange} placeholder="https://..." />
                <Field label="Admit Card Link" name="admit_card_link" value={form.admit_card_link} onChange={handleChange} placeholder="https://..." />
                <Field label="Result Link" name="result_link" value={form.result_link} onChange={handleChange} placeholder="https://..." />
                <Field label="Video Link (YouTube)" name="video_link" value={form.video_link} onChange={handleChange} placeholder="https://youtube.com/..." />
              </Section>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                  {saving ? 'Saving...' : editJob ? 'Update Job' : 'Add Job'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Reusable sub-components ──────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }:
  { label: string; name: string; value: string; onChange: any; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type={type} name={name} value={value ?? ''} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}

function TextArea({ label, name, value, onChange, rows = 3, placeholder = '' }:
  { label: string; name: string; value: string; onChange: any; rows?: number; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
    </div>
  )
}
