import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createSupabaseServer()
  const { data: scheme } = await supabase
    .from('schemes').select('title, short_info').eq('slug', slug).single()
  return {
    title: scheme ? `${scheme.title} | JP GK Study` : 'Scheme Not Found',
    description: scheme?.short_info ?? 'Government scheme details'
  }
}

export default async function SchemeDetail({ params }: Props) {
  const { slug } = await params
  const supabase = await createSupabaseServer()
  const { data: scheme } = await supabase
    .from('schemes').select('*').eq('slug', slug).single()

  if (!scheme) notFound()
    
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <Link href="/schemes" className="text-orange-600 hover:underline text-sm mb-4 inline-block">
        ← Back to All Schemes
      </Link>

      {/* Top meta */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4 text-sm space-y-2">
        <div className="flex flex-wrap gap-2">
          <span className="text-red-600 font-bold">Scheme Name:</span>
          <span className="text-gray-800 font-medium">{scheme.title}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-red-600 font-bold">Posted On:</span>
          <span className="text-gray-700">
            {new Date(scheme.created_at).toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric'
            })}
          </span>
        </div>
        {scheme.short_info && (
          <div className="flex flex-wrap gap-2">
            <span className="text-red-600 font-bold">Short Information:</span>
            <span className="text-green-700 leading-relaxed">{scheme.short_info}</span>
          </div>
        )}
      </div>

      {/* Main box */}
      <div className="bg-white shadow-lg rounded-xl border-2 border-gray-300 overflow-hidden">

        {/* Header */}
        <div className="text-center p-6 border-b-2 border-gray-300">
          <p className="text-orange-500 font-bold text-sm mb-1">{scheme.category}</p>
          <h1 className="text-green-700 font-bold text-xl md:text-2xl leading-snug mb-1">
            {scheme.title}
          </h1>
          <p className="text-blue-700 font-bold text-sm mt-1">WWW.JPGKSTUDY.COM</p>
        </div>

        {/* Description */}
        {scheme.description && (
          <div className="border-b-2 border-gray-300">
            <div className="bg-gray-50 text-center font-bold py-2 text-sm text-green-700 border-b border-gray-300">
              About This Scheme
            </div>
            <div className="p-4 text-sm text-gray-700 leading-relaxed">
              {scheme.description}
            </div>
          </div>
        )}

        {/* Benefits + Eligibility — smart layout */}
        {(scheme.benefits || scheme.eligibility) && (
          <div className={`border-b-2 border-gray-300 ${scheme.benefits && scheme.eligibility ? 'grid grid-cols-1 md:grid-cols-2' : ''}`}>
            {scheme.benefits && (
              <div className={scheme.eligibility ? 'border-r border-gray-300' : ''}>
                <div className="bg-gray-50 text-center font-bold py-2 text-sm text-green-700 border-b border-gray-300">
                  💰 Benefits
                </div>
                <div className="p-4 text-sm text-gray-700 leading-relaxed">
                  {scheme.benefits}
                </div>
              </div>
            )}
            {scheme.eligibility && (
              <div>
                <div className="bg-gray-50 text-center font-bold py-2 text-sm text-green-700 border-b border-gray-300">
                  ✅ Eligibility
                </div>
                <div className="p-4 text-sm text-gray-700 leading-relaxed">
                  {scheme.eligibility}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Important Links */}
        <div>
          <div className="bg-gray-50 text-center font-bold py-2 text-sm text-pink-600 border-b border-gray-300">
            Some Useful Important Links
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              {scheme.apply_link && (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-green-700 font-medium border-r border-gray-200">
                    Apply Online
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer"
                      className="bg-green-500 text-white px-5 py-1.5 rounded text-xs font-bold hover:bg-green-600 transition">
                      Click Here
                    </a>
                  </td>
                </tr>
              )}
              {scheme.notification_link && (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-green-700 font-medium border-r border-gray-200">
                    Download Notification
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a href={scheme.notification_link} target="_blank" rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-5 py-1.5 rounded text-xs font-bold hover:bg-blue-600 transition">
                      Click Here
                    </a>
                  </td>
                </tr>
              )}
              {scheme.apply_link && (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-green-700 font-medium border-r border-gray-200">
                    Official Website
                  </td>
                  <td className="px-4 py-3 text-center">
                    <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer"
                      className="bg-gray-600 text-white px-5 py-1.5 rounded text-xs font-bold hover:bg-gray-700 transition">
                      Click Here
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
