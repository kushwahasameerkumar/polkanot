#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod demo_contract {
    use ink::prelude::string::String;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum NotificationChannelError {
        /// Given channel id does not exist
        ChannelNotFound,
        /// Caller is not the owner of the given channel
        NotOwner,
        /// Caller is not approved to emit notification in the given channel
        NotApproved,
    }

    #[ink(storage)]
    pub struct DemoContract {
        admin: AccountId,
        notification_contract: Option<AccountId>,
        channel_id: u128,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Caller is not the admin of the contract
        NotAdmin,
        /// Notification address is null
        NotificationContractNotSet,
        /// Error occurred at notification channel side
        NotificationError(NotificationChannelError),
    }

    impl DemoContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                admin: Self::env().caller(),
                notification_contract: None,
                channel_id: 0,
            }
        }

        #[ink(message)]
        pub fn set_notification_contract(&mut self, contract_address: AccountId) -> Result<(), Error> {
            self.ensure_admin()?;
            self.notification_contract = Some(contract_address);
            Ok(())
        }

        #[ink(message)]
        pub fn set_channel_id(&mut self, channel_id: u128) -> Result<(), Error> {
            self.ensure_admin()?;
            self.channel_id = channel_id;
            Ok(())
        }

        #[ink(message)]
        pub fn sample_function_call(&mut self, payload: String) -> Result<(), Error> {

            let Some(notification_contract) = self.notification_contract else {
                return Err(Error::NotificationContractNotSet);
            };

            // @dev This is disabled during tests due to the use of `invoke_contract()` not being
            // supported (tests end up panicking).
            #[cfg(not(test))]
            {
                use ink::env::call::{build_call, ExecutionInput, Selector};

                const EMIT_NOTIFICATION_SELECTOR: [u8; 4] = [0xB9, 0x4D, 0xA2, 0x79];
                let result = build_call::<Environment>()
                    .call(notification_contract)
                    .exec_input(
                        ExecutionInput::new(Selector::new(EMIT_NOTIFICATION_SELECTOR))
                            .push_arg(self.channel_id)
                            .push_arg(payload)
                    )
                    .returns::<core::result::Result<(), NotificationChannelError>>()
                    .params()
                    .invoke();

                if let Err(err) = result {
                    return Err(Error::NotificationError(err));
                }
            }
            Ok(())
        }

        #[ink(message)]
        pub fn channel_id(&self) -> u128 {
            self.channel_id
        }

        fn ensure_admin(&self) -> Result<(), Error> {
            match self.env().caller() == self.admin {
                true => Ok(()),
                false => Err(Error::NotAdmin),
            }
        }
    }
}
