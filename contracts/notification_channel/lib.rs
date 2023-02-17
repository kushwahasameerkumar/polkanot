#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod notification_channel {
    use ink::prelude::string::String;
    use ink::storage::Mapping;

    pub type ChannelId = u128;

    #[ink(event)]
    pub struct ChannelCreated {
        #[ink(topic)]
        channel_id: ChannelId,
        channel_name: String,
    }

    #[ink(event)]
    pub struct NewNotification {
        #[ink(topic)]
        channel_id: ChannelId,
        #[ink(topic)]
        caller: AccountId,
        message: String,
    }

    #[ink(storage)]
    #[derive(Default)]
    pub struct NotificationChannel {
        channel_nonce: ChannelId,
        channel_to_owner: Mapping<ChannelId, AccountId>,
        // channel_to_name: Mapping<ChannelId, String>,
        channel_approved: Mapping<(ChannelId, AccountId), ()>,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Given channel id does not exist
        ChannelNotFound,
        /// Caller is not the owner of the given channel
        NotOwner,
        /// Caller is not approved to emit notification in the given channel
        NotApproved,
    }

    impl NotificationChannel {
        #[ink(constructor)]
        pub fn new() -> Self {
            Default::default()
        }

        #[ink(message)]
        pub fn create_channel(&mut self, channel_name: String) -> Result<ChannelId, Error> {
            let caller = self.env().caller();
            let channel_id = self.channel_nonce;

            self.channel_to_owner.insert(&channel_id, &caller);
            // self.channel_to_name.insert(&channel_id, &channel_name);
            self.channel_nonce += 1;

            self.env().emit_event(ChannelCreated {
                channel_id,
                channel_name,
            });
            Ok(channel_id)
        }

        #[ink(message)]
        pub fn add_contract_to_channel(
            &mut self,
            channel_id: ChannelId,
            contract_address: AccountId,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            self.ensure_owner(&channel_id, &caller)?;

            self.channel_approved
                .insert(&(channel_id, contract_address), &());
            Ok(())
        }

        #[ink(message, selector = 0xb94da279)]
        pub fn emit_notification(
            &mut self,
            channel_id: ChannelId,
            message: String,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            self.ensure_approved(&channel_id, &caller)?;

            self.env().emit_event(NewNotification {
                channel_id,
                caller,
                message,
            });
            Ok(())
        }

        fn ensure_owner(&self, channel_id: &ChannelId, caller: &AccountId) -> Result<(), Error> {
            match self.channel_to_owner.get(channel_id) {
                None => Err(Error::ChannelNotFound),
                Some(owner) if owner != *caller => Err(Error::NotOwner),
                _ => Ok(()),
            }
        }

        fn ensure_approved(&self, channel_id: &ChannelId, caller: &AccountId) -> Result<(), Error> {
            self.channel_approved
                .get((channel_id, caller))
                .ok_or(Error::NotApproved)
        }
    }
}
