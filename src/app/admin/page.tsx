// src/app/admin/page.tsx
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer()

  // Fetch counts from your tables
  const [{ count: jobsCount }, { count: resultsCount }, { count: schemesCount }, { count: blogCount }, { count: syllabusCount }] =
    await Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('results').select('*', { count: 'exact', head: true }),
      supabase.from('schemes').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('syllabus').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    { label: 'Total Jobs', count: jobsCount ?? 0, icon: '💼', href: '/admin/jobs' },
    { label: 'Results', count: resultsCount ?? 0, icon: '📋', href: '/admin/results' },
    { label: 'Schemes', count: schemesCount ?? 0, icon: '🏛️', href: '/admin/schemes' },
    { label: 'Blog Posts', count: blogCount ?? 0, icon: '📝', href: '/admin/blog' },
    { label: 'Syllabus', count: syllabusCount ?? 0, icon: '📚', href: '/admin/syllabus' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <a key={stat.label} href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-blue-700">{stat.count}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
