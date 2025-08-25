use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Election, Vote, MAX_NAME_LEN},
};

const DISCRIMINANT: usize = 8;

pub fn _initialize_candidate(ctx: Context<CandidateContext>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CandidateContext<'info> {
    //TODO: Candidate account add here.
    #[account(mut)]
    pub candidate: Signer<'info>,
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(
        init,
        payer = candidate,
        space = DISCRIMINANT + Vote::INIT_SPACE,
        seeds = [b"candidate", election.key().as_ref(), candidate.key().as_ref(), candidate.key().as_ref()],
        //Choice
        //of making this one voter -> one vote per election OR one voter -> one vote per candidate
        //election. I choose the later because traditional systems already do the first option
        bump

    )]
    pub candidate_account: Account<'info, Vote>,
    pub system_program: Program<'info, System>,
}
