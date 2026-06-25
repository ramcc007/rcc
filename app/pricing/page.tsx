import Link from 'next/link'
import { Video, Check } from 'lucide-react'

const FEATURES = [
  'Unlimited script generation',
  'Up to 10 video generations per hour',
  'Multi-platform compliance checking',
  'Quality scoring & analysis',
  'Brand kit with unlimited assets',
  'Campaign & video library',
  '5 video variants per generation',
  'AES-256 encrypted API key storage',
  'Google OAuth secure sign-in',
]

export default function PricingPage() {
  const CONTACT_EMAIL = 'onlinemoneyrcc@gmail.com'

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

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-4">Simple Pricing</h1>
          <p className="text-[#a3a3a3] text-lg max-w-xl mx-auto">
            UGC Pro Studio is <strong className="text-white">free to use</strong> — you only pay for what Google charges on your own Gemini API account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free tier */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-violet-400 mb-1">Platform access</p>
              <p className="text-4xl font-bold text-white">$0<span className="text-lg text-[#a3a3a3] font-normal">/mo</span></p>
              <p className="text-[#a3a3a3] text-sm mt-2">Free, forever. No credit card required.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-[#c3c3c3]">
                  <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard"
              className="block w-full text-center bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* API costs info */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-sm font-medium text-[#a3a3a3] mb-1">Google API costs (billed by Google)</p>
              <p className="text-2xl font-bold text-white">Pay as you go</p>
              <p className="text-[#a3a3a3] text-sm mt-2">Costs go directly to your Google account. We never see or charge for API usage.</p>
            </div>

            <div className="space-y-4 flex-1">
              <div className="bg-[#141414] rounded-xl p-4 border border-[#2a2a2a]">
                <p className="text-sm font-medium text-white mb-1">Gemini 2.5 Pro (scripts)</p>
                <p className="text-xs text-[#a3a3a3]">~$0.001–$0.01 per script generation. Very cheap for typical usage.</p>
              </div>
              <div className="bg-[#141414] rounded-xl p-4 border border-[#2a2a2a]">
                <p className="text-sm font-medium text-white mb-1">Veo 3 (video generation)</p>
                <p className="text-xs text-[#a3a3a3]">Pricing set by Google per video second. Check Google AI Studio for current rates.</p>
              </div>
              <div className="bg-[#141414] rounded-xl p-4 border border-violet-600/30">
                <p className="text-sm font-medium text-violet-300 mb-1">Tip: Set a budget limit</p>
                <p className="text-xs text-[#a3a3a3]">In Google AI Studio, set a monthly spending cap on your API key to avoid surprise charges.</p>
              </div>
            </div>

            <p className="text-xs text-[#555] mt-6">
              Prices are set by Google and may change. Visit{' '}
              <span className="text-violet-400">ai.google.dev</span> for current rates.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#a3a3a3] text-sm">
            Questions?{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-violet-400 hover:underline">{CONTACT_EMAIL}</a>
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-[#2a2a2a] flex justify-center gap-6 text-sm text-[#a3a3a3]">
          <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Back to App</Link>
        </div>
      </main>
    </div>
  )
}
