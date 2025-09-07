use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Election, Voter},
};

pub fn _vote(ctx: Context<VoteContext>, candidate: u64) -> Result<()> {
    let election_account = &mut ctx.accounts.election;
    require!(
        election_account.start_date > Clock::get()?.unix_timestamp,
        ElectionError::StartDateInThePast
    );
    require!(
        election_account.end_date > Clock::get()?.unix_timestamp,
        ElectionError::VotingAfterEndDate
    );
    require!(
        ctx.accounts.voter_account.election.key() == election_account.key(),
        ElectionError::NotRegisteredForThisElection
    );

    if 0 == candidate {
        election_account.candidate1_votes += 1;
    } else if 1 == candidate {
        election_account.candidate2_votes += 1;
    } else {
        panic!("Candidate id not correct")
    }
    Ok(())
}

#[derive(Accounts)]
// #[instruction(candidate: Pubkey)]
pub struct VoteContext<'info> {
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        mut,
        // seeds = [b"voter", voter.key().as_ref(), election.key().as_ref()],
        // seeds = [b"voter", voter.key().as_ref(), election.key().as_ref()],
        // bump
    )]
    pub voter_account: Account<'info, Voter>,
    #[account(mut)]
    pub election: Account<'info, Election>,
    // #[account(mut)]
    // pub candidate_account: Account<'info, Candidate>,
    // #[account(
    //     // seeds = [b"candidate", election.key().as_ref(), candidate.key().as_ref(), candidate.key().as_ref()],
    //     // seeds = [b"candidate", election.key().as_ref(), voter.key().as_ref(), candidate.key().as_ref()],
    //     // bump
    //
    // )]
    // pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}
