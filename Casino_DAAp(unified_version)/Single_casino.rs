mod erc20 {
    #[ink(storage)]
    pub struct Erc20 { balance: ink::storage::Mapping<AccountId, Balance> }
    impl Erc20 {
        #[ink(constructor)]
        pub fn new() -> Self { Self { balance: Default::default() } }
        #[ink(message)]
        pub fn mint(&mut self, to: AccountId, amount: Balance) {
            let b = self.balance.get(&to).unwrap_or(0);
            self.balance.insert(&to, &(b + amount));
        }
        #[ink(message)]
        pub fn balance_of(&self, who: AccountId) -> Balance {
            self.balance.get(&who).unwrap_or(0)
        }
    }
}
