import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { abiGetUserGames, abiNewGame, abiTestDeployment1 as myAbi } from './abi'

export const app = new Frog({
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.use('/*', serveStatic({ root: './public' }))

const GAMES_CONTRACT = '0xAeBA2Ac8cd42cD894C4F33eE75e1Cd733De988F1'

// 'eip155:10' is op-mainnet
/**
 * Check if the user is in a game!
 */
app.transaction('/getUserGames', (c) => {
  return c.contract({ 
    abi: [abiGetUserGames], //contract abi
    chainId: 'eip155:10', 
    functionName: 'getUserGames', 
    to: GAMES_CONTRACT, // contract addr
  }) 
})

app.transaction('/newGame', (c) => {
  console.log("app.transaction('/newGame'")
  return c.contract({ 
    abi: [abiNewGame], //contract abi
    chainId: 'eip155:10', 
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

app.frame('/', (c) => {
  const { buttonValue, inputText, status, frameData } = c
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
          { 'farcaster user id (fid): ' + fid }
          { 'network: ' + network }
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
      <Button value="website">Website</Button>,
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
