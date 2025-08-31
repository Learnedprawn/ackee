use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Candidate, Election},
};

pub fn _calculate_result(
    ctx: Context<ElectionResultContext>,
    _election_id: u64,
) -> Result<Candidate> {
    let election_account = &mut ctx.accounts.election;
    // if election_account.candidate1_votes > election_account.candidate2_votes {
    //     election_account.winner = election_account.candidate1;
    // } else {
    //     election_account.winner = election_account.candidate2;
    // }
    // let mut winner: Candidate = Candidate {
    //     election: (,
    //     candidate: (),
    //     name: (),
    //     vote_count: 0,
    // };
    // for candidate in candidates {
    //     if winner.vote_count < candidate.vote_count {
    //         winner = candidate.clone();
    //     }
    // }
    let winner = election_account
        .candidate_list
        .iter()
        .max_by_key(|candidate| candidate.vote_count)
        .cloned()
        .ok_or(ElectionError::NoCandidatesForResult);
    Ok(winner.unwrap())
}

#[derive(Accounts)]
#[instruction(election_id: u64)]
pub struct ElectionResultContext<'info> {
    #[account(mut)]
    pub anyone: Signer<'info>,
    #[account(
        mut,
        // seeds = [b"election", election_id.to_le_bytes().as_ref()],
        // bump
    )]
    pub election: Account<'info, Election>,
    pub system_program: Program<'info, System>,
}
