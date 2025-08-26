use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Candidate, Election, Vote, Voter, MAX_NAME_LEN},
};

const DISCRIMINANT: usize = 8;

pub fn _initialize_voter(
    ctx: Context<VoterContext>,
    _election_id: u64,
    voter_name: String,
) -> Result<()> {
    let voter = &mut ctx.accounts.voter_account;

    voter.name = voter_name;
    voter.voter = ctx.accounts.voter.key();
    voter.election = ctx.accounts.election.key();
    voter.votes_given = 0;
    voter.negative_votes_given = 0;
    Ok(())
}

#[derive(Accounts)]
#[instruction(election_id: u64)]
pub struct VoterContext<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        mut,
        seeds = [b"election", election_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub election: Account<'info, Election>,
    #[account(
        init,
        space = DISCRIMINANT + Voter::INIT_SPACE,
        payer = voter,
        seeds = [b"voter", voter.key().as_ref(), election.key().as_ref()],
        bump
    )]
    pub voter_account: Account<'info, Voter>,

    pub system_program: Program<'info, System>,
}
