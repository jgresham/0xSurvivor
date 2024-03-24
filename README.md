# 0xSurvivor
an onchain round-based, elimination by voting, survivor game playable in a frame

## Description
A group of Farcaster users are invited to a survival game. Instead of surviving the elements, players try to survive elimination from other players in a round-voting-based elimination game.

One user interacts with the frame and invites other players using Farcaster Names. Then, the players can join the game by interacting with the same frame. Once the game starts, the players vote to remove a fellow player until one remains! 

## How its made
It's made with Frames, Smart Contracts, Neynar APIs, and Viem! When a Farcaster user "Creates a game and invites players by farcaster usernames", Neynar's api looks up the Farcaster ID for each username, then a smart contract is called which creates a game contract with the players in it. The game contract holds the players, current round of votes, and each player's elimination status. It also holds the logic for each round of voting. Each vote is a call to a smart contract.

The frame backend code uses viem to readContract data about the state of the game such as players, their status, winner, etc. 

### Future
In the future, I would like to create an XMTP group chat with all the players automatically added into the group to add an additional "behavioral" element to the game.

Real security on smart contracts using player's Farcaster `verified_addresses`
