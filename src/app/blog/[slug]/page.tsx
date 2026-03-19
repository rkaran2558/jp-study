import { createSupabaseServer } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { isValidUrl } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServer()
  const { data: post } = await supabase.from('blogs').select('title, summary').eq('slug', slug).single()
  
  if (!post) return { title: 'Article Not Found | JP Study' }
  
  return {
    title: `${post.title} | JP Study`,
    description: post.summary || 'Read the latest educational updates on JP Study.'
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServer()
  const { data: post } = await supabase
    .from('blogs').select('*').eq('slug', slug).eq('published', true).single()

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-blue-600">Home</Link> {' / '}
        <Link href="/blog" className="hover:text-blue-600">Blog</Link> {' / '}
        <span className="text-gray-600">{post.title}</span>
      </div>

      {isValidUrl(post.thumbnail_url) && (
        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 bg-gray-100">
          <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{post.category}</span>
        {post.author && <span className="text-gray-400 text-sm">by <strong>{post.author}</strong></span>}
        {post.created_at && (
          <span className="text-gray-400 text-sm ml-auto">
            {new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>

      {post.summary && (
        <p className="text-gray-600 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6 text-sm leading-relaxed">
          {post.summary}
        </p>
      )}

      <article
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />
    </div>
  )
}
