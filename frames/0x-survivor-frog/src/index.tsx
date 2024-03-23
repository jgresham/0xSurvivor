import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { abiGetUserGames, abiNewGame, abiGamesContract } from './abi'
import { createPublicClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

// 2. Set up your client with desired chain & transport.
const viemClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})


export const app = new Frog({
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.use('/*', serveStatic({ root: './public' }))

// op and base sepolia
const GAMES_CONTRACT = '0xAeBA2Ac8cd42cD894C4F33eE75e1Cd733De988F1'
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
  return c.contract({ 
    abi: [abiGetUserGames], //contract abi
    chainId: fullChainId, 
    functionName: 'getUserGames', 
    to: GAMES_CONTRACT, // contract addr
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
      <Button.Transaction action='/afterNewGame' target="/newGame">New Game</Button.Transaction>,
      // <Button value="new-game">New Game</Button>,
      <Button value="my-games">My Games</Button>,
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

devtools(app, { serveStatic })
