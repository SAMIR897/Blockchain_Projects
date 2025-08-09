// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Items {
    string[] public items;
    function add(string memory s) public { items.push(s); }
    function get(uint i) public view returns (string memory) { return items[i]; }
}
