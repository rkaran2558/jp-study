export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">1. Information We Collect</h2>
            <p>
              JP GK Study is an informational portal. We do not require users to register or provide personal details 
              to browse our content. We may collect non-personal data like browser type and IP addresses for 
              statistical purposes via standard server logs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">2. External Links</h2>
            <p>
              Our website contains links to many other government websites and official portals. Once you click 
              on these links and leave our site, please note that we have no control over the other website's 
              privacy practices or content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">3. Accuracy of Information</h2>
            <p>
              While we make every effort to provide accurate information, users are advised to always cross-check 
              notifications with the official government Gazette or board websites before taking any action. 
              JP GK Study is not responsible for any loss due to errors in information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">4. Cookies</h2>
            <p>
              We use minimal cookies to improve your browsing experience. These do not store personal information.
            </p>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-100 text-[11px] text-slate-400">
            Last updated: March 20, 2026
          </div>
        </div>
      </div>
    </div>
  )
}
