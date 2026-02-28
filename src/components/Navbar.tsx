import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      {/* Top bar */}
      <div className="bg-blue-900 text-center py-1 text-sm">
        🔔 Latest Govt Jobs, Results & Admit Cards — Updated Daily
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="JP GK Study Logo"
            width={60}
            height={60}
            className="rounded-full object-cover border-2 border-white"
          />
          <span className="text-2xl font-bold tracking-wide">JP GK Study</span>
        </Link>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-1">
          <Link href="/" className="px-3 py-1.5 rounded hover:bg-blue-600 font-medium text-sm transition">
            🏠 Home
          </Link>
          <Link href="/jobs" className="px-3 py-1.5 rounded hover:bg-blue-600 font-medium text-sm transition">
            💼 Latest Jobs
          </Link>
          <Link href="/results" className="px-3 py-1.5 rounded hover:bg-blue-600 font-medium text-sm transition">
            📊 Results
          </Link>
          <Link href="/admit-cards" className="px-3 py-1.5 rounded hover:bg-blue-600 font-medium text-sm transition">
            🪪 Admit Cards
          </Link>
          <Link href="/syllabus" className="px-3 py-1.5 rounded hover:bg-blue-600 font-medium text-sm transition">
            📚 Syllabus
          </Link>
        </div>
      </div>

      {/* Category quick links */}
      <div className="bg-blue-800 py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 text-xs font-medium justify-center">
          {['SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence', 'Teaching'].map((cat) => (
            <Link key={cat} href={`/jobs?category=${cat}`} className="hover:text-yellow-300 transition">
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
