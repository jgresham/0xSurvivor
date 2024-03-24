import { serveStatic } from 'frog/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { 
  abiGetUserGames, 
  abiNewGame, 
  abiGamesContract, 
  abiGetUserGamesInput,
  abiGame
} from './abi.js'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { handle } from 'frog/vercel'
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Player } from './player.js'

// make sure to set your NEYNAR_API_KEY .env
const neynarClient = new NeynarAPIClient('NEYNAR_FROG_FM');

// 2. Set up your client with desired chain & transport.
const viemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // browserLocation: '/index.html',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM',  })
})

// app.use('/*', serveStatic({ root: './public' }))

// op and base sepolia
const GAMES_CONTRACT = '0xdB985150e020909Ba731430ADFcBADd7bd2490A0'


// '10' is op-mainnet
// 8453 is base-mainnet
// 84532 is base sepolia
// 7777777 is zora-mainnet
const fullChainId = 'eip155:84532'

app.frame('/userGames', async (c) => {
  console.log("app.frame /userGames called. c: ", JSON.stringify(c))
  const { frameData } = c
  const games: BigInt[] = []
  if(frameData) {
    // const resp = await client.fetchBulkUsers([frameData.fid])
    const resp = await neynarClient.fetchBulkUsers([710])
    console.log("fetchBulkUsers resp: ", resp)

    // for each address, get games
    const users = resp.users
    if(users && users.length > 0) {
      const user = users[0]
      // const addresses = user.verified_addresses.eth_addresses;
        const addrGames = await viemClient.readContract({
          address: GAMES_CONTRACT,
          abi: [abiGetUserGamesInput],
          functionName: 'getUserGames',
          args: [user.fid]
        }) as BigInt[];
        games.push(...addrGames)
        console.log("user fid:  " + user.fid + " has games: ", addrGames, " games: ", games)
    }
  }
  const gamesStr = games.map((game) => '#' + game.toString());
  const gamesStrJoin = gamesStr.join(", ")
  console.log(gamesStr, gamesStrJoin)
  // const { network } = frameData
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', flexDirection: 'column', fontSize: 60 }}>
        <p> {games.length + " Total Games"}</p>
       <p> {'game numbers: ' + gamesStrJoin}</p>
       {/* <p>frameData: {JSON.stringify(frameData)}</p> */}
        {/* Network: {network} */}
      </div>
    ),
    intents: [
      // target (req'd): the app.transaction to call
      // action (opt): next frame
      <Button action='/newGame'>New Game</Button>,
      <Button action='/game' >Join Game</Button>,
      <TextInput placeholder="Enter game # and Join Game" />,
      <Button.Reset>Back</Button.Reset>,
    ],
  })
})

app.frame('/newGame', async (c) => {
  console.log("app.frame /newGame called. c: ", JSON.stringify(c))
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', flexDirection: 'column', fontSize: 45 }}>
       <p>Enter one or more comma separated Farcaster usernames. Example: dwr.eth, vitalik.eth, v</p>
       <p>Make sure players are on Warpcast and ready to play by Joining Game with this frame!</p>
       <caption>Max is 64 characters in a frame text input</caption>
      </div>
    ),
    intents: [
      // target (req'd): the app.transaction to call
      // action (opt): next frame
      <Button.Transaction action='/newGameCreatedNotStarted' target="/tCreateGameAndInvitePlayers">Invite Players</Button.Transaction>,
      // <Button.Transaction action='/game' target="/startGame">Start game</Button.Transaction>,
      <TextInput placeholder="Farcaster name(s)" />,
      <Button.Reset>Back</Button.Reset>,
    ],
  })
})

app.frame('/game', async (c) => {
  console.log("app.frame /game called. c: ", JSON.stringify(c))
  // todo: get contract data of the players invited, game id, etc
  // can use txn id here?
  const { transactionId, frameData, inputText } = c
  // todo: Join Game from inputText or txnId or newGameId?
  if(inputText !== undefined) {
    const gameId = 0;
    // get game data from viem
    // get fnames for players
    // show players and status
    const gameContract = await viemClient.readContract({
      address: GAMES_CONTRACT,
      abi: abiGamesContract,
      functionName: 'gameIdToGameContract',
      args: [gameId]
    })
    console.log("gameContract`, ", gameContract)
    const playersContractData = await viemClient.readContract({
      address: gameContract,
      abi: abiGame,
      functionName: 'getPlayers',
      args: [gameId]
    })
    console.log("playersContractData`, ", playersContractData)
  }

  let playersStrJoin = 'none'
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', flexDirection: 'column', fontSize: 45 }}>
       <p>{'Players: ' + playersStrJoin}</p>
      </div>
    ),
    intents: [
      // target (req'd): the app.transaction to call
      // action (opt): next frame
      <Button.Transaction action='/game' target="/tVoteOutPlayer">Vote out Player</Button.Transaction>,
      <TextInput placeholder="Farcaster name of player" />,
      <Button action='/game'>Refresh</Button>,
      <Button.Reset>Back</Button.Reset>,
    ],
  })
})

app.transaction('/tCreateGameAndInvitePlayers', async (c) => {
  console.log("app.transaction /tCreateGameAndInvitePlayers called. c: ", JSON.stringify(c))
  const { frameData, inputText } = c;
  if(!inputText) {
    throw new Error("No input text provided")
  }

  let viewerFid: BigInt = BigInt(-1);
  if(frameData) {
    if(frameData.fid) {
      viewerFid = BigInt(frameData.fid)
    }
  }
  // Remove whitespace using regular expression
  const inputWithoutWhitespace = inputText.replace(/\s/g, '');
  const fnames = inputWithoutWhitespace.split(',')
  // todo: use neynar apis to lookup each fname, get verified_addresses, and add to game constructor
  // game constructor should return the game id
  const players: Player[] = []

  // Form the player list input to the game constructor
  for ( const fname of fnames ) {
    const resp = await neynarClient.searchUser(fname, Number(viewerFid));
    console.log("searchUser resp: ", resp)
    if(resp.result.users && resp.result.users.length > 0) {
      const user = resp.result.users[0];
      if(user.username === fname) { 
        console.log("fname found: " + fname)
        const addresses = user.verified_addresses.eth_addresses;
        console.log("user: ", user, " addresses: ", addresses)

        players.push({
          fid: BigInt(user.fid),
          addresses: addresses,
          isRemoved: false,
          currentVotedPlayerToRemove: BigInt(0)
        } as Player)
      }
    }
  }


  return c.contract({ 
    abi: [abiNewGame], //contract abi
    chainId: fullChainId, 
    functionName: 'newGame',
    to: GAMES_CONTRACT, // contract addr
    args: [viewerFid, players]
  }) 
})

app.frame('/', async (c) => {
  console.log("app.frame / route called. c: ", JSON.stringify(c))
  const { status, frameData } = c
  // const targetAddress = c.address
  let fid = -1;
  let network = -1;
  if(frameData) {
    fid = frameData.fid
    network = frameData.network
  }

  // const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          backgroundImage: 'url(https://i.imgur.com/PwiRX5K.jpeg)',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            textShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h1>0xSurvivor</h1>
        </div>
      </div>
    ),
    intents: [
      // target (req'd): the app.transaction to call
      // action (opt): next frame
      <Button action='/newGame' >New Game</Button>,
      <Button action='/userGames' >My Games</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
// @ts-ignore
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })

export const GET = handle(app)
export const POST = handle(app)