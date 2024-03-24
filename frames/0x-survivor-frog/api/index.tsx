import { serveStatic } from 'frog/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { 
  abiGetUserGames, 
  abiNewGame, 
  abiGamesContract, 
  abiGetUserGamesInput
} from './abi.js'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import { handle } from 'frog/vercel'
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
const client = new NeynarAPIClient('NEYNAR_FROG_FM');

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
const GAMES_CONTRACT = '0x87Df0b2af684382CCF563E052597309764162766'
// const GAMES_CONTRACT = '0xAeBA2Ac8cd42cD894C4F33eE75e1Cd733De988F1'


// '10' is op-mainnet
// 8453 is base-mainnet
// 84532 is base sepolia
// 7777777 is zora-mainnet
const fullChainId = 'eip155:84532'
/**
 * Check if the user is in a game!
 */
app.transaction('/getUserGames', (c) => {
  console.log("app.transaction /getUserGames called. c: ", JSON.stringify(c))
  console.log("app.transaction /getUserGames called for address" + c.address);
  // return c.contract({ 
  //   abi: [abiGetUserGames], //contract abi
  //   chainId: fullChainId, 
  //   functionName: 'getUserGames', 
  //   to: GAMES_CONTRACT, // contract addr
  // })
  return undefined
})

app.transaction('/getUserAddressHere', (c) => {
  console.log("user address: " + c.address);
  // typically: return c.contract({...})
  // what to return here if we don't want to call a contract?
})

app.frame('/userGames', async (c) => {
  console.log("app.frme /userGames called. c: ", JSON.stringify(c))
  const { transactionId, frameData } = c
  const games: BigInt[] = []
  if(frameData) {
    // const resp = await client.fetchBulkUsers([frameData.fid])
    const resp = await client.fetchBulkUsers([710])
    console.log("fetchBulkUsers resp: ", resp)

    // for each address, get games
    const users = resp.users
    if(users && users.length > 0) {
      const user = users[0]
      const addresses = user.verified_addresses.eth_addresses;
      for (const userAddrN of addresses) {
        const addrGames = await viemClient.readContract({
          address: GAMES_CONTRACT,
          abi: [abiGetUserGamesInput],
          functionName: 'getUserGames',
          args: [userAddrN]
        }) as BigInt[];
        games.push(...addrGames)
        console.log("user address:  " + userAddrN + " has games: ", addrGames, " games: ", games)
      }
    }
  }
  const gamesStr = games.map((game) => '#' + game.toString());
  const gamesStrJoin = gamesStr.join(", ")
  console.log(gamesStr, gamesStrJoin)
  // const { network } = frameData
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
       <p> {'games: ' + gamesStrJoin}</p>
       {/* <p>frameData: {JSON.stringify(frameData)}</p> */}
        {/* Network: {network} */}
      </div>
    ),
    intents: [
      // target (req'd): the app.transaction to call
      // action (opt): next frame
      <Button.Transaction action='/afterNewGame' target="/newGame">New Game</Button.Transaction>,
      <Button action='/game' >Join Game</Button>,
      <TextInput placeholder="Join a game. Enter game # and Join Game" />,
      <Button.Reset>Back</Button.Reset>,
    ],
  })
})

app.transaction('/newGame', (c) => {
  console.log("app.transaction('/newGame'")
  return c.contract({ 
    abi: [abiNewGame], //contract abi
    chainId: fullChainId, 
    functionName: 'newGame',
    to: GAMES_CONTRACT, // contract addr
  }) 
})

app.frame('/afterNewGame', (c) => {
  const { transactionId, frameData } = c
  // const { network } = frameData
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        New Game! Invite people to play!
        Transaction ID: {transactionId}
        {/* Network: {network} */}
      </div>
    )
  })
})

app.frame('/afterNewGame', (c) => {
  const { transactionId, frameData } = c
  // const { network } = frameData
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        New Game! Invite people to play!
        Transaction ID: {transactionId}
        {/* Network: {network} */}
      </div>
    )
  })
})

app.frame('/', async (c) => {
  console.log("app.frame / route called. c: ", JSON.stringify(c))
  const { buttonValue, inputText, status, frameData } = c
  // const targetAddress = c.address
  let fid = -1;
  let network = -1;
  if(frameData) {
    fid = frameData.fid
    network = frameData.network
  }
  let myGames;
  console.log("root route. buttonValue: ", buttonValue)
  if(buttonValue === "my-games") {

    // const data = await api.validateFrame(, {api_key: 'NEYNAR_FROG_FM'})
    // console.log("validateFrame Neynar data: ", data);
    // const result = await client.validateFrame({
    //   cast_reaction_context: true,
    //   follow_context: false,
    //   signer_context: false
    // })
    // console.log(result);
    const viemClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    })
    myGames = await viemClient.readContract({
      address: GAMES_CONTRACT,
      abi: abiGamesContract,
      functionName: 'getUserGames',
    })
    console.log("myGames: ", myGames)
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
            display: 'flex'
          }}
        >
          { buttonValue === undefined && (<>          { 'farcaster user id (fid): ' + fid }
          { 'network: ' + network }</>)}

          { buttonValue === 'my-games' && ( <>
            { (!myGames || myGames.length < 1) ? <>No games yet!</> : 'My Games: ' + myGames }
          </>)}
          {/* { 'targetAddress?: ' + targetAddress } */}
          {/* {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'} */}
        </div>
      </div>
    ),
    // action: '/finish',
    intents: [
      // target (req'd): the app.transaction to call
      // action (opt): next frame

      <Button.Transaction action='/afterNewGame' target="/newGame">New Game</Button.Transaction>,
      // <Button value="new-game">New Game</Button>,
      // <Button value="my-games">My Games</Button>,
      // <Button.Transaction action='/userGames' target='/getUserGames'>User Games</Button.Transaction>,
      <Button action='/userGames' >User Games</Button>,
      // <Button value="website">Website</Button>,
      // <TextInput placeholder="Enter a Farcaster username" />,
      // <TextInput placeholder="Enter your fruit..." />,
      // <Button placeholder="Enter your fruit2..." />,
      // <TextInput placeholder="Enter your fruit..." />,

      // <Button.Transaction target="/getUserGames">Show my games</Button.Transaction>,
      // <Button value="add-player">Add player</Button>,
      // <Button value="start-game">Start Game</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined'
// @ts-ignore
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development'
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic })
// if (process.env.NODE_ENV === 'development') {
//   devtools(app, { serveStatic })
// } else {
//   devtools(app, { assetsPath: '/.frog' }) 
// }


export const GET = handle(app)
export const POST = handle(app)