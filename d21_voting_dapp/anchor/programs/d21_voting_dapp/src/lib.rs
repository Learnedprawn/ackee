use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod d21_voting_dapp {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializeContext>,
        election_name: String,
        election_description: String,
        election_fee: u64,
        election_organizer: Pubkey,
        start_date: i64,
        end_date: i64,
    ) -> Result<()> {
        _initialize(
            ctx,
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
}
