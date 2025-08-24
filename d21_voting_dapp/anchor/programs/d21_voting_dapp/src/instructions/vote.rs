use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Election, Vote, MAX_NAME_LEN},
};

const DISCRIMINANT: usize = 8;

pub fn _vote(ctx: Context<VoteContext>, candidate: Pubkey) -> Result<()> {
    let vote = &mut ctx.accounts.vote;

    require!(
        ctx.accounts.election.start_date < Clock::get()?.unix_timestamp,
        ElectionError::StartDateInThePast
    );
    require!(
        ctx.accounts.election.end_date > Clock::get()?.unix_timestamp,
        ElectionError::VotingAfterEndDate
    );
    //TODO: After creating Candidate accounts increment candidate votes.
    vote.voter = ctx.accounts.voter.key();
    vote.candidate = candidate;
    vote.election_fee = 0;

    Ok(())
}

#[derive(Accounts)]
#[instruction(candidate: Pubkey)]
pub struct VoteContext<'info> {
    //TODO: Candidate account add here.
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(
        init,
        payer = voter,
        space = DISCRIMINANT + Vote::INIT_SPACE,
        seeds = [b"vote", election.key().as_ref(), voter.key().as_ref(), candidate.key().as_ref()],
        //Choice
        //of making this one voter -> one vote per election OR one voter -> one vote per candidate
        //election. I choose the later because traditional systems already do the first option.
        bump

    )]
    pub vote: Account<'info, Vote>,
    pub system_program: Program<'info, System>,
}
