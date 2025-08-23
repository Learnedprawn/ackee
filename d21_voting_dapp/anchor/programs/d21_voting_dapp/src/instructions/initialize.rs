use anchor_lang::prelude::*;
pub fn _initialize(_ctx: Context<InitializeContext>) -> Result<()> {
    msg!("GM!");
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeContext {}
