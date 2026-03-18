import Link from 'next/link'
import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  // Only redirect if NOT on login page
  // proxy.ts handles this but layout also needs this check
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {user ? (
        <>
          {/* Sidebar — only show when logged in */}
          <aside className="w-64 bg-blue-900 text-white flex flex-col shrink-0">
            <div className="p-6 border-b border-blue-800">
              <h1 className="text-xl font-bold">JP GK Study</h1>
              <p className="text-blue-300 text-xs mt-1">Admin Panel</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                📊 Dashboard
              </Link>
              <Link href="/admin/jobs" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                💼 Jobs
              </Link>
              <Link href="/admin/results" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                📋 Results
              </Link>
              <Link href="/admin/schemes" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                🏛️ Schemes
              </Link>
              <Link href="/admin/syllabus" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                📚 Syllabus
              </Link>
              <Link href="/admin/blog" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                📝 Blog
              </Link>
              <Link href="/admin/updates" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium">
                🔔 Updates Ticker
              </Link>
              <div className="border-t border-blue-800 pt-2 mt-2">
                <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-800 transition text-sm font-medium text-blue-300">
                  🌐 View Site
                </Link>
              </div>
            </nav>
            <div className="p-4 border-t border-blue-800">
              <p className="text-blue-300 text-xs mb-3 truncate">{user.email}</p>
              <form action={async () => {
                'use server'
                const supabase = await createSupabaseServer()
                await supabase.auth.signOut()
                redirect('/admin/login')
              }}>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition font-medium">
                  Logout
                </button>
              </form>
            </div>
          </aside>
          <main className="flex-1 overflow-auto">{children}</main>
        </>
      ) : (
        // Login page — no sidebar
        <main className="flex-1">{children}</main>
      )}
    </div>
  )
}
