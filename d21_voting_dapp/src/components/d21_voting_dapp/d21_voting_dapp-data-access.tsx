import { getD21VotingDappProgramId } from '@project/anchor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'
import { toastTx } from '@/components/toast-tx'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'

export function useD21VotingDappProgramId() {
    const { cluster } = useWalletUi()

    return useMemo(() => getD21VotingDappProgramId(cluster.id), [cluster])
}

export function useGetProgramAccountQuery() {
    const { client, cluster } = useWalletUi()

    return useQuery({
        queryKey: ['get-program-account', { cluster }],
        queryFn: () => client.rpc.getAccountInfo(getD21VotingDappProgramId(cluster.id)).send(),
    })
}

