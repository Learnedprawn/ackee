use anchor_lang::prelude::*;

#[error_code]
pub enum ElectionError {
    #[msg("Name should be less than 20")]
    NameTooLong,
    #[msg("Desciption should be less than 20")]
    DesciptionTooLong,
    #[msg("Start Date should be in future")]
    StartDateInThePast,
    #[msg("End Date after Start Date")]
    EndDateAfterStart,
    #[msg("End Date crossed")]
    VotingAfterEndDate,
    #[msg("Can't register after end date")]
    RegistrationAfterEndDate,
}
