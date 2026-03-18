'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMPTY = {
  title: '', slug: '', category: '', short_info: '',
  description: '', benefits: '', eligibility: '',
  apply_link: '', notification_link: '',
}
type Scheme = typeof EMPTY & { id?: number }

export default function AdminSchemesPage() {
  const [items, setItems] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Scheme | null>(null)
  const [form, setForm] = useState<Scheme>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('schemes').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() { setEditItem(null); setForm({ ...EMPTY }); setShowForm(true) }
  function openEdit(item: Scheme) { setEditItem(item); setForm({ ...item }); setShowForm(true) }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    )

    let result;
    if (editItem?.id) {
      result = await supabase.from('schemes').update(payload).eq('id', editItem.id)
    } else {
      result = await supabase.from('schemes').insert(payload)
    }
    
    setSaving(false)

    if (result.error) {
      alert(`Error saving scheme: ${result.error.message}`)
      return
    }

    setShowForm(false)
    fetchData()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this scheme?')) return
    await supabase.from('schemes').delete().eq('id', id)
    fetchData()
  }

  const filtered = items.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏛️ Schemes</h1>
          <p className="text-gray-500 text-sm">{items.length} total records</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Scheme
        </button>
      </div>

      <input type="text" placeholder="Search by title or category..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No schemes found</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{item.category || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{item.slug || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                    <button onClick={() => handleDelete(item.id!)} className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50">Delete</button>
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
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editItem ? 'Edit Scheme' : 'Add Scheme'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1">
              <Field label="Title *" name="title" value={form.title} onChange={handleTitleChange} required />
              <Field label="Slug" name="slug" value={form.slug} onChange={handleChange} />
              <Field label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Education, Health, Women..." />
              <TextArea label="Short Info" name="short_info" value={form.short_info} onChange={handleChange} rows={2} />
              <TextArea label="Description" name="description" value={form.description} onChange={handleChange} rows={4} />
              <TextArea label="Benefits" name="benefits" value={form.benefits} onChange={handleChange} rows={3} />
              <TextArea label="Eligibility" name="eligibility" value={form.eligibility} onChange={handleChange} rows={3} />
              <Field label="Apply Link" name="apply_link" value={form.apply_link} onChange={handleChange} placeholder="https://..." />
              <Field label="Notification Link" name="notification_link" value={form.notification_link} onChange={handleChange} placeholder="https://..." />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                  {saving ? 'Saving...' : editItem ? 'Update Scheme' : 'Add Scheme'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, name, value, onChange, required = false, placeholder = '' }:
  { label: string; name: string; value: string; onChange: any; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input type="text" name={name} value={value ?? ''} onChange={onChange} required={required} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}

function TextArea({ label, name, value, onChange, rows = 3 }:
  { label: string; name: string; value: string; onChange: any; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
    </div>
  )
}
