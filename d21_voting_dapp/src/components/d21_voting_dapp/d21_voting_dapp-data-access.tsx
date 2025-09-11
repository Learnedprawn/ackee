import { getD21VotingDappProgramId } from '@project/anchor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'
import { toastTx } from '@/components/toast-tx'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import {
  createTransaction,
  Instruction,
  signAndSendTransactionMessageWithSigners,
  SolanaClient,
  TransactionSigner,
} from 'gill'

export function useD21VotingDappProgramId() {
  const { cluster } = useWalletUi()

  return useMemo(() => getD21VotingDappProgramId(cluster.id), [cluster])
}

export async function processTransaction(signer: TransactionSigner, client: SolanaClient, instructions: Instruction[]) {
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

  const transaction = createTransaction({
    latestBlockhash,
    feePayer: signer,
    version: 'legacy',
    instructions,
  })

  const signature = await signAndSendTransactionMessageWithSigners(transaction)
  console.log('signature: ', signature)
}
