use anchor_lang::prelude::*;

pub const MAX_NAME_LEN: usize = 30;
pub const MAX_DESCRIPTION_LEN: usize = 100;

#[account]
#[derive(InitSpace)]
pub struct Election {
    #[max_len(MAX_NAME_LEN)]
    pub election_name: String,
    #[max_len(MAX_DESCRIPTION_LEN)]
    pub election_description: String,
    pub election_fee: u64,
    pub election_organizer: Pubkey,
    pub start_date: i64,
    pub end_date: i64,
}
#[account]
#[derive(InitSpace)]
pub struct Vote {
    pub election: Pubkey,
    pub candidate: Pubkey,
    pub voter: Pubkey,
    pub election_fee: u64,
}
