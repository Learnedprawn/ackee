import { ellipsify, useWalletUi, useWalletUiSigner } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { useD21VotingDappProgramId, processTransaction } from './d21_voting_dapp-data-access'
import { useState } from 'react'
import { getInitializeElectionInstructionAsync } from '@project/anchor'

export function D21VotingDappProgramExplorerLink() {
  const programId = useD21VotingDappProgramId()

  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function D21VotingDappProgram() {
  return (
    <div>
      <div>
        <h2>Voting</h2>
        <CreateElection />
      </div>
    </div>
  )
}

export default function CreateElection() {
  const signer = useWalletUiSigner()
  const client = useWalletUi().client
  const [formData, setFormData] = useState({
    electionName: '',
    electionDescription: '',
    electionFee: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const startDateSeconds = Math.round(new Date(formData.startDate).getTime() / 1000)
    const endDateSeconds = Math.round(new Date(formData.endDate).getTime() / 1000)
    console.log('Creating election:', formData)
    const ix = await getInitializeElectionInstructionAsync({
      electionOrganizer: signer,
      electionName: formData.electionName,
      electionId: BigInt(1),
      electionDescription: formData.electionDescription,
      // electionFee: BigInt(formData.electionFee),
      electionFee: BigInt(1),
      startDate: BigInt(startDateSeconds),
      endDate: BigInt(endDateSeconds),
    })
    await processTransaction(signer, client, [ix])
    alert('Election created successfully!')
    setFormData({
      electionName: '',
      electionDescription: '',
      electionFee: '',
      startDate: '',
      endDate: '',
    })
  }

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Create New Election</h1>
        <p className="text-gray-300">Set up a new blockchain-based election</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Election Name</label>
            <input
              type="text"
              name="electionName"
              // value={formData.electionName}
              defaultValue={formData.electionName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter election name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              name="electionDescription"
              // value={formData.electionDescription}
              defaultValue={formData.electionDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the election purpose and details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Election Fee (SOL)</label>
            <input
              type="number"
              name="electionFee"
              // value={formData.electionFee}
              defaultValue={formData.electionFee}
              onChange={handleChange}
              required
              step="0.001"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="datetime-local"
                name="startDate"
                // value={formData.startDate}
                defaultValue={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                // value={formData.endDate}
                defaultValue={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Create Election
          </button>
        </form>
      </div>
    </div>
  )
}
