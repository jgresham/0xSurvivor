// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Player.sol";
import "./Game.sol";

contract Games {
    /** all games a fid has created or been invited to */
    mapping(uint256 => uint256[]) public fidToGamesMapping;
    uint256 public nextGameId;
    mapping(uint256 => address) public gameIdToGamesMapping;


    constructor () {
        nextGameId = 0;
    }

    /**
    * @dev Create a new game
    * @param fidGameCreator fid of the game creator
    * @param _players players in the game (should include the creator if the creator is playing the game)
    * @return gameId of the new game
    */
    function newGame(uint256 fidGameCreator, Player[] memory _players) public returns (uint256){
        // todo: check _players length min and max
        uint256 gameId = nextGameId;
        Game game = new Game(gameId, fidGameCreator, _players);
        gameIdToGamesMapping[gameId] = address(game);

        // add game to all players' fidToGamesMapping
        for(uint i = 0; i < _players.length; i++) {
            fidToGamesMapping[_players[i].fid].push(gameId);
        }
        nextGameId++;
        return gameId;
    }

    function getUserGames(uint256 userFid) public view returns (uint256[] memory) {
        return fidToGamesMapping[userFid];
    }
}
