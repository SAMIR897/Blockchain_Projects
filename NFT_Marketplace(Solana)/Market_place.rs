mod arr {
    #[ink(storage)]
    pub struct Arr { data: Vec<u32> }
    impl Arr {
        #[ink(constructor)]
        pub fn new() -> Self { Self { data: vec![] } }
        #[ink(message)]
        pub fn add(&mut self, v: u32) { self.data.push(v); }
        #[ink(message)]
        pub fn get(&self, i: u32) -> u32 { self.data[i as usize] }
    }
}
