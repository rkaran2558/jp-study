'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/results', label: 'Results' },
    { path: '/admit-cards', label: 'Admit Cards' },
    { path: '/syllabus', label: 'Syllabus' },
    { path: '/schemes', label: 'Schemes' },
    { path: '/blog', label: 'Blog' },
]

const categories = ['SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching']

export default function Navbar() {
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">

            {/* Top Bar: Logo + Hamburger */}
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
                    <Image
                        src="/logo.png"
                        alt="JP GK Study Logo"
                        width={44}
                        height={44}
                        className="rounded object-cover"
                    />
                    <span className="text-xl font-bold text-gray-800 tracking-tight">JP GK Study</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600">
                    {links.map(link => {
                        const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path))
                        return (
                            <Link key={link.path} href={link.path}
                                className={`transition-colors py-1 ${isActive ? 'text-blue-700 font-bold border-b-2 border-blue-600' : 'hover:text-blue-600'}`}>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Hamburger Button (mobile only) */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded hover:bg-gray-100 transition"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
                    <ul className="flex flex-col divide-y divide-gray-100">
                        {links.map(link => {
                            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path))
                            return (
                                <li key={link.path}>
                                    <Link href={link.path}
                                        onClick={() => setMenuOpen(false)}
                                        className={`block py-3 text-base font-medium transition-colors ${isActive ? 'text-blue-700 font-bold' : 'text-gray-700 hover:text-blue-600'}`}>
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Category chips in mobile menu */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Browse by Category</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <Link key={cat} href={`/jobs?category=${cat}`}
                                    onClick={() => setMenuOpen(false)}
                                    className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-sm hover:bg-blue-700 hover:text-white transition-colors">
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Category quick links (desktop only) */}
            <div className="hidden md:block bg-blue-50 border-t border-blue-100 py-1.5">
                <div className="max-w-7xl mx-auto px-4 flex gap-5 text-[13px] font-semibold text-blue-800 justify-center flex-wrap">
                    {categories.map(cat => (
                        <Link key={cat} href={`/jobs?category=${cat}`}
                            className="hover:text-blue-600 hover:underline transition-colors tracking-wide py-0.5">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
