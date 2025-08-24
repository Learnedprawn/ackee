use anchor_lang::prelude::*;

use crate::{
    error::ElectionError,
    state::{Election, MAX_NAME_LEN},
};

pub const DISCRIMINANT: usize = 8;

pub fn _initialize(
    ctx: Context<InitializeContext>,
    election_name: String,
    election_description: String,
    election_fee: u64,
    election_organizer: Pubkey,
    start_date: i64,
    end_date: i64,
) -> Result<()> {
    let election_account = &mut ctx.accounts.election;

    require!(
        election_name.len() <= MAX_NAME_LEN,
        ElectionError::NameTooLong
    );
    election_account.election_name = election_name;

    require!(
        election_description.len() <= MAX_NAME_LEN,
        ElectionError::DesciptionTooLong
    );
    election_account.election_description = election_description;

    election_account.election_fee = election_fee;

    election_account.election_organizer = election_organizer;

    require!(
        start_date >= Clock::get()?.unix_timestamp,
        ElectionError::StartDateInThePast
    );
    election_account.start_date = start_date;

    require!(end_date >= start_date, ElectionError::EndDateAfterStart);
    election_account.end_date = end_date;

    election_account.election_organizer = ctx.accounts.election_organizer.key();

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeContext<'info> {
    #[account(mut)]
    pub election_organizer: Signer<'info>,
    #[account(
        init,
        payer = election_organizer,
        space = DISCRIMINANT + Election::INIT_SPACE,
        seeds = [b"election", election_organizer.key().as_ref(),  name.as_bytes()],
        bump
    )]
    pub election: Account<'info, Election>,
    pub system_program: Program<'info, System>,
}
