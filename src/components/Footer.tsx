import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-white text-xl font-bold mb-3">📋 JP GK Study</h3>
          <p className="text-sm leading-relaxed">
            Your one-stop destination for latest government job notifications, exam results, admit cards and syllabus updates.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/jobs" className="hover:text-white transition">Latest Jobs</Link></li>
            <li><Link href="/results" className="hover:text-white transition">Results</Link></li>
            <li><Link href="/admit-cards" className="hover:text-white transition">Admit Cards</Link></li>
            <li><Link href="/syllabus" className="hover:text-white transition">Syllabus</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['SSC', 'UPSC', 'Railway', 'Bank', 'State PSC', 'Defence'].map((cat) => (
              <li key={cat}>
                <Link href={`/jobs?category=${cat}`} className="hover:text-white transition">
                  {cat} Jobs
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} JP GK Study. All rights reserved. | For educational purposes only.
      </div>
    </footer>
  )
}
