// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import {IChronicle} from "./IChronicle.sol";

contract ChronicleOracle {
    IChronicle public chronicle;

    // event for EVM logging
    constructor(address oracle) {
        chronicle = IChronicle(oracle);
    }

    // modifier to check if caller is owner
    function read() external view returns (uint, uint) {
        uint val;
        uint age;
        (val, age) = chronicle.readWithAge();
        return (val, age);
    }
}
