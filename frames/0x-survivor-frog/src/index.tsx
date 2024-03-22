import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { abi as myAbi } from './abi'

export const app = new Frog({
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.use('/*', serveStatic({ root: './public' }))

const GAMES_CONTRACT = '0xd2135CfB216b74109775236E36d4b433F1DF507B'

// 'eip155:10' is op-mainnet
/**
 * Check if the user is in a game!
 */
app.transaction('/getUserGames', (c) => {
  return c.contract({ 
    abi: myAbi, //contract abi
    chainId: 'eip155:10', 
    functionName: 'getUserGames', 
    to: GAMES_CONTRACT, // contract addr
  }) 
})

app.transaction('/newGame', (c) => {
  return c.contract({ 
    abi: myAbi, //contract abi
    chainId: 'eip155:10', 
    functionName: 'newGame', 
    to: GAMES_CONTRACT, // contract addr
  }) 
})

app.frame('/', (c) => {
  const { buttonValue, inputText, status, frameData } = c
  const targetAddress = c.address
  let fid = -1;
  if(frameData) {
    fid = frameData.fid
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
          { 'targetAddress?: ' + targetAddress }
          {/* {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'} */}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

devtools(app, { serveStatic })
