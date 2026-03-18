import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function createJob(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServer()

  const { data, error } = await supabase.from('jobs').insert({
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
  }).select()

  if (error) {
    console.error("INSERT ERROR: ", error)
    throw new Error(`Failed to create job: ${error.message}`)
  }

  redirect('/admin/jobs')
}

export default function NewJobPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/jobs" className="text-gray-500 hover:text-gray-700">← Back</Link>
        <h1 className="text-3xl font-bold text-gray-800">Add New Job</h1>
      </div>

      <form action={createJob} className="space-y-8 max-w-4xl">

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">📋 Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input name="title" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. SSC CGL 2026 Recruitment" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <input name="organization" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Staff Selection Commission" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Category</option>
                {['SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input name="location" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. All India" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advertisement No</label>
              <input name="advt_no" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 01/2026" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Vacancies</label>
              <input name="total_vacancies" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 2000" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Information</label>
              <textarea name="short_info" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Brief description about this job notification..." />
            </div>
          </div>
        </div>

        {/* Important Dates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">📅 Important Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'application_begin', label: 'Application Begin', type: 'date' },
              { name: 'last_date', label: 'Last Date Apply *', type: 'date', required: true },
              { name: 'last_date_fee', label: 'Last Date Fee', type: 'date' },
              { name: 'correction_date', label: 'Correction Date', type: 'text', placeholder: 'e.g. As per schedule' },
              { name: 'exam_date', label: 'Exam Date', type: 'text', placeholder: 'e.g. 19/06/2026' },
              { name: 'admit_card_date', label: 'Admit Card Date', type: 'text', placeholder: 'e.g. Before Exam' },
              { name: 'result_date', label: 'Result Date', type: 'text', placeholder: 'e.g. July 2026' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Application Fee */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">💰 Application Fee</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'fee_general', label: 'General / OBC / EWS', placeholder: 'e.g. ₹100' },
              { name: 'fee_sc_st', label: 'SC / ST / PH', placeholder: 'e.g. ₹0 (Exempted)' },
              { name: 'fee_female', label: 'All Category Female', placeholder: 'e.g. ₹0 (Nil)' },
              { name: 'fee_mode', label: 'Fee Payment Mode', placeholder: 'e.g. Online / Debit Card / UPI' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input name={field.name} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <input name="age_limit" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 18-30 Years" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Relaxation</label>
              <input name="age_relaxation" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. As per Govt rules" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility / Qualification</label>
              <textarea name="eligibility" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Graduation in any discipline from recognized university" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">How to Apply</label>
              <textarea name="how_to_apply" rows={4} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Step by step how to apply instructions..." />
            </div>
          </div>
        </div>

        {/* Important Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">🔗 Important Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'apply_link', label: 'Apply Online Link', placeholder: 'https://' },
              { name: 'notification_link', label: 'Notification PDF Link', placeholder: 'https://' },
              { name: 'video_link', label: 'Video Guide Link (YouTube)', placeholder: 'https://youtube.com/...' },
              { name: 'answer_key_link', label: 'Answer Key Link', placeholder: 'https://' },
              { name: 'admit_card_link', label: 'Admit Card Link', placeholder: 'https://' },
              { name: 'result_link', label: 'Result Link', placeholder: 'https://' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input name={field.name} type="url" placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            ✅ Save Job
          </button>
          <Link href="/admin/jobs" className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
            Cancel
          </Link>
        </div>

      </form>
    </div>
  )
}
