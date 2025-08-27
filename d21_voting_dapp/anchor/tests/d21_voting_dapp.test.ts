import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor';
import { D21VotingDapp } from '../target/types/d21_voting_dapp'
import BN from 'bn.js'
import {
    Blockhash,
    createSolanaClient,
    createTransaction,
    Instruction,
    KeyPairSigner,
    signTransactionMessageWithSigners,
} from 'gill'
import { LAMPORTS_PER_SOL, Connection, PublicKey } from '@solana/web3.js'
import { getGreetInstruction } from '../src'
// @ts-ignore error TS2307 suggest setting `moduleResolution` but this is already configured
import { loadKeypairSignerFromFile } from 'gill/node'

const { rpc, sendAndConfirmTransaction } = createSolanaClient({ urlOrMoniker: process.env.ANCHOR_PROVIDER_URL! })
describe('d21_voting_dapp', () => {

    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.d21_voting_dapp as Program<D21VotingDapp>;
    const electionOrganizer = anchor.web3.Keypair.generate();
    const voter1 = anchor.web3.Keypair.generate();
    const voter2 = anchor.web3.Keypair.generate();
    const voter3 = anchor.web3.Keypair.generate();
    const candidate1 = anchor.web3.Keypair.generate();
    const candidate2 = anchor.web3.Keypair.generate();
    const result_caller = anchor.web3.Keypair.generate();


    it('airdrop SOL to all test accounts', async () => {

        await airdrop(program.provider.connection, electionOrganizer.publicKey, 5 * LAMPORTS_PER_SOL);
        await airdrop(program.provider.connection, voter1.publicKey, 5 * LAMPORTS_PER_SOL);
        await airdrop(program.provider.connection, voter2.publicKey, 5 * LAMPORTS_PER_SOL);
        await airdrop(program.provider.connection, voter3.publicKey, 5 * LAMPORTS_PER_SOL);
        await airdrop(program.provider.connection, candidate1.publicKey, 5 * LAMPORTS_PER_SOL);
        await airdrop(program.provider.connection, candidate2.publicKey, 5 * LAMPORTS_PER_SOL);
        await airdrop(program.provider.connection, result_caller.publicKey, 5 * LAMPORTS_PER_SOL);

    })

    describe('Initialize Election', () => {
        it('Should initialize election successfully', async () => {
            // pub struct Election {
            //     pub election_id: u64,
            //     #[max_len(MAX_NAME_LEN)]
            //     pub election_name: String,
            //     #[max_len(MAX_DESCRIPTION_LEN)]
            //     pub election_description: String,
            //                     pub election_fee: u64,
            //                         pub election_organizer: Pubkey,
            //                             pub start_date: i64,
            //                                 pub end_date: i64,
            //     #[max_len(MAX_CANDIDATE_LEN)]
            //     pub candidate_list: Vec<Candidate>,
            // }
            const election: Election = {
                electionId: new BN(1),
                electionName: 'First Election',
                electionDesciption: 'First Election Desciption',
                electionFee: new BN(0),
                electionOrganizer: electionOrganizer.publicKey,
                startDate: new anchor.BN(Math.floor(Date.now() / 1000)),
                endDate: new anchor.BN(Math.floor(Date.now() / 1000) + 7200),
                candidateList: [],

            }
            // try {
            await initializeElection(program, electionOrganizer, election)
            await verifyElection(program, election)

            //     // If we get here, the election was created successfully - this means the MAX_LEN macro
            //     // doesn't enforce length limits at runtime, only for space calculation!
            //     const [electionPda] = getElectionPda(program, election.electionId)
            //     const electionAccount = await program.account.election.fetch(electionPda)
            //
            //     console.log('🚨 MAX_LEN MACRO DOES NOT ENFORCE LENGTH LIMITS! 🚨')
            //     console.log('election name:', eventAccount.electionName)
            //     console.log('election name length:', eventAccount.electionName.length)
            //     console.log('Expected max length: 30')
            //     console.log('Actual length:', electionAccount.electionName.length)
            //
            //     // This test should fail to demonstrate the issue
            //     assert(
            //         electionAccount.electionName.length <= 30,
            //         `election name length (${eventAccount.electionName.length}) exceeds maximum allowed (30). ` +
            //         'The #[max_len] macro does not enforce runtime length validation!',
            //     )
            // } catch (error) {
            //     // This is what we expect - the election creation should fail due to our validation
            //     assert(error.message.includes('Name too long'))
            // }
        })
    })

    // let payer: KeyPairSigner
    //
    // beforeAll(async () => {
    //     payer = await loadKeypairSignerFromFile(process.env.ANCHOR_WALLET!)
    // })
    //
    // it('should run the program and print "GM!" to the transaction log', async () => {
    //     // ARRANGE
    //     expect.assertions(1)
    //     const ix = getGreetInstruction()
    //
    //     // ACT
    //     const sx = await sendAndConfirm({ ix, payer })
    //
    //     // ASSERT
    //     expect(sx).toBeDefined()
    //     console.log('Transaction signature:', sx)
    // })
})

// Helper function to keep the tests DRY
let latestBlockhash: Awaited<ReturnType<typeof getLatestBlockhash>> | undefined
async function getLatestBlockhash(): Promise<Readonly<{ blockhash: Blockhash; lastValidBlockHeight: bigint }>> {
    if (latestBlockhash) {
        return latestBlockhash
    }
    return await rpc
        .getLatestBlockhash()
        .send()
        .then(({ value }) => value)
}
async function sendAndConfirm({ ix, payer }: { ix: Instruction; payer: KeyPairSigner }) {
    const tx = createTransaction({
        feePayer: payer,
        instructions: [ix],
        version: 'legacy',
        latestBlockhash: await getLatestBlockhash(),
    })
    const signedTransaction = await signTransactionMessageWithSigners(tx)
    return await sendAndConfirmTransaction(signedTransaction)
}
async function airdrop(connection: Connection, address: PublicKey, amount: number = 1000 * LAMPORTS_PER_SOL) {
    await connection.confirmTransaction(await connection.requestAirdrop(address, amount), 'confirmed')
}

//INSTRUCTIONS

async function initializeElection(
    program: Program<D21VotingDapp>,
    electionOrganizer: anchor.web3.Keypair,
    election: Election,
) {
    const [electionPda] = getElectionPda(program, election.electionId)

    await program.methods
        .initializeElection(election.electionId, election.electionName, election.electionDesciption, election.electionFee, election.electionOrganizer, election.startDate, election.endDate)
        .accounts({
            electionOrganizer: electionOrganizer.publicKey,
            election: electionPda,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([electionOrganizer])
        .rpc()
}

// Helper types and functions
interface Election {
    electionId: anchor.BN,
    electionName: string,
    electionDesciption: string,
    electionFee: anchor.BN
    electionOrganizer: PublicKey,
    startDate: anchor.BN,
    endDate: anchor.BN,
    candidateList: [],
}
function getElectionPda(
    program: Program<D21VotingDapp>,
    electionId: BN,
): [PublicKey, number] {
    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('election'), electionId.toArrayLike(Buffer, "le", 8)],
        program.programId,
    )
}
async function verifyElection(
    program: Program<D21VotingDapp>,
    election: Election,
) {
    const [electionPda] = getElectionPda(program, election.electionId)
    const electionAccount = await program.account.election.fetch(electionPda)

    assert.equal(electionAccount.electionName, election.electionName)
    assert.equal(electionAccount.electionDescription, election.electionDesciption)
    assert.ok(electionAccount.electionFee.eq(election.electionFee))
    // Above and below both methods work
    assert.equal(electionAccount.electionFee.toString(), election.electionFee.toString())
    assert.equal(electionAccount.startDate.toString(), election.startDate.toString())
    assert.equal(electionAccount.endDate.toString(), election.endDate.toString())
    assert.equal(electionAccount.electionOrganizer, election.electionOrganizer.toString())
}
