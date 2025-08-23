// Here we export some useful types and functions for interacting with the Anchor program.
import { address } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { D21_VOTING_DAPP_PROGRAM_ADDRESS } from './client/js'
import D21VotingDappIDL from '../target/idl/d21_voting_dapp.json'

// Re-export the generated IDL and type
export { D21VotingDappIDL }

// This is a helper function to get the program ID for the D21VotingDapp program depending on the cluster.
export function getD21VotingDappProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the D21VotingDapp program on devnet and testnet.
      return address('6z68wfurCMYkZG51s1Et9BJEd9nJGUusjHXNt4dGbNNF')
    case 'solana:mainnet':
    default:
      return D21_VOTING_DAPP_PROGRAM_ADDRESS
  }
}

export * from './client/js'
