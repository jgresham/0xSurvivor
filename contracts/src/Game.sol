// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./Player.sol";

contract Game {
    event Log(string message, uint256 value);

    uint256 public gameId; 
    uint256 public fidGameCreator;
    Player[] public players;
    uint256 public fidWinner;
    // bool isStarted;

    constructor (uint256 _gameId, uint256 _fidGameCreator, Player[] memory _players) {
        gameId = _gameId;
        fidGameCreator = _fidGameCreator;
        // can't do memory => storage, so can't do players = _players;
        for (uint256 i = 0; i < _players.length; i++) {
            players.push(_players[i]);
        }
        fidWinner = 0;
        // isStarted = false;
    }

    function voteToRemovePlayer(uint256 fidPlayerVoting, uint256 fidPlayerToRemove) public {
        // check if the msg.sender is an active player
        bool isMsgSenderAnActivePlayer = false;
        Player memory votingPlayer;
        uint votingPlayerIndex;
        for(uint i = 0; i < players.length; i++) {
            if(players[i].fid == fidPlayerVoting && players[i].isRemoved == false) {
                isMsgSenderAnActivePlayer = true;
                votingPlayer = players[i]; // copies value, not a pointer
                votingPlayerIndex = i;
                break;
            }
        }

        emit Log("votingPlayer", votingPlayer.fid);
        if(isMsgSenderAnActivePlayer == false) {
            revert("Only active players can vote to remove other players");
        }
        if(votingPlayer.fid == 0) {
            revert("Voting player not found");
        }

        // check if playerToRemove is an active player
        bool isPlayerToRemoveAnActivePlayer = false;
        for (uint i = 0; i < players.length; i++) {
            if(players[i].fid == fidPlayerToRemove && players[i].isRemoved == false) {
                isPlayerToRemoveAnActivePlayer = true;
                break;
            }
        }
        if(isPlayerToRemoveAnActivePlayer == false) {
            revert("Player to remove is not an active player");
        }

        // player voting and player receiving the vote are both active players
        // now we can set the players vote to playerToRemove
        votingPlayer.currentVotedPlayerToRemove = fidPlayerToRemove;
        players[votingPlayerIndex].currentVotedPlayerToRemove = fidPlayerToRemove;
        emit Log("votingPlayer.currentVotedPlayerToRemove = ", fidPlayerToRemove);

        // check to see if all active players have voted
        bool hasAllActivePlayersVoted = true;
        for (uint i = 0; i < players.length; i++) {
            if(players[i].isRemoved == false && players[i].currentVotedPlayerToRemove == 0) {
                hasAllActivePlayersVoted = false;
                emit Log("hasAllActivePlayersVoted", 0);
                break;
            }
        }
    
        // if all players have voted, then remove the player with the most votes.
        // todo: separate this and following 2 pieces into a function and verify logic
        if(hasAllActivePlayersVoted == true) {
            // Shuffling the players introduces randomness to any tie votes between players with an equal number of votes
            // Player[] memory shuffledPlayers = psuedoShuffle(players);
            // Player[] memory shuffledPlayers = players; // todo: implement shuffle
            
            // Bug: In case of a tie, the lowest index player is always removed
            uint256 currentPlayerToRemove = players[0].fid;
            uint currentPlayerToRemoveVotes = 0;
            for (uint i = 0; i < players.length; i++) {
                if(players[i].isRemoved == false) {
                    // Count votes for the current player
                    uint votes = 0;
                    for (uint j = 0; j < players.length; j++) {
                        if(players[j].isRemoved == false && players[j].currentVotedPlayerToRemove == players[i].fid) {
                            votes++;
                        }
                    }
                    // Bug: In case of a tie, the lowest index player is always removed
                    // because of starting at 0 on players and using strict > here
                    if(votes > currentPlayerToRemoveVotes) {
                        currentPlayerToRemove = players[i].fid;
                        currentPlayerToRemoveVotes = votes;
                    }
                }
            }
            for (uint i = 0; i < players.length; i++) {
                if(players[i].fid == currentPlayerToRemove) {
                    emit Log("player is getting removed!", players[i].fid);
                    players[i].isRemoved = true;
                    break;
                }
            }

            // Clear all players' votes
            for (uint i = 0; i < players.length; i++) {
                players[i].currentVotedPlayerToRemove = 0;
            }

            // Run win check - one player left
            uint unremovedPlayers = 0;
            Player memory unremovedPlayer;
            for (uint i = 0; i < players.length; i++) {
                if(players[i].isRemoved == false) {
                    unremovedPlayers++;
                    unremovedPlayer = players[i];
                }
            }
            // unremovedPlayer.fid != 0 is a check to make sure the player is not an empty player
            if(unremovedPlayers == 1 && unremovedPlayer.fid != 0) {
                // winner!
                fidWinner = unremovedPlayer.fid;
            }

        }
    }

    function isWinner() public view returns (bool) {
        uint unremovedPlayers = 0;
        Player memory unremovedPlayer;
        for (uint i = 0; i < players.length; i++) {
            if(players[i].isRemoved == false) {
                unremovedPlayers++;
                unremovedPlayer = players[i];
            }
        }
        if(unremovedPlayers == 1) {
            // winner!
            return true;
        }
        return false;
    }

    // todo: invite more players

    // todo: start game
    
    function getPlayers() public view returns (Player[] memory) {
        return players;
    }

}
