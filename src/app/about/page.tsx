import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">About JP GK Study</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
          <p>
            Welcome to <strong>JP GK Study</strong>, your most reliable destination for the latest Government Job notifications, Exam Results, 
            Admit Cards, and Syllabus updates in India.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">Our Mission</h2>
          <p>
            Our mission is simple: To provide students and job seekers with the most accurate, up-to-date, and organized information 
            about competitive exams and career opportunities. We understand how crucial timely information is for your future, 
            and we work tirelessly to ensure you never miss an update.
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-8">What We Provide</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Latest Jobs:</strong> Instant notifications for SSC, UPSC, Railway, Banking, Defense, and State PSC jobs.</li>
            <li><strong>Exam Results:</strong> Fast links to official result PDFs and marks for all major competitive exams.</li>
            <li><strong>Admit Cards:</strong> Direct download links for hall tickets as soon as they are released by the boards.</li>
            <li><strong>Syllabus:</strong> Comprehensive and official exam syllabus files to help you plan your preparation.</li>
            <li><strong>Govt Schemes:</strong> Information about various welfare and scholarship schemes for students.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 mt-8">Why Use JP GK Study?</h2>
          <p>
            While many websites provide job updates, we focus on <strong>simplicity and speed</strong>. Our "Sarkari-Result style" 
            minimalist interface is designed to help you find what you need in seconds without being overwhelmed by heavy graphics 
            or intrusive advertisements.
          </p>

          <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded text-center">
            <p className="text-blue-800 font-medium">Thank you for trusting JP GK Study for your career journey!</p>
            <Link href="/" className="inline-block mt-4 text-sm font-bold text-red-700 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
