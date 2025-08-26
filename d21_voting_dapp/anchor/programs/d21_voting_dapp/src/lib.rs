use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod d21_voting_dapp {
    use super::*;

    pub fn initialize_election(
        ctx: Context<InitializeElectionContext>,
        election_id: u64,
        election_name: String,
        election_description: String,
        election_fee: u64,
        election_organizer: Pubkey,
        start_date: i64,
        end_date: i64,
    ) -> Result<()> {
        _initialize_election(
            ctx,
            election_id,
            election_name,
            election_description,
            election_fee,
            election_organizer,
            start_date,
            end_date,
        )
    }
    pub fn vote(ctx: Context<VoteContext>, candidate: Pubkey) -> Result<()> {
        _vote(ctx, candidate)
    }
    pub fn initialize_candidate(
        ctx: Context<CandidateContext>,
        candidate_name: String,
    ) -> Result<()> {
        _initialize_candidate(ctx, candidate_name)
    }
    pub fn initialize_voter(
        ctx: Context<VoterContext>,
        election_id: u64,
        voter_name: String,
    ) -> Result<()> {
        _initialize_voter(ctx, election_id, voter_name)
    }
}
