// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract StorageBox {
    uint public value;
    function set(uint _v) public { value = _v; }
    function get() public view returns (uint) { return value; }
}
