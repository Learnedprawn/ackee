import * as anchor from '@coral-xyz/anchor'
import assert from "assert"
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
import { LAMPORTS_PER_SOL, Connection, PublicKey, Keypair } from '@solana/web3.js'
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
            await initializeElection(program, electionOrganizer, election)
            await verifyElection(program, election)
        })
    })
    describe('Initialize Candidate', () => {
        // pub struct Candidate {
        //     pub election: Pubkey,
        //     pub candidate: Pubkey,
        //     #[max_len(MAX_NAME_LEN)]
        //     pub name: String,
        //     pub vote_count: i64,
        // }
        it('Should initialize candidate successfully', async () => {
            const election_candidate: Election = {
                electionId: new BN(2),
                electionName: 'Candidate Election',
                electionDesciption: 'Candidate Election Desciption',
                electionFee: new BN(0),
                electionOrganizer: electionOrganizer.publicKey,
                startDate: new anchor.BN(Math.floor(Date.now() / 1000)),
                endDate: new anchor.BN(Math.floor(Date.now() / 1000) + 7200),
                candidateList: [],
            }
            await initializeElection(program, electionOrganizer, election_candidate)
            let [electionPda] = getElectionPda(program, election_candidate.electionId)
            console.log("electionPda: ", electionPda);
            const candidate: Candidate = {
                election: electionPda,
                candidate: candidate1.publicKey,
                candidateName: "Name of candidate1",
                voteCount: new BN(0),
            }
            let candidatePda = await initializeCandidate(program, candidate, candidate1, electionPda, election_candidate.electionId)

            const accountInfo = await program.provider.connection.getAccountInfo(candidatePda);
            console.log("Account Info: ", accountInfo);
            verifyCandidate(program, election_candidate, candidate)
        })
    })
    describe('Initialize Voter', () => {
        it('Should initialize voter successfully', async () => {
            // First, set up a test election
            const election_voter: Election = {
                electionId: new BN(3),
                electionName: 'Voter Election',
                electionDesciption: 'Voter Election Description',
                electionFee: new BN(0),
                electionOrganizer: electionOrganizer.publicKey,
                startDate: new anchor.BN(Math.floor(Date.now() / 1000)),
                endDate: new anchor.BN(Math.floor(Date.now() / 1000) + 7200),
                candidateList: [],
            };

            // Initialize the election first
            await initializeElection(program, electionOrganizer, election_voter);

            // Derive PDA for election
            const [electionPda] = getElectionPda(program, election_voter.electionId);
            console.log("electionPda for voter test: ", electionPda);

            // Create a voter object
            const voter: Voter = {
                voter: voter1.publicKey,
                election: electionPda,
                voterName: "Name for Voter",
                votesGiven: new BN(0),
                negativeVotesGiven: new BN(0),
            };

            // Initialize the voter
            const voterPda = await initializeVoter(program, voter, voter1, electionPda, election_voter.electionId);

            // Fetch the account info for debug/logging
            const accountInfo = await program.provider.connection.getAccountInfo(voterPda);
            console.log("Voter Account Info: ", accountInfo);

            // Verify the voter account
            await verifyVoter(program, electionPda, voter);
        });
    });

    describe('Vote', () => {
        it('Should allow a voter to vote for a candidate', async () => {
            // 1. Setup election
            const election_vote: Election = {
                electionId: new BN(4),
                electionName: 'Vote Election',
                electionDesciption: 'Vote Election Description',
                electionFee: new BN(0),
                electionOrganizer: electionOrganizer.publicKey,
                startDate: new anchor.BN(Math.floor(Date.now() / 1000) + 1000),
                endDate: new anchor.BN(Math.floor(Date.now() / 1000) + 7200),
                candidateList: [],
            }
            await initializeElection(program, electionOrganizer, election_vote);

            const [electionPda] = getElectionPda(program, election_vote.electionId);

            // 2. Initialize candidate
            const candidate: Candidate = {
                election: electionPda,
                candidate: candidate1.publicKey,
                candidateName: "Candidate One",
                voteCount: new BN(0),
            };
            const candidatePda = await initializeCandidate(program, candidate, candidate1, electionPda, election_vote.electionId);

            // 3. Initialize voter
            const voter: Voter = {
                voter: voter1.publicKey,
                election: electionPda,
                voterName: "Alice",
                votesGiven: new BN(0),
                negativeVotesGiven: new BN(0),
            };
            const voterPda = await initializeVoter(program, voter, voter1, electionPda, election_vote.electionId);

            // 4. Derive candidate PDA for voting seeds
            // const [voteCandidatePda] = getCandidatePdaForVote(program, electionPda, voter1.publicKey, candidate1.publicKey);


            // 5. Perform the vote
            await program.methods
                .vote(candidate1.publicKey)
                .accounts({
                    voter: voter1.publicKey,
                    voterAccount: voterPda,
                    election: electionPda,
                    candidateAccount: candidatePda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([voter1])
                .rpc();
            await program.methods
                .vote(candidate1.publicKey)
                .accounts({
                    voter: voter1.publicKey,
                    voterAccount: voterPda,
                    election: electionPda,
                    candidateAccount: candidatePda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([voter1])
                .rpc();

            // 6. Fetch candidate account to verify vote count
            const candidateAccount = await program.account.candidate.fetch(candidatePda);
            assert.equal(candidateAccount.voteCount.toString(), "2");
        });
    });

    describe('Calculate Result', () => {
        it('Should calculate correct result', async () => {
            // 1. Setup election
            const result_election: Election = {
                electionId: new BN(5),
                electionName: 'Result Test Election',
                electionDesciption: 'Vote Election Description',
                electionFee: new BN(0),
                electionOrganizer: electionOrganizer.publicKey,
                startDate: new anchor.BN(Math.floor(Date.now() / 1000) + 1000),
                endDate: new anchor.BN(Math.floor(Date.now() / 1000) + 7200),
                candidateList: [],
            }
            await initializeElection(program, electionOrganizer, result_election);

            const [electionPda] = getElectionPda(program, result_election.electionId);

            // 2. Initialize candidate
            const candidate1_struct: Candidate = {
                election: electionPda,
                candidate: candidate1.publicKey,
                candidateName: "Candidate One",
                voteCount: new BN(0),
            };
            const candidate1Pda = await initializeCandidate(program, candidate1_struct, candidate1, electionPda, result_election.electionId);

            const candidate2_struct: Candidate = {
                election: electionPda,
                candidate: candidate2.publicKey,
                candidateName: "Candidate Two",
                voteCount: new BN(0),
            };
            const candidate2Pda = await initializeCandidate(program, candidate2_struct, candidate1, electionPda, result_election.electionId);

            // 3. Initialize voter
            const voter1_struct: Voter = {
                voter: voter1.publicKey,
                election: electionPda,
                voterName: "Vinesh",
                votesGiven: new BN(0),
                negativeVotesGiven: new BN(0),
            };
            const voter1Pda = await initializeVoter(program, voter1_struct, voter1, electionPda, result_election.electionId);
            const voter2_struct: Voter = {
                voter: voter2.publicKey,
                election: electionPda,
                voterName: "Taufique",
                votesGiven: new BN(0),
                negativeVotesGiven: new BN(0),
            };
            const voter2Pda = await initializeVoter(program, voter2_struct, voter1, electionPda, result_election.electionId);
            const voter3_struct: Voter = {
                voter: voter3.publicKey,
                election: electionPda,
                voterName: "Sadhak",
                votesGiven: new BN(0),
                negativeVotesGiven: new BN(0),
            };
            const voter3Pda = await initializeVoter(program, voter3_struct, voter1, electionPda, result_election.electionId);

            // 4. Derive candidate PDA for voting seeds
            // const [voteCandidatePda] = getCandidatePdaForVote(program, electionPda, voter1.publicKey, candidate1.publicKey);


            // 5. Perform the election: Vinesh and Taufique Vote for One and Sadhak votes for Two 
            await program.methods
                .vote(candidate1.publicKey)
                .accounts({
                    voter: voter1.publicKey,
                    voterAccount: voter1Pda,
                    election: electionPda,
                    candidateAccount: candidate1Pda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([voter1])
                .rpc();
            await program.methods
                .vote(candidate1.publicKey)
                .accounts({
                    voter: voter2.publicKey,
                    voterAccount: voter2Pda,
                    election: electionPda,
                    candidateAccount: candidate1Pda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([voter2])
                .rpc();
            await program.methods
                .vote(candidate2.publicKey)
                .accounts({
                    voter: voter3.publicKey,
                    voterAccount: voter3Pda,
                    election: electionPda,
                    candidateAccount: candidate2Pda,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([voter3])
                .rpc();

            // 6. Fetch candidate account to verify vote count
            const candidateAccount = await program.account.candidate.fetch(candidate1Pda);
            const candidateAccount = await program.account.candidate.fetch(candidate2Pda);
            assert.equal(candidateAccount.voteCount.toString(), "2");
        });
    });


});

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
    return electionPda
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

interface Candidate {
    election: PublicKey,
    candidate: PublicKey,
    candidateName: string,
    voteCount: BN,
}
async function initializeCandidate(
    program: Program<D21VotingDapp>,
    candidateAccount: Candidate,
    candidate: anchor.web3.Keypair,
    electionPda: PublicKey,
    electionId: BN,
) {
    const [candidatePda] = getCandidatePda(program, electionPda, candidate.publicKey)

    await program.methods
        .initializeCandidate(candidateAccount.candidateName, electionId)
        .accounts({
            candidate: candidate.publicKey,
            election: electionPda,
            candidateAccount: candidatePda,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([candidate])
        .rpc({ skipPreflight: true })
    return candidatePda
}

function getCandidatePda(
    program: Program<D21VotingDapp>,
    election: PublicKey,
    candidate: PublicKey,
): [PublicKey, number] {
    // seeds = [b"candidate", election.key().as_ref(), candidate.key().as_ref()],
    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('candidate'), election.toBuffer(), candidate.toBuffer()],
        program.programId,
    )
}

async function verifyCandidate(
    program: Program<D21VotingDapp>,
    election: Election,
    candidate: Candidate,
) {
    const [electionPda] = getElectionPda(program, election.electionId)
    const [candidatePda] = getCandidatePda(program, electionPda, candidate.candidate)
    const candidateAccount = await program.account.candidate.fetch(candidatePda)

    assert.equal(candidateAccount.name, candidate.candidateName)
    assert.equal(candidateAccount.voteCount.toString(), candidate.voteCount.toString())
}

interface Voter {
    voter: PublicKey,
    election: PublicKey,
    voterName: string,
    votesGiven: BN,
    negativeVotesGiven: BN,
}

async function initializeVoter(
    program: Program<D21VotingDapp>,
    voterAccount: Voter,
    voterKeypair: Keypair,
    electionPda: PublicKey,
    electionId: BN,
) {
    const [voterPda] = getVoterPda(program, voterKeypair.publicKey, electionPda);

    await program.methods
        .initializeVoter(electionId, voterAccount.voterName)
        .accounts({
            voter: voterKeypair.publicKey,
            election: electionPda,
            voterAccount: voterPda,
            systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([voterKeypair])
        .rpc({ skipPreflight: true });

    return voterPda;
}

function getVoterPda(program: Program<D21VotingDapp>, voter: PublicKey, election: PublicKey): [PublicKey, number] {
    return anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('voter'), voter.toBuffer(), election.toBuffer()],
        program.programId,
    );
}

async function verifyVoter(
    program: Program<D21VotingDapp>,
    electionPda: PublicKey,
    voter: Voter
) {
    const [voterPda] = getVoterPda(program, voter.voter, electionPda);
    const voterAccount = await program.account.voter.fetch(voterPda);

    assert.equal(voterAccount.name, voter.voterName);
    assert.equal(voterAccount.votesGiven.toString(), voter.votesGiven.toString());
    assert.equal(voterAccount.negativeVotesGiven.toString(), voter.negativeVotesGiven.toString());
    assert.equal(voterAccount.voter.toString(), voter.voter.toString());
    assert.equal(voterAccount.election.toString(), voter.election.toString());
}
