// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Games} from "../src/Games.sol";

contract GamesTest is Test {
    Games public games;

    // Run before each test
    function setUp() public {
        games = new Games();
    }

    function test_nextGameIdIsZero() public {
        uint256 nextGameId = games.nextGameId();
        assertEq(nextGameId, 0);
    }

    function test_newGame() public {
        uint256 gameId = games.newGame();
        assertEq(gameId, 0);
        uint256[] memory usersGames = games.getUserGames();
        assertEq(usersGames[0], 0);
        uint256 nextGameId = games.nextGameId();
        assertEq(nextGameId, 1);
    }

    function test_twoNewGamesBySameSender() public {
        uint256 gameId0 = games.newGame();
        assertEq(gameId0, 0);
        uint256 gameId1 = games.newGame();
        assertEq(gameId1, 1);
        uint256[] memory usersGames = games.getUserGames();
        assertEq(usersGames[0], 0);
        assertEq(usersGames[1], 1);
        uint256 nextGameId = games.nextGameId();
        assertEq(nextGameId, 2);
    }
}
