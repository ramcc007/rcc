'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Palette, PlusCircle, Upload, Trash2 } from 'lucide-react'

export default function BrandKitPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [newKit, setNewKit] = useState({ name: '', primaryColor: '#7c3aed', secondaryColor: '' })

  const { data } = useQuery({
    queryKey: ['brand-kits'],
    queryFn: () => fetch('/api/brand-kit').then(r => r.json()),
  })

  const createKit = useMutation({
    mutationFn: (kit: typeof newKit) =>
      fetch('/api/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kit),
      }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['brand-kits'] })
      setShowForm(false)
      setNewKit({ name: '', primaryColor: '#7c3aed', secondaryColor: '' })
    },
  })

  const uploadAsset = useMutation({
    mutationFn: async ({ kitId, file }: { kitId: string; file: File }) => {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('type', 'product_image')
      const res = await fetch(`/api/brand-kit/${kitId}/assets`, { method: 'POST', body: fd })
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['brand-kits'] }),
  })

  const kits = data?.brandKits ?? []

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Brand Kit</h1>
          <p className="text-[#a3a3a3] mt-1">Manage your brand assets and product images for AI generation.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Brand Kit
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-[#1a1a1a] border border-violet-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4">New Brand Kit</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1.5">Kit Name</label>
              <input
                type="text"
                value={newKit.name}
                onChange={e => setNewKit(k => ({ ...k, name: e.target.value }))}
                placeholder="e.g. Main Brand"
                className="w-full bg-[#262626] border border-[#3a3a3a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs text-[#a3a3a3] mb-1.5">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newKit.primaryColor}
                  onChange={e => setNewKit(k => ({ ...k, primaryColor: e.target.value }))}
                  className="w-10 h-9 rounded-lg border border-[#3a3a3a] cursor-pointer bg-[#262626]"
                />
                <input
                  type="text"
                  value={newKit.primaryColor}
                  onChange={e => setNewKit(k => ({ ...k, primaryColor: e.target.value }))}
                  className="flex-1 bg-[#262626] border border-[#3a3a3a] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-[#a3a3a3] border border-[#2a2a2a] rounded-xl hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={() => createKit.mutate(newKit)}
              disabled={!newKit.name || createKit.isPending}
              className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              {createKit.isPending ? 'Creating...' : 'Create Kit'}
            </button>
          </div>
        </div>
      )}

      {/* Kits */}
      {kits.length === 0 && !showForm ? (
        <div className="text-center py-16 border border-dashed border-[#2a2a2a] rounded-2xl">
          <Palette className="w-12 h-12 text-[#333] mx-auto mb-4" />
          <p className="text-white font-medium mb-2">No brand kits yet</p>
          <p className="text-[#a3a3a3] text-sm">Create a brand kit to store your logo, colors, and product images.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kits.map((kit: { id: string; name: string; primaryColor?: string; assets?: Array<{ id: string; url: string; name: string }> }) => (
            <div key={kit.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {kit.primaryColor && (
                    <div className="w-8 h-8 rounded-lg border border-[#3a3a3a]" style={{ background: kit.primaryColor }} />
                  )}
                  <div>
                    <p className="text-white font-medium">{kit.name}</p>
                    <p className="text-xs text-[#555]">{kit.assets?.length ?? 0} assets</p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-[#262626] border border-[#3a3a3a] hover:border-[#4a4a4a] text-[#a3a3a3] hover:text-white text-xs px-3 py-2 rounded-lg transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) uploadAsset.mutate({ kitId: kit.id, file })
                    }}
                  />
                </label>
              </div>

              {/* Assets grid */}
              {kit.assets && kit.assets.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {kit.assets.map((asset) => (
                    <div key={asset.id} className="relative group">
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-20 h-20 object-cover rounded-lg border border-[#2a2a2a]"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg flex items-center justify-center transition-opacity">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
