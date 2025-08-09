mod voting {
    #[ink(storage)]
    pub struct Voting { votes: ink::storage::Mapping<AccountId, bool> }
    impl Voting {
        #[ink(constructor)]
        pub fn new() -> Self { Self { votes: Default::default() } }
        #[ink(message)]
        pub fn vote(&mut self) { self.votes.insert(&Self::env().caller(), &true); }
        #[ink(message)]
        pub fn has_voted(&self, who: AccountId) -> bool {
            self.votes.get(&who).unwrap_or(false)
        }
    }
}
