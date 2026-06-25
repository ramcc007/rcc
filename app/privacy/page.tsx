import Link from 'next/link'
import { Video } from 'lucide-react'

export default function PrivacyPolicyPage() {
  const EFFECTIVE_DATE = 'June 25, 2026'
  const CONTACT_EMAIL = 'onlinemoneyrcc@gmail.com'
  const SITE_URL = 'https://ug-videos-rcc.netlify.app'

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#fafafa]">
      <header className="border-b border-[#2a2a2a] px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-white">UGC Pro Studio</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-[#a3a3a3] text-sm mb-10">Effective date: {EFFECTIVE_DATE}</p>

        <div className="space-y-8 text-[#c3c3c3] text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Who We Are</h2>
            <p>UGC Pro Studio (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is a professional AI-powered video creation tool accessible at {SITE_URL}. We are operated as an independent service. Questions? Contact us at {CONTACT_EMAIL}.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Account data</strong> — your name, email address, and profile photo obtained via Google OAuth when you sign in.</li>
              <li><strong className="text-white">API keys</strong> — your Google Gemini API key, stored AES-256-GCM encrypted in our database. We never store it in plain text.</li>
              <li><strong className="text-white">Content you create</strong> — campaign briefs, generated scripts, video generation settings, and brand kit assets you upload.</li>
              <li><strong className="text-white">Usage data</strong> — request timestamps and rate-limit counters (stored in memory only, not persisted).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To authenticate you and maintain your session.</li>
              <li>To call Google Gemini / Veo APIs on your behalf using your own API key.</li>
              <li>To store and display your campaigns, scripts, and generated videos.</li>
              <li>To enforce fair-use rate limits.</li>
            </ul>
            <p className="mt-3">We do not sell your data. We do not use your content to train any AI model.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Third-Party Services</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-white">Google OAuth</strong> — for sign-in. Governed by <a href="https://policies.google.com/privacy" className="text-violet-400 underline">Google&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-white">Google Gemini / Veo APIs</strong> — your API key is sent to Google&apos;s servers to generate content. Governed by Google&apos;s API Terms of Service.</li>
              <li><strong className="text-white">Turso (database)</strong> — encrypted data at rest. Governed by Turso&apos;s privacy policy.</li>
              <li><strong className="text-white">Netlify (hosting)</strong> — serves the application. Governed by Netlify&apos;s privacy policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Retention</h2>
            <p>Your data is retained for as long as your account exists. You may request deletion by emailing {CONTACT_EMAIL}. We will delete your account and associated data within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Security</h2>
            <p>We use industry-standard safeguards: AES-256-GCM encryption for API keys, HTTPS for all traffic, JWT-based sessions, and HTTP security headers (X-Frame-Options, Content-Security-Policy). No system is perfectly secure; use a dedicated API key with appropriate spending limits.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights</h2>
            <p>Depending on your jurisdiction you may have rights to access, correct, or delete your personal data. To exercise these rights, email {CONTACT_EMAIL}.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Cookies</h2>
            <p>We use a single session cookie to keep you signed in. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>We may update this policy. The effective date at the top will change when we do. Continued use of the service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Contact</h2>
            <p>For privacy questions, email <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 underline">{CONTACT_EMAIL}</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a2a] flex gap-6 text-sm text-[#a3a3a3]">
          <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Back to App</Link>
        </div>
      </main>
    </div>
  )
}
