'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { path: '/', label: 'Home' },
        { path: '/jobs', label: 'Jobs' },
        { path: '/results', label: 'Results' },
        { path: '/admit-cards', label: 'Admit Cards' },
        { path: '/syllabus', label: 'Syllabus' },
        { path: '/schemes', label: 'Schemes' },
        { path: '/blog', label: 'Blog' },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">

            {/* Main nav */}
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">

                {/* Logo + Name */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    <Image
                        src="/logo.png"
                        alt="Logomark"
                        width={56}
                        height={56}
                        className="rounded object-cover"
                    />
                    <span className="text-2xl font-bold text-gray-800 tracking-tight">JP GK Study</span>
                </Link>

                {/* Nav links (Right Aligned) */}
                <div className="flex flex-wrap justify-center md:justify-end gap-5 flex-1 w-full text-sm font-medium text-gray-600">
                    {links.map(link => {
                        const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                        return (
                            <Link key={link.path} href={link.path}
                                className={`transition-colors py-1 ${isActive ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'hover:text-blue-600'}`}>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Category quick links */}
            <div className="bg-blue-50 border-t border-blue-100 py-2">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-5 text-[13px] font-semibold text-blue-800 justify-center">
                    {['SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching'].map((cat) => (
                        <Link key={cat} href={`/jobs?category=${cat}`} className="hover:text-blue-600 hover:underline transition-colors tracking-wide">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
