import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand/About Mini */}
          <div className="md:col-span-1">
            <h3 className="text-slate-900 font-bold text-lg mb-3 tracking-tight">JP GK Study</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Leading portal for latest Govt Jobs, Sarkari Result, Admit Card and Exam Syllabus updates.
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">Important</h4>
            <ul className="space-y-2 text-[13px] text-blue-700 font-medium">
              <li><Link href="/jobs" className="hover:underline hover:text-red-700">Latest Jobs</Link></li>
              <li><Link href="/results" className="hover:underline hover:text-red-700">Exam Results</Link></li>
              <li><Link href="/admit-cards" className="hover:underline hover:text-red-700">Admit Cards</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2 text-[13px] text-blue-700 font-medium">
              <li><Link href="/syllabus" className="hover:underline hover:text-red-700">Syllabus</Link></li>
              <li><Link href="/schemes" className="hover:underline hover:text-red-700">Govt Schemes</Link></li>
              <li><Link href="/blog" className="hover:underline hover:text-red-700">Study Blog</Link></li>
            </ul>
          </div>

          {/* Quick Support */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2 text-[13px] text-blue-700 font-medium">
              <li><Link href="/about" className="hover:underline hover:text-red-700">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline hover:text-red-700">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:underline hover:text-red-700">Privacy Policy</Link></li>
              <li><a href="https://www.youtube.com/@JPGKStudy" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-red-700 text-red-600 font-bold">YouTube</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-8 pt-6 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            © {new Date().getFullYear()} JP GK Study. All rights reserved. 
            <br className="sm:hidden" />
            <span className="hidden sm:inline mx-2">|</span> 
            Disclaimer: Content on this site is for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
