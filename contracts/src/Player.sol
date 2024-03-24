// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


struct Player {
    uint256 fid; 
    address[] addresses;
    bool isRemoved;
    uint256 currentVotedPlayerToRemove;
}

// contract Player {
//     address[] public verifiedAddresses;
//     uint256 public fid; 
//     bool public isRemoved;
//     uint256 public currentVotedPlayerToRemove;


//     constructor (uint256 _fid, address[] memory _addresses) {
//         fid = _fid;
//         verifiedAddresses = _addresses; 
//         isRemoved = false;
//         currentVotedPlayerToRemove = 0;
//     }
// }
