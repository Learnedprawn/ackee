import { ellipsify } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { useD21VotingDappProgramId, useGetProgramAccountQuery } from './d21_voting_dapp-data-access'

export function D21VotingDappProgramExplorerLink() {
    const programId = useD21VotingDappProgramId()

    return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}

export function CreateEvent() { }

export function D21VotingDappProgram() {
    return (
        <div><div><h2>Voting</h2><CreateElection /></div></div>

    )
}
import { useState } from "react";

export default function CreateElection() {
    const [formData, setFormData] = useState({
        election_name: "",
        election_description: "",
        election_fee: "",
        start_date: "",
        end_date: "",
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Dummy function for creating election
        console.log("Creating ellection:", formData);
        alert("Election created successfully!");
        setFormData({
            election_name: "",
            election_description: "",
            election_fee: "",
            start_date: "",
            end_date: "",
        });
    };

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Create New Election
                </h1>
                <p className="text-gray-300">Set up a new blockchain-based election</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Election Name
                        </label>
                        <input
                            type="text"
                            name="election_name"
                            value={formData.election_name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter election name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="election_description"
                            value={formData.election_description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Describe the election purpose and details"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Election Fee (SOL)
                        </label>
                        <input
                            type="number"
                            name="election_fee"
                            value={formData.election_fee}
                            onChange={handleChange}
                            required
                            step="0.001"
                            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="0.001"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
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
    );
}
