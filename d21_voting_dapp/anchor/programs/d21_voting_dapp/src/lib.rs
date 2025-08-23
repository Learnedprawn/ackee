use anchor_lang::prelude::*;

declare_id!("JAVuBXeBZqXNtS73azhBDAoYaaAFfo4gWXoZe2e7Jf8H");

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod d21_voting_dapp {
    use super::*;

    pub fn initialize(ctx: Context<InitializeContext>) -> Result<()> {
        _initialize(ctx)
    }
}
