// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// gameId is a uint32

contract Games {
    // every player in a game should have the game added to their games
    mapping(address => uint256[]) public playerAddressToGamesMapping;
    uint256 public nextGameId = 0; 

    // todo: players
    function newGame() public returns (uint256){
        uint256 gameId = nextGameId;
        playerAddressToGamesMapping[msg.sender].push(gameId);
        nextGameId++;
        return gameId;
    }

    function getUserGames() public view returns (uint256[] memory) {
        return playerAddressToGamesMapping[msg.sender];
    }
}
