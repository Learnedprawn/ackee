use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Candidate, Election, MAX_NAME_LEN},
};

const DISCRIMINANT: usize = 8;

pub fn _initialize_candidate(ctx: Context<CandidateContext>, candidate_name: String) -> Result<()> {
    let candidate_account = &mut ctx.accounts.candidate_account;
    require!(
        ctx.accounts.election.end_date >= Clock::get()?.unix_timestamp,
        ElectionError::RegistrationAfterEndDate
    );
    require!(
        candidate_name.len() <= MAX_NAME_LEN,
        ElectionError::NameTooLong
    );

    candidate_account.name = candidate_name;
    candidate_account.election = ctx.accounts.election.key();
    candidate_account.candidate = ctx.accounts.candidate.key();
    candidate_account.vote_count = 0;

    Ok(())
}

#[derive(Accounts)]
pub struct CandidateContext<'info> {
    #[account(mut)]
    pub candidate: Signer<'info>,
    #[account(mut)]
    pub election: Account<'info, Election>,
    #[account(
        init,
        payer = candidate,
        space = DISCRIMINANT + Candidate::INIT_SPACE,
        seeds = [b"candidate", election.key().as_ref(), candidate.key().as_ref(), candidate.key().as_ref()],
        bump
    )]
    pub candidate_account: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}
