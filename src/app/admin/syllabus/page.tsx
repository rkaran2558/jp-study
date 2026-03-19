'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMPTY = { title: '', exam_name: '', slug: '', file_link: '' }
type Syllabus = typeof EMPTY & { id?: number }

export default function AdminSyllabusPage() {
  const [items, setItems] = useState<Syllabus[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Syllabus | null>(null)
  const [form, setForm] = useState<Syllabus>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('syllabus').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() { setEditItem(null); setForm({ ...EMPTY }); setShowForm(true) }
  function openEdit(item: Syllabus) { setEditItem(item); setForm({ ...item }); setShowForm(true) }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm(f => ({ ...f, title, slug }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    // Clean payload (empty strings to null)
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    )

    let result;
    if (editItem?.id) {
      const { id, ...updateData } = payload
      result = await supabase.from('syllabus').update(updateData).eq('id', editItem.id)
    } else {
      result = await supabase.from('syllabus').insert(payload)
    }
    
    setSaving(false)

    if (result.error) {
      alert(`Error saving syllabus: ${result.error.message}`)
      return
    }

    setShowForm(false)
    fetchData()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this syllabus?')) return
    await supabase.from('syllabus').delete().eq('id', id)
    fetchData()
  }

  const filtered = items.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.exam_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📚 Syllabus PDFs</h1>
          <p className="text-gray-500 text-sm">{items.length} total records</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
          + Add Syllabus
        </button>
      </div>

      <input type="text" placeholder="Search by title or exam name..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm" />

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Exam Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">PDF File</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No syllabus found</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.exam_name ? <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">{item.exam_name}</span> : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {item.file_link
                      ? <a href={item.file_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium">Download PDF</a>
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 transition">Edit</button>
                    <button onClick={() => handleDelete(item.id!)} className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editItem ? 'Edit Syllabus' : 'Add Syllabus Document'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                <input type="text" name="title" value={form.title ?? ''}
                  onChange={handleTitleChange} required placeholder="e.g. SSC CGL 2026 Tier-1 Syllabus"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">SEO Slug (Auto-generated)</label>
                <input type="text" name="slug" value={form.slug ?? ''}
                  onChange={handleChange} placeholder="ssc-cgl-2026-tier-1-syllabus"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Exam Name / Category</label>
                <input type="text" name="exam_name" value={form.exam_name ?? ''}
                  onChange={handleChange} placeholder="e.g. SSC CGL"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">File / PDF Link URL</label>
                <input type="url" name="file_link" value={form.file_link ?? ''}
                  onChange={handleChange} placeholder="https://..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition shadow-sm">
                  {saving ? 'Saving...' : editItem ? 'Update Syllabus' : 'Save Syllabus'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 border border-gray-300 bg-white font-semibold text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition shadow-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
