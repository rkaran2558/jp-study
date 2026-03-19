'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMPTY = { text: '', link: '', is_active: true }
type Update = typeof EMPTY & { id?: number }

export default function AdminUpdatesPage() {
  const [items, setItems] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Update | null>(null)
  const [form, setForm] = useState<Update>({ ...EMPTY })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('updates').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() { setEditItem(null); setForm({ ...EMPTY }); setShowForm(true) }
  function openEdit(item: Update) { setEditItem(item); setForm({ ...item }); setShowForm(true) }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
    )

    let result;
    if (editItem?.id) {
      const { id, ...updateData } = payload
      result = await supabase.from('updates').update(updateData).eq('id', editItem.id)
    } else {
      result = await supabase.from('updates').insert(payload)
    }
    
    setSaving(false)

    if (result.error) {
      alert(`Error saving update: ${result.error.message}`)
      return
    }

    setShowForm(false)
    fetchData()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this update?')) return
    await supabase.from('updates').delete().eq('id', id)
    fetchData()
  }

  async function toggleActive(item: Update) {
    await supabase.from('updates').update({ is_active: !item.is_active }).eq('id', item.id!)
    fetchData()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🔔 Updates Ticker</h1>
          <p className="text-gray-500 text-sm">{items.length} total · {items.filter(i => i.is_active).length} active</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Update
        </button>
      </div>

      {/* Live Preview */}
      {items.filter(i => i.is_active).length > 0 && (
        <div className="bg-blue-900 text-white text-sm px-4 py-2.5 rounded-lg mb-6 overflow-hidden">
          <span className="font-bold mr-3">🔔 Live Ticker Preview:</span>
          {items.filter(i => i.is_active).map(i => i.text).join('  •  ')}
        </div>
      )}

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-xl border">No updates yet</div>
          ) : items.map(item => (
            <div key={item.id}
              className={`bg-white rounded-xl border px-4 py-3 flex items-center gap-3 ${!item.is_active ? 'opacity-50' : ''}`}>
              <button onClick={() => toggleActive(item)}
                className={`w-10 h-5 rounded-full transition flex-shrink-0 relative ${item.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.is_active ? 'left-5' : 'left-0.5'}`} />
              </button>
              <p className="flex-1 text-sm text-gray-800 truncate">{item.text}</p>
              {item.link && (
                <a href={item.link} target="_blank" className="text-blue-500 text-xs hover:underline flex-shrink-0">Link ↗</a>
              )}
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50">Edit</button>
                <button onClick={() => handleDelete(item.id!)} className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editItem ? 'Edit Update' : 'Add Update'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Text *</label>
                <input type="text" name="text" value={form.text} onChange={handleChange} required
                  placeholder="e.g. SSC CGL 2025 Notification Released!"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Link (optional)</label>
                <input type="text" name="link" value={form.link ?? ''} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}
                  className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700 font-medium">Show in ticker</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                  {saving ? 'Saving...' : editItem ? 'Update' : 'Add Update'}
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
