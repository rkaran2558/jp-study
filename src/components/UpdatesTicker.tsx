'use client'

import Link from 'next/link'

interface Update {
  id: number
  text: string
  link: string
}

export default function UpdatesTicker({ updates }: { updates: Update[] }) {
  return (
    <div className="bg-blue-50 border-b border-blue-100 text-blue-800 py-1.5 flex items-center overflow-hidden">
      <div className="font-semibold text-xs tracking-wider uppercase px-4 shrink-0 border-r border-blue-200 mr-4">
        Updates
      </div>
      <div className="overflow-hidden whitespace-nowrap w-full">
        <div className="inline-block animate-marquee leading-none">
          {updates.map((update) => (
            <Link key={update.id} href={update.link ?? '#'} className="mr-8 text-sm hover:underline">
              {update.text}
            </Link>
          ))}
          {updates.map((update) => (
            <Link key={`dup-${update.id}`} href={update.link ?? '#'} className="mr-8 text-sm hover:underline">
              {update.text}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
