import { WizardShell } from '@/components/wizard/wizard-shell'

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string }>
}) {
  const { campaignId } = await searchParams

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Create UGC Video</h1>
        <p className="text-[#a3a3a3] mt-1">Generate a professional UGC script and AI video in 5 steps.</p>
      </div>
      <WizardShell preloadCampaignId={campaignId} />
    </div>
  )
}
