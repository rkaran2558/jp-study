import { supabase } from '@/lib/supabase'
import UpdatesTicker from '@/components/UpdatesTicker'
import Link from 'next/link'

export const revalidate = 0 // Opt out of static caching

export default async function Home() {
  const [{ data: jobs }, { data: results }, { data: admitCards }, { data: syllabi }, { data: answerKeys }, { data: blogs }] = await Promise.all([
    supabase.from('jobs').select('id, title, slug, last_date').order('created_at', { ascending: false }).limit(15),
    supabase.from('results').select('id, title, pdf_link').order('date', { ascending: false }).limit(15),
    supabase.from('jobs').select('id, title, slug, admit_card_link').not('admit_card_link', 'is', null).order('created_at', { ascending: false }).limit(15),
    supabase.from('syllabus').select('id, title, file_link').order('created_at', { ascending: false }).limit(10),
    supabase.from('schemes').select('id, title, slug').order('created_at', { ascending: false }).limit(10),
    supabase.from('blogs').select('id, title, slug, category').eq('published', true).order('created_at', { ascending: false }).limit(10)
  ])

  return (
    <div>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6">

        {/* Sarkari Result Signature 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* Column 1: Latest Jobs */}

          <div className="border border-blue-800 rounded-sm bg-white shadow-sm flex flex-col h-full">
            <div className="bg-blue-700 text-white font-bold p-2 text-center text-xl tracking-wide shrink-0">
              Latest Jobs
            </div>
            <ul className="divide-y divide-gray-200 flex-1">
              {jobs?.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">No new jobs</li>}
              {jobs?.map((j: any) => {
                const isNew = new Date(j.last_date) > new Date();
                return (
                  <li key={`job-${j.id}`} className="hover:bg-gray-50">
                    <Link href={`/jobs/${j.slug || j.id}`} className="block p-2 text-center text-blue-800 hover:text-red-700 font-medium text-[15px] leading-tight transition-colors">
                      {j.title} {isNew && <span className="text-red-500 text-xs ml-1 font-bold animate-pulse">New</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="p-2 bg-gray-100 text-center border-t border-gray-300 shrink-0 mt-auto">
              <Link href="/jobs" className="text-red-700 hover:underline text-sm font-bold">View More</Link>
            </div>
          </div>


          {/* Column 2: Admit Card (Green Header) */}
          <div className="border border-green-800 rounded-sm bg-white shadow-sm flex flex-col h-full">
            <div className="bg-green-700 text-white font-bold p-2 text-center text-xl tracking-wide shrink-0">
              Admit Card
            </div>
            <ul className="divide-y divide-gray-200 flex-1">
              {admitCards?.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">No new admit cards</li>}
              {admitCards?.map((a: any) => (
                <li key={`admit-${a.id}`} className="hover:bg-gray-50">
                  <Link href={a.admit_card_link || `/jobs/${a.slug || a.id}`} className="block p-2 text-center text-blue-800 hover:text-red-700 font-medium text-[15px] leading-tight transition-colors">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 bg-gray-100 text-center border-t border-gray-300 shrink-0 mt-auto">
              <Link href="/admit-cards" className="text-red-700 hover:underline text-sm font-bold">View More</Link>
            </div>
          </div>

          {/* Column 3: Result */}
          <div className="border border-red-800 rounded-sm bg-white shadow-sm flex flex-col h-full">
            <div className="bg-red-700 text-white font-bold p-2 text-center text-xl tracking-wide shrink-0">
              Result
            </div>
            <ul className="divide-y divide-gray-200 flex-1">
              {results?.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">No new results</li>}
              {results?.map((r: any) => (
                <li key={r.id} className="hover:bg-gray-50">
                  <Link href={r.pdf_link || '#'} className="block p-2 text-center text-blue-800 hover:text-red-700 font-medium text-[15px] leading-tight transition-colors">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 bg-gray-100 text-center border-t border-gray-300 shrink-0 mt-auto">
              <Link href="/results" className="text-red-700 hover:underline text-sm font-bold">View More</Link>
            </div>
          </div>



        </div>

        {/* Lower 2-Column Section: Syllabus & Answer Key/Schemes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">

          {/* Syllabus (Gray Header) */}
          <div className="border border-slate-700 rounded-sm bg-white shadow-sm flex flex-col h-full">
            <div className="bg-slate-700 text-white font-bold p-2 text-center text-xl tracking-wide shrink-0">
              Syllabus
            </div>
            <ul className="divide-y divide-gray-200 flex-1">
              {syllabi?.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">No new syllabus</li>}
              {syllabi?.map((s: any) => (
                <li key={`syl-${s.id}`} className="hover:bg-gray-50">
                  <Link href={s.file_link || '#'} className="block p-2 text-center text-blue-800 hover:text-red-700 font-medium text-[15px] leading-tight transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 bg-gray-100 text-center border-t border-gray-300 shrink-0 mt-auto">
              <Link href="/syllabus" className="text-red-700 hover:underline text-sm font-bold">View More</Link>
            </div>
          </div>

          {/* Schemes (Orange Header) */}
          <div className="border border-orange-700 rounded-sm bg-white shadow-sm flex flex-col h-full">
            <div className="bg-orange-600 text-white font-bold p-2 text-center text-xl tracking-wide shrink-0">
              Government Schemes
            </div>
            <ul className="divide-y divide-gray-200 flex-1">
              {answerKeys?.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">No new schemes</li>}
              {answerKeys?.map((k: any) => (
                <li key={`scm-${k.id}`} className="hover:bg-gray-50">
                  <Link href={`/schemes/${k.slug || k.id}`} className="block p-2 text-center text-blue-800 hover:text-red-700 font-medium text-[15px] leading-tight transition-colors">
                    {k.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-2 bg-gray-100 text-center border-t border-gray-300 shrink-0 mt-auto">
              <Link href="/schemes" className="text-red-700 hover:underline text-sm font-bold">View More</Link>
            </div>
          </div>

        </div>

        {/* Blog / Study Material Section */}
        <div className="border border-purple-800 rounded-sm bg-white shadow-sm flex flex-col h-full mt-2">
          <div className="bg-purple-700 text-white font-bold p-2 text-center text-xl tracking-wide shrink-0">
            Latest Articles & Study Material
          </div>
          <ul className="divide-y divide-gray-200">
            {blogs?.length === 0 && <li className="p-4 text-center text-gray-400 text-sm">No new articles</li>}
            {blogs?.map((b: any) => (
              <li key={`blog-${b.id}`} className="hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between p-2.5 gap-2">
                <Link href={`/blog/${b.slug || b.id}`} className="text-blue-800 hover:text-red-700 font-medium text-[15px] leading-tight transition-colors">
                  {b.title}
                </Link>
                <span className="text-[10px] text-purple-700 bg-purple-100 font-bold uppercase tracking-widest px-2 py-0.5 rounded whitespace-nowrap">
                  {b.category || 'Article'}
                </span>
              </li>
            ))}
          </ul>
          <div className="p-2 bg-gray-100 text-center border-t border-gray-300 shrink-0 mt-auto">
            <Link href="/blog" className="text-red-700 hover:underline text-sm font-bold">View All Articles</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
