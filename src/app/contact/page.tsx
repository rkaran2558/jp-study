export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Contact Us</h1>
        
        <p className="text-slate-600 mb-10">
          Have a question or want to report a discrepancy in any job notification? We are here to help!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
          <div className="p-6 border border-slate-100 bg-slate-50 rounded">
            <h3 className="font-bold text-slate-800 mb-2">Email Support</h3>
            <p className="text-sm text-slate-600 mb-4">For general inquiries and support:</p>
            <a href="mailto:support@jpgkstudy.com" className="text-blue-700 font-bold hover:underline">support@jpgkstudy.com</a>
          </div>

          <div className="p-6 border border-slate-100 bg-slate-50 rounded">
            <h3 className="font-bold text-slate-800 mb-2">Editorial Team</h3>
            <p className="text-sm text-slate-600 mb-4">To report issues or submit content:</p>
            <a href="mailto:editor@jpgkstudy.com" className="text-blue-700 font-bold hover:underline">editor@jpgkstudy.com</a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Connect With Us</h2>
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://www.youtube.com/@JPGKStudy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-red-600 font-bold hover:underline">
              <span className="text-2xl">▶</span> YouTube Channel
            </a>
          </div>
          <p className="text-sm text-slate-500">
            We are also working on setting up our Telegram and WhatsApp channels soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  )
}
