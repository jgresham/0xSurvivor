// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {Games} from "../src/Games.sol";
import {Game} from "../src/Game.sol";
import "../src/Player.sol";

uint256 constant FID_JOHNS = 710;
uint256 constant FID_1 = 1;

contract GamesTest is Test {
    Games public games;

    // Run before each test
    function setUp() public {
        games = new Games();
    }

    function test_nextGameIdIsZero() public view {
        uint256 nextGameId = games.nextGameId();
        assertEq(nextGameId, 0);
    }

    function test_newGame1Player() public {
        Player[] memory players = new Player[](1);
        address[] memory playerAddresses = new address[](1);
        playerAddresses[0] = address(0x123);
        Player memory p1 = Player(FID_JOHNS, playerAddresses, false, 0);
        players[0] = p1;
        uint256 gameId = games.newGame(FID_JOHNS, players);
        assertEq(gameId, 0);
        uint256[] memory usersGames = games.getUserGames(FID_JOHNS);
        assertEq(usersGames[0], 0);
        uint256 nextGameId = games.nextGameId();
        assertEq(nextGameId, 1);
    }

    function test_newGame2Players() public {
        Player[] memory players = new Player[](2);
        address[] memory playerAddresses = new address[](2);
        playerAddresses[0] = address(0x123);
        playerAddresses[1] = address(0x456);
        Player memory p1 = Player(FID_JOHNS, playerAddresses, false, 0);
        players[0] = p1;
        address[] memory player2Addresses = new address[](2);
        player2Addresses[0] = address(0x678);
        player2Addresses[1] = address(0x912);
        Player memory p2 = Player(FID_1, player2Addresses, false, 0);
        players[1] = p2;
        uint256 gameId = games.newGame(FID_JOHNS, players);
        assertEq(gameId, 0);
        uint256[] memory usersGames = games.getUserGames(FID_JOHNS);
        assertEq(usersGames[0], 0);
        uint256[] memory usersGames2 = games.getUserGames(FID_1);
        assertEq(usersGames2[0], 0);
    }

    function test_newGame2Players1VoteAndWinner() public {
        Player[] memory players = new Player[](2);
        address[] memory playerAddresses = new address[](2);
        playerAddresses[0] = address(0x123);
        playerAddresses[1] = address(0x456);
        Player memory p1 = Player(FID_JOHNS, playerAddresses, false, 0);
        players[0] = p1;
        address[] memory player2Addresses = new address[](2);
        player2Addresses[0] = address(0x678);
        player2Addresses[1] = address(0x912);
        Player memory p2 = Player(FID_1, player2Addresses, false, 0);
        players[1] = p2;
        uint256 gameId = games.newGame(FID_JOHNS, players);
        assertEq(gameId, 0);
        uint256[] memory usersGames = games.getUserGames(FID_JOHNS);
        assertEq(usersGames[0], 0);
        uint256[] memory usersGames2 = games.getUserGames(FID_1);
        assertEq(usersGames2[0], 0);
        Game game = Game(games.gameIdToGamesMapping(0));
        game.voteToRemovePlayer(FID_JOHNS, FID_1);
        assertEq(game.fidWinner(), 0);
        Player[] memory gamePlayers = game.getPlayers();
        Player memory gamePlayer1 = gamePlayers[0];
        Player memory gamePlayer2 = gamePlayers[1];
        assertEq(gamePlayer1.currentVotedPlayerToRemove, FID_1);
        assertEq(gamePlayer2.currentVotedPlayerToRemove, 0);
        assertEq(gamePlayer1.isRemoved, false); 
        assertEq(gamePlayer2.isRemoved, false); 
        game.voteToRemovePlayer(FID_1, FID_JOHNS);
        // In case of tie, the lowest index player is always removed first (bug). It should be random.
        assertEq(game.fidWinner(), FID_1); 
    }

    // function test_twoNewGamesBySameSender() public {
    //     uint256 gameId0 = games.newGame();
    //     assertEq(gameId0, 0);
    //     uint256 gameId1 = games.newGame();
    //     assertEq(gameId1, 1);
    //     uint256[] memory usersGames = games.getUserGames();
    //     assertEq(usersGames[0], 0);
    //     assertEq(usersGames[1], 1);
    //     uint256 nextGameId = games.nextGameId();
    //     assertEq(nextGameId, 2);
    // }

    // function test_createGameWithTwoAddresses() public {
    //     address[] memory playerAddresses = new address[](2);
    //     address addr1 = address(0x123);
    //     address addr2 = address(0x456);
    //     playerAddresses[0] = addr1;
    //     playerAddresses[1] = addr2;

    //     vm.prank(addr1);
    //     uint256 gameId0 = games.newGame();
    //     assert(gameId0 == 0);

    //     vm.prank(addr2);
    //     uint256 gameId1 = games.newGame();
    //     assert(gameId1 == 1);
    //     vm.prank(addr2);
    //     uint256[] memory usersGames2 = games.getUserGames();
    //     assertEq(usersGames2[0], 1);

    //     vm.prank(addr1);
    //     uint256[] memory usersGames1 = games.getUserGames();
    //     assertEq(usersGames1[0], 0);
    // }
}
