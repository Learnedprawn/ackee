use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Candidate, Election, Voter},
};

pub fn _vote(ctx: Context<VoteContext>, _candidate: Pubkey) -> Result<()> {
    require!(
        ctx.accounts.election.start_date < Clock::get()?.unix_timestamp,
        ElectionError::StartDateInThePast
    );
    require!(
        ctx.accounts.election.end_date > Clock::get()?.unix_timestamp,
        ElectionError::VotingAfterEndDate
    );
    require!(
        ctx.accounts.voter_account.election.key() == ctx.accounts.election.key(),
        ElectionError::VotingAfterEndDate
    );

    ctx.accounts.candidate_account.vote_count += 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(candidate: Pubkey)]
pub struct VoteContext<'info> {
    //TODO: Candidate account add here.
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        mut,
        // seeds = [b"voter", voter.key().as_ref(), election.key().as_ref()],
        seeds = [b"voter", voter.key().as_ref(), election.key().as_ref()],
        bump
    )]
    pub voter_account: Account<'info, Voter>,
    #[account()]
    pub election: Account<'info, Election>,
    #[account(mut)]
    pub candidate_account: Account<'info, Candidate>,
    #[account(
        // seeds = [b"candidate", election.key().as_ref(), candidate.key().as_ref(), candidate.key().as_ref()],
        seeds = [b"candidate", election.key().as_ref(), voter.key().as_ref(), candidate.key().as_ref()],
        bump

    )]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}
// #[account(
//     init,
//     payer = voter,
//     space = DISCRIMINANT + Vote::INIT_SPACE,
//     seeds = [b"vote", election.key().as_ref(), voter.key().as_ref(), candidate.key().as_ref()],
//     //Choice
//     //make this one voter -> one vote per election OR one voter -> one vote per candidate
//     //election. I choose the later because traditional systems already do the first option
//     bump
//
// )]
// pub vote: Account<'info, Vote>,
