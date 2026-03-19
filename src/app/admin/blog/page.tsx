'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EMPTY = {
  title: '', slug: '', category: '', content: '',
  summary: '', thumbnail_url: '', author: '', published: false,
}
type Blog = typeof EMPTY & { id?: number }

export default function AdminBlogPage() {
  const [items, setItems] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Blog | null>(null)
  const [form, setForm] = useState<Blog>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() { setEditItem(null); setForm({ ...EMPTY }); setShowForm(true) }
  function openEdit(item: Blog) { setEditItem(item); setForm({ ...item }); setShowForm(true) }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
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
      const { id, ...updateData } = payload
      result = await supabase.from('blogs').update(updateData).eq('id', editItem.id)
    } else {
      result = await supabase.from('blogs').insert(payload)
    }
    
    setSaving(false)

    if (result.error) {
      alert(`Error saving blog: ${result.error.message}`)
      return
    }

    setShowForm(false)
    fetchData()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this blog post?')) return
    await supabase.from('blogs').delete().eq('id', id)
    fetchData()
  }

  async function togglePublish(item: Blog) {
    await supabase.from('blogs').update({ published: !item.published }).eq('id', item.id!)
    fetchData()
  }

  const filtered = items.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.author?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📝 Blog</h1>
          <p className="text-gray-500 text-sm">{items.length} total · {items.filter(i => i.published).length} published</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Add Post
        </button>
      </div>

      <input type="text" placeholder="Search by title or author..."
        value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />

      {loading ? <div className="text-center py-12 text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Author</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No posts found</td></tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{item.category || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.author || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(item)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                        item.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                      {item.published ? '✅ Published' : '⏸ Draft'}
                    </button>
                  </td>
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
              <h2 className="text-lg font-bold">{editItem ? 'Edit Post' : 'Add Blog Post'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input type="text" name="title" value={form.title} onChange={handleTitleChange} required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                <input type="text" name="slug" value={form.slug} onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
              </div>
              {[
                { label: 'Category', name: 'category', placeholder: 'e.g. Govt Jobs, Tips, News' },
                { label: 'Author', name: 'author', placeholder: 'e.g. Admin' },
                { label: 'Thumbnail URL', name: 'thumbnail_url', placeholder: 'https://...' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type="text" name={f.name} value={(form as any)[f.name] ?? ''} onChange={handleChange} placeholder={f.placeholder}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
                <textarea name="summary" value={form.summary ?? ''} onChange={handleChange} rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                <textarea name="content" value={form.content ?? ''} onChange={handleChange} rows={8}
                  placeholder="Write your blog content here (supports HTML or Markdown)..."
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" checked={form.published} onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm text-gray-700 font-medium">Publish immediately</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition">
                  {saving ? 'Saving...' : editItem ? 'Update Post' : 'Add Post'}
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
