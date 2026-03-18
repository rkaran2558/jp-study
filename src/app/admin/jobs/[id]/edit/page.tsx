import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

async function updateJob(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServer()
  const id = formData.get('id')

  await supabase.from('jobs').update({
    title: formData.get('title'),
    organization: formData.get('organization'),
    category: formData.get('category'),
    location: formData.get('location'),
    advt_no: formData.get('advt_no'),
    short_info: formData.get('short_info'),
    total_vacancies: formData.get('total_vacancies'),
    application_begin: formData.get('application_begin') || null,
    last_date: formData.get('last_date'),
    last_date_fee: formData.get('last_date_fee') || null,
    correction_date: formData.get('correction_date') || null,
    exam_date: formData.get('exam_date') || null,
    admit_card_date: formData.get('admit_card_date') || null,
    result_date: formData.get('result_date') || null,
    fee_general: formData.get('fee_general') || null,
    fee_sc_st: formData.get('fee_sc_st') || null,
    fee_female: formData.get('fee_female') || null,
    fee_mode: formData.get('fee_mode') || null,
    age_limit: formData.get('age_limit') || null,
    age_relaxation: formData.get('age_relaxation') || null,
    eligibility: formData.get('eligibility') || null,
    how_to_apply: formData.get('how_to_apply') || null,
    apply_link: formData.get('apply_link') || null,
    notification_link: formData.get('notification_link') || null,
    video_link: formData.get('video_link') || null,
    answer_key_link: formData.get('answer_key_link') || null,
    admit_card_link: formData.get('admit_card_link') || null,
    result_link: formData.get('result_link') || null,
  }).eq('id', id)

  redirect('/admin/jobs')
}

async function addVacancy(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServer()
  const jobId = formData.get('job_id')

  await supabase.from('vacancies').insert({
    job_id: jobId,
    post_name: formData.get('post_name'),
    total_posts: formData.get('total_posts'),
    eligibility: formData.get('eligibility'),
    age_limit: formData.get('age_limit') || null,
  })

  redirect(`/admin/jobs/${jobId}/edit`)
}

async function deleteVacancy(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServer()
  const id = formData.get('id')
  const jobId = formData.get('job_id')
  await supabase.from('vacancies').delete().eq('id', id)
  redirect(`/admin/jobs/${jobId}/edit`)
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServer()

  const [{ data: job }, { data: vacancies }] = await Promise.all([
    supabase.from('jobs').select('*').eq('id', id).single(),
    supabase.from('vacancies').select('*').eq('job_id', id)
  ])

  if (!job) notFound()

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/jobs" className="text-gray-500 hover:text-gray-700">← Back</Link>
        <h1 className="text-3xl font-bold text-gray-800">Edit Job</h1>
      </div>

      <form action={updateJob} className="space-y-8 max-w-4xl">
        <input type="hidden" name="id" value={job.id} />

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">📋 Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input name="title" required defaultValue={job.title} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <input name="organization" defaultValue={job.organization ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" required defaultValue={job.category} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input name="location" defaultValue={job.location ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advertisement No</label>
              <input name="advt_no" defaultValue={job.advt_no ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Vacancies</label>
              <input name="total_vacancies" defaultValue={job.total_vacancies ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Information</label>
              <textarea name="short_info" rows={3} defaultValue={job.short_info ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">📅 Important Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'application_begin', label: 'Application Begin', type: 'date', value: job.application_begin?.split('T')[0] ?? '' },
              { name: 'last_date', label: 'Last Date Apply *', type: 'date', value: job.last_date?.split('T')[0] ?? '', required: true },
              { name: 'last_date_fee', label: 'Last Date Fee', type: 'date', value: job.last_date_fee?.split('T')[0] ?? '' },
              { name: 'correction_date', label: 'Correction Date', type: 'text', value: job.correction_date ?? '' },
              { name: 'exam_date', label: 'Exam Date', type: 'text', value: job.exam_date ?? '' },
              { name: 'admit_card_date', label: 'Admit Card Date', type: 'text', value: job.admit_card_date ?? '' },
              { name: 'result_date', label: 'Result Date', type: 'text', value: job.result_date ?? '' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input name={field.name} type={field.type} required={field.required} defaultValue={field.value} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Fee */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">💰 Application Fee</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'fee_general', label: 'General / OBC / EWS', value: job.fee_general ?? '' },
              { name: 'fee_sc_st', label: 'SC / ST / PH', value: job.fee_sc_st ?? '' },
              { name: 'fee_female', label: 'All Category Female', value: job.fee_female ?? '' },
              { name: 'fee_mode', label: 'Fee Payment Mode', value: job.fee_mode ?? '' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input name={field.name} defaultValue={field.value} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Age + Eligibility */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">🎓 Age & Eligibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Limit</label>
              <input name="age_limit" defaultValue={job.age_limit ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Relaxation</label>
              <input name="age_relaxation" defaultValue={job.age_relaxation ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
              <textarea name="eligibility" rows={3} defaultValue={job.eligibility ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">How to Apply</label>
              <textarea name="how_to_apply" rows={4} defaultValue={job.how_to_apply ?? ''} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">🔗 Important Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'apply_link', label: 'Apply Online Link', value: job.apply_link ?? '' },
              { name: 'notification_link', label: 'Notification PDF Link', value: job.notification_link ?? '' },
              { name: 'video_link', label: 'Video Guide Link', value: job.video_link ?? '' },
              { name: 'answer_key_link', label: 'Answer Key Link', value: job.answer_key_link ?? '' },
              { name: 'admit_card_link', label: 'Admit Card Link', value: job.admit_card_link ?? '' },
              { name: 'result_link', label: 'Result Link', value: job.result_link ?? '' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input name={field.name} defaultValue={field.value} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            ✅ Update Job
          </button>
          <Link href="/admin/jobs" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
            Cancel
          </Link>
        </div>
      </form>

      {/* Vacancy Manager */}
      <div className="max-w-4xl mt-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">📋 Vacancy Details</h2>

          {/* Existing vacancies */}
          {vacancies && vacancies.length > 0 && (
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Post Name</th>
                    <th className="px-4 py-2 text-center text-gray-600">Total Posts</th>
                    <th className="px-4 py-2 text-left text-gray-600">Eligibility</th>
                    <th className="px-4 py-2 text-left text-gray-600">Age Limit</th>
                    <th className="px-4 py-2 text-center text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vacancies.map((v: any) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{v.post_name}</td>
                      <td className="px-4 py-2 text-center text-blue-600 font-bold">{v.total_posts}</td>
                      <td className="px-4 py-2 text-gray-600">{v.eligibility}</td>
                      <td className="px-4 py-2 text-gray-600">{v.age_limit ?? '-'}</td>
                      <td className="px-4 py-2 text-center">
                        <form action={deleteVacancy}>
                          <input type="hidden" name="id" value={v.id} />
                          <input type="hidden" name="job_id" value={id} />
                          <button type="submit" className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200">
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add new vacancy */}
          <form action={addVacancy}>
            <input type="hidden" name="job_id" value={id} />
            <p className="text-sm font-semibold text-gray-700 mb-3">+ Add Vacancy Row</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input name="post_name" required placeholder="Post Name *" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="total_posts" placeholder="Total Posts" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="eligibility" placeholder="Eligibility" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input name="age_limit" placeholder="Age Limit" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">
              + Add Row
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
